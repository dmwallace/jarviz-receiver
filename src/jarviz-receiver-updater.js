const { spawn } = require('child_process')

setInterval(function() {
  const cp = spawn('git', ['pull'], { windowsHide: true })
  cp.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  
  cp.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
  
  cp.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}, 10000)
