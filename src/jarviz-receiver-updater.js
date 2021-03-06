const { spawn } = require('child_process')

let isUpdating = false

setInterval(function() {
  if(isUpdating) {
    console.log("already updating");
    return
  }
  
  isUpdating = true
  console.log("Checking for update...");


  const cp = spawn('rm c:/jarviz-receiver/.git/*.lock & rm c:/jarviz-receiver/.git/refs/heads/*.lock & git reset --hard & git pull', { shell: true, windowsHide: true })
  cp.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  
  cp.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
  
  cp.on('close', (code) => {
    //console.log(`child process exited with code ${code}`);
    isUpdating = false
  });
}, 10000)
