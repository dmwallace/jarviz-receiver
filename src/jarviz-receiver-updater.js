var pmx = require('pmx')
var pm2 = require('../node_modules/pm2')
var async = require('async')
//var pkg = require('./package.json');
const { execSync } = require('child_process')

var Probe = pmx.probe()

var app_updated = Probe.counter({
  name: 'Updates',
})

function autoPull (cb) {
  pm2.list(function (err, procs) {
    if (err) return console.error(err)
    
    async.forEachLimit(procs, 1, function (proc, next) {
      
      if (proc.name === 'jarviz-receiver' && proc.pm2_env && proc.pm2_env.versioning) {
        
        //console.log('JSON.stringify(proc.pm2_env.versioning, null, 2)', JSON.stringify(proc.pm2_env.versioning, null, 2))
        
        pm2.pullAndReload(proc.name, function (err, meta) {
          
          //console.log('meta', meta)
          if (meta) {
            app_updated.inc()
            
            //console.log('>>>>>>>>>>>>> Successfully pulled Application! [App name: %s]', proc.name)
            
            execSync('npm', ['install'], { windowsHide: true, detached: true})
            console.log('installed')
          }
          if (err) {
            //console.error(err)
            //console.log('App %s already at latest version', proc.name)
          }
          
          return next()
        })
      } else next()
    }, cb)
    
  })
}

pmx.initModule({
  widget: {
    type: 'generic',
    theme: ['#111111', '#1B2228', '#807C7C', '#807C7C'],
    
    el: {
      probes: true,
      actions: true,
    },
    
    block: {
      actions: true,
      issues: true,
      meta: true,
      cpu: true,
      mem: true,
    },
    
    // Status
    // Green / Yellow / Red
  },
}, function (err, conf) {
  pm2.connect(function () {
    var running = false
    
    const go = function () {
      if (running == true) return false
      
      running = true
      autoPull(function () {
        running = false
      })
    }
    
    setInterval(go, conf.interval || 6000);
    go()
  })
})
