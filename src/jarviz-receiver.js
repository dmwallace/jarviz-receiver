const express = require('express')
const os = require('os')
const { spawn } = require('child_process')
const bodyParser = require('body-parser')
const cors = require('cors')
const fkill = require('fkill')
const net = require('net')
const fs = require('fs')
const loudness = require('loudness')
const robot = require('robotjs')
const ffi = require('ffi')
const hide = require('node-hide')
const DEFAULT_AUDIO_INCREMENT = 10

let packageJSON = JSON.parse(fs.readFileSync(`${__dirname}/../package.json`, 'utf8'))
console.log('\n----------------------------------------------------------------------')
console.log(`Jarviz Receiver version: ${packageJSON.version}\n`)
console.log(`Hostname: ${os.hostname()}\n`)
console.log('Network Interfaces:')

var ifaces = os.networkInterfaces()

var currentAppId
var currentScenarioId

let isBusy = false

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0
  
  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return
    }
    
    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address)
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address)
    }
    ++alias
  })
})
console.log('----------------------------------------------------------------------\n')

const app = express()
app.use(cors())
app.use(bodyParser.json())       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true,
}))

//let child = null
let children = {}

process.on('unhandledRejection', r => console.error(r))

getVolume = (req, res) => {
  return loudness.getVolume().then((volume) => {
    res.send(JSON.stringify({ result: { volume } }))
    return volume
  }).catch((error) => {
    res.send(JSON.stringify({ error }))
    return error
  })
}

getMuted = (req, res) => {
  return loudness.getMuted().then((muted) => {
    res.send(JSON.stringify({ result: { muted } }))
    return muted
  }).catch((error) => {
    res.send(JSON.stringify({ error }))
    return error
  })
}

setVolumeDelta = (req, res, direction = 1) => {
  const increment = req.params.increment || DEFAULT_AUDIO_INCREMENT
  return loudness.getVolume().then((volume) => {
    return loudness.setVolume(newVolume).then(() => {
      res.send(JSON.stringify({ result: { volume: newVolume } }))
    })
  }).catch((error) => {
    res.send(JSON.stringify({ error }))
  })
}
app.get('/getVolume', getVolume)

app.get('/getMuted', getMuted)

app.get('/setVolume/:volume', async (req, res) => {
  const { volume } = req.params
  
  loudness.setVolume(volume).then(() => {
    console.log(`System audio volume set to ${volume}`)
    res.send(JSON.stringify({ result: { volume } }))
  }).catch((error) => {
    console.error(error)
    res.send(JSON.stringify({ error }))
  })
})

app.get('/increaseVolume/:increment?', (res, req) => setVolumeDelta(res, req, 1))
app.get('/decreaseVolume/:increment?', (res, req) => setVolumeDelta(res, req, -1))

app.get('/mute', async (req, res) => {
  loudness.setMuted(true).then(() => {
    console.log(`System audio volume muted`)
  })
})

app.get('/unmute', async (req, res) => {
  loudness.setMuted(false).then(() => {
    console.log(`System audio volume unmuted`)
  })
})

app.get('/toggleMute', async (req, res) => {
  loudness.getMuted().then((muted) => {
    muted = !muted
    loudness.setMuted(muted).then(() => {
      res.send(JSON.stringify({ result: { muted } }))
      console.log(`System audio volume ${muted ? 'muted' : 'unmuted'}`)
    })
  })
})

app.post(`/telnet`, async (req, res) => {
  console.log(`\n\n${new Date().toISOString()} NEW TELNET COMMAND ---------------------------`)
  console.log('req.body', req.body)
  
  try {
    let result = await sendTelnetCommand(req.body)
    res.send(JSON.stringify({ result }))
  } catch (error) {
    res.send(JSON.stringify({ error: error.toString() }))
  }
})

app.get('/ping', async (req, res) => {
  console.log(`\n\n${new Date().toISOString()} PING REQUEST ---------------------------`)
  
  let response = {
    hostname: os.hostname(),
  }
  
  console.log('response', response)
  
  res.send(JSON.stringify(response))
})

app.get('/poll', async (req, res) => {
  let response = {
    hostname: os.hostname(),
  }
})

app.post('/kill', async (req, res) => {
  console.log(`\n\n${new Date().toISOString()} NEW KILL REQUEST ---------------------------`)
  
  let { results, errors } = await killProcess()
  
  res.send(JSON.stringify({ results, errors }))
})

async function wait (ms = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true)
    }, ms)
  })
}

async function doRobot () {
  const screenSize = robot.getScreenSize()
  robot.moveMouse(screenSize.width - 1, screenSize.height - 1)
  // pause briefly before spawning
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true)
    }, 100)
  })
  robot.mouseClick()
  
  // pause briefly before spawning
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true)
    }, 100)
  })
}

