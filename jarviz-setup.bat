if not defined in_subprocess (cmd /k set in_subprocess=y ^& %0 %*) & exit )
schtasks /delete /TN jarviz-receiver /F ^
 & taskkill /F /IM node.exe ^
 & @"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin" ^
 & choco upgrade -y nodejs.install --version 10.15.3 ^
 & choco upgrade -y git -params '"/GitAndUnixToolsOnPath"' ^
 & choco upgrade -y python2 visualstudio2017-workload-vctools ^
 & choco upgrade -y vscode ^
 & RefreshEnv ^
 & rmdir c:\jarviz-receiver\ /q /s ^
 & mkdir c:\jarviz-receiver ^
 & cd c:\jarviz-receiver ^
 & git clone https://github.com/dmwallace/jarviz-receiver.git . ^
 & git checkout window-control ^
 & rmdir C:\etc\.pm2\ /q /s ^
 & SET PM2_HOME=C:\etc\.pm2 ^
 & SETX PM2_HOME C:\etc\.pm2 /m ^
 & npm install -g node-gyp ^
 & npm install -g pm2@3 ^
 & npm install
pause