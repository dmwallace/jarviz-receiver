if not defined in_subprocess (cmd /k set in_subprocess=y ^& %0 %*) & exit )
schtasks /delete /TN jarviz-receiver /F ^
 & taskkill /F /IM node.exe ^
 & @"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin" ^
 & choco install -y nodejs.install --version 10.15.3 ^
 & choco install -y git -params '"/GitAndUnixToolsOnPath"' ^
 & RefreshEnv ^
 & if exist c:\jarviz-receiver\ rmdir c:\jarviz-receiver\ /q /s ^
 & mkdir c:\jarviz-receiver ^
 & cd c:\jarviz-receiver ^
 & git clone https://github.com/dmwallace/jarviz-receiver.git . ^
 & git checkout window-control ^
 & if exist C:\etc\.pm2\ rmdir C:\etc\.pm2\ /q /s ^
 & SET PM2_HOME=C:\etc\.pm2 ^
 & SETX PM2_HOME C:\etc\.pm2 /m ^
 & pm2-startup install ^
 & npm install
pause