async function setForegroundWindow (name) {
  var user32 = new ffi.Library('user32', {
    'GetTopWindow': ['long', ['long']],
    'FindWindowA': ['long', ['string', 'string']],
    'SetActiveWindow': ['long', ['long']],
    'SetForegroundWindow': ['bool', ['long']],
    'BringWindowToTop': ['bool', ['long']],
    'ShowWindow': ['bool', ['long', 'int']],
    'SwitchToThisWindow': ['void', ['long', 'bool']],
    'GetForegroundWindow': ['long', []],
    'AttachThreadInput': ['bool', ['int', 'long', 'bool']],
    'GetWindowThreadProcessId': ['int', ['long', 'int']],
    'SetWindowPos': ['bool', ['long', 'long', 'int', 'int', 'int', 'int', 'uint']],
    'SetFocus': ['long', ['long']],
  })
  
  var kernel32 = new ffi.Library('Kernel32.dll', {
    'GetCurrentThreadId': ['int', []],
  })
  
  var winToSetOnTop = user32.FindWindowA(null, name)
  console.log('winToSetOnTop', winToSetOnTop)
  
  var foregroundHWnd = user32.GetForegroundWindow()
  var currentThreadId = kernel32.GetCurrentThreadId()
  var windowThreadProcessId = user32.GetWindowThreadProcessId(foregroundHWnd, null)
  var showWindow = user32.ShowWindow(winToSetOnTop, 9)
  var setWindowPos1 = user32.SetWindowPos(winToSetOnTop, -1, 0, 0, 0, 0, 3)
  var setWindowPos2 = user32.SetWindowPos(winToSetOnTop, -2, 0, 0, 0, 0, 3)
  var setForegroundWindow = user32.SetForegroundWindow(winToSetOnTop)
  var attachThreadInput = user32.AttachThreadInput(windowThreadProcessId, currentThreadId, 0)
  var setFocus = user32.SetFocus(winToSetOnTop)
  var setActiveWindow = user32.SetActiveWindow(winToSetOnTop)
  console.log('setActiveWindow', setActiveWindow)
  
}

async function spawnChild ({ id, command, cwd, args }, res) {
  let { results, errors } = await killProcess()
  
  if (errors.find((err) => err === 'busy')) {
    res.send(JSON.stringify({ results, errors }))
    console.log('\nRESULTS:', JSON.stringify(results, null, 3))
    console.log('ERRORS:', JSON.stringify(errors, null, 3))
    return
  }
  
  //robot.keyTap('d', 'command')
  
  /*
  var child2 = spawn(
    'explorer.exe',
    ['shell:::{3080F90D-D7AD-11D9-BD98-0000947B0257}'],
  )*/
  
  /*var child2 = spawn('cmd.exe', ['/c', 'c:\\jarviz-receiver\\showdesktop.bat'])
  console.log("child", child);
  */
  
  console.log('spawning')
  if (args && args.length > 0) {
    args = args.split(' ')
  }
  
  if (!Array.isArray(args)) {
    args = []
  }
  
  //await doRobot()
  
  let child = spawn(
    cmd,//'chrome.exe',
    args, //['news.com.au'],
    {
      cwd,
      windowsHide: true,
    },
  )
  
  children[child.pid] = child
  
  child.stdout.on('data', function (data) {
    //console.log('stdout: ' + data)
  })
  child.stderr.on('data', function (data) {
    //console.log('stdout: ' + data)
  })
  child.on('close', function (code) {
    //console.log(`Child ${child.spawnfile} PID: ${child.pid} closed with code: ${code}`)
  })
  child.on('error', (err) => {
    if (err) console.log(err)
    errors.push(err)
  })
  
  /*let executeCommand = `"${cwd}${command}" ${args}`
  console.log("executeCommand", executeCommand)
  
  child = exec(executeCommand, (error, stdout, stderr) => {
     if (error) {
        console.error(`exec error: ${error}`)
        errors.push(error)
     } else {
        results.push(stdout)
        errors.push(stderr)
     }
  })

  console.log("child", child)*/
  
  if (child) {
    /*hide.visableWindows(function (data) {
      console.log(JSON.stringify(data)) //List all the Visable Windows
      console.log("Object.keys(data)", Object.keys(data));
      
      hide.minimizeWindow(Object.keys(data));
    });
    
    await wait(5000)
    
    
    
    
    setForegroundWindow('Chrome')*/
    
    child.processName = command
    results.push(`spawned process ${child.spawnfile} with PID: ${child.pid}`)
    res.send(JSON.stringify({ results, errors }))
    console.log('\nRESULTS:', JSON.stringify(results, null, 3))
    console.log('ERRORS:', JSON.stringify(errors, null, 3))
  } else {
    setTimeout(() => { // wait for application launch errors
      res.send(JSON.stringify({ results, errors }))
      console.log('\nRESULTS:', JSON.stringify(results, null, 3))
      console.log('ERRORS:', JSON.stringify(errors, null, 3))
    }, 1000)
  }
}

