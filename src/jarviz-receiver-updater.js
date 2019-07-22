const { spawn } = require('child_process')

setInterval(function() {
  execSync('git', ['pull'], { windowsHide: true })
}, 10000)
