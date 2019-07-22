const { spawn } = require('child_process')

setInterval(function() {
  spawn('git', ['pull'], { windowsHide: true })
}, 10000)