app.post('/launch', async (req, res) => {
  console.log(`\n\n${new Date().toISOString()} NEW LAUNCH REQUEST ---------------------------`)
  
  console.log('req.body', req.body)
  
  spawnChild(req.body, res)
  
})

async function killProcess () {
  
  let results = []
  let errors = []
  
  if (isBusy) {
    errors.push(`busy`)
    return Promise.resolve({ results, errors })
  }
  //isBusy = true
  await Promise.all(Object.entries(children).map(([pid, child]) => {
    return new Promise((resolve) => {
      if (child && child.pid) {
        console.log(`killing ${child.spawnfile} with PID: ${child.pid}`)
        
        /*await fkill(child.pid, {force: true}).then(() => {
          results.push(`process with PID: ${child.pid} successfully terminated`)
        }).catch((err) => {
          console.log(`\nCant kill process by PID: ${child.pid}, attempting to kill by name: ${child.processName || child.spawnfile}`)
          //if (err) console.error(err)
          
          return fkill(child.processName || child.spawnfile, {force: true}).then(() => {
            results.push(`process with name: ${child.spawnfile} successfully terminated`)
          }).catch((err) => {
            if (child && child.pid) { // swallow some errors related to nonexistant processes so long as child has been killed
              if (err) console.error(err)
              errors.push(`could not kill process with PID: ${child.pid} \n${JSON.stringify(err)}`)
            }
          })
        })*/
        
        let taskkill = spawn(
          'taskkill',
          ['/pid', child.pid],
          {
            windowsHide: true,
          },
        )
        
        taskkill.stdout.on('data', function (data) {
          let str = data.toString()
          
          console.log('stdout: ' + str)
          
          if (str.substr(0, 'ERROR'.length === 'ERROR')) {
            errors.push(str)
          } else {
            results.push(str)
            delete children[pid]
          }
          
        })
        taskkill.stderr.on('data', function (data) {
          console.log('stdout: ' + data)
        })
        taskkill.on('close', function (code) {
          
          console.log('\nRESULTS:', JSON.stringify(results, null, 2))
          console.log('ERRORS:', JSON.stringify(errors, null, 2))
          //child = null
          
          isBusy = false
          resolve({ results, errors })
        })
        taskkill.on('error', (err) => {
          if (err) console.log(err)
          errors.push(err)
        })
      } else {
        isBusy = false
        resolve({ results, errors })
      }
    })
  }))
  
  return { results, errors }
}

var telnetQueues = {}
var telnetBusy = false
var telnetQueue = []

function popTelnetQueue () {
  if (telnetQueue.length > 0) {
    sendTelnetCommand(telnetQueue.shift())
  }
}

async function sendTelnetCommand ({ cmd, host, port = 23, username, retries = 0, deferred = new Deferred() }) {
  console.log('telnetBusy', telnetBusy)
  if (telnetBusy) {
    // if telnet is busy the command plus a deferred promise for returning the result to the calling function is pushed to a queue
    
    telnetQueue.push({ cmd, host, port, username, retries: retries + 1, deferred })
    console.log('telnetQueue.length', telnetQueue.length)
    
    return deferred.promise
  }
  
  console.log(`sendTelnetCommand(${cmd})`)
  
  telnetBusy = true
  
  var socket = net.connect(port, host, function () {
    console.log('Sending data')
    //socket.write("hello\r\n")
    console.log('Telnet connection ready')
    
    let onDataCount = 0
    
    socket.on('data', function (data) {
      let str = data.toString()
      
      onDataCount++
      console.log('\nreceived data')
      
      console.log('data', data.toString())
      console.log('onDataCount', onDataCount)
      
      switch (onDataCount) {
        case 1:
          // login
          console.log('login')
          socket.write(`${username}\r\n`)
          break
        case 2:
          // carriage return
          console.log('send carriage return')
          socket.write('\r\n')
          break
        case 3:
          // command
          console.log(`send data: ${cmd}\r\n`)
          socket.write(`${cmd}\r\n`)
          break
        default:
          console.log('closing telnet connection')
          socket.end()
          deferred.resolve(`Telnet command: ${cmd} sent successfully to ${host}:${port}`)
          telnetBusy = false
          popTelnetQueue()
          break
      }
    })
  })
  
  socket.on('error', function (err) {
    console.log(err)
    
    deferred.reject(new Error(`Failed to send Telnet command: ${cmd} to ${host}:${port}\n${err.message}`))
    
    telnetBusy = false
    popTelnetQueue()
  })
  
  return deferred.promise
}

class Deferred {
  constructor () {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject
      this.resolve = resolve
    })
  }
}

module.exports = app
