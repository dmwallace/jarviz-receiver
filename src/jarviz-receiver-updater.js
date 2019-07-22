const { execSync } = require('child_process')

setInterval(function() {
  execSync('git', ['pull'], { windowsHide: true, detatched: true })
}, 10000)
