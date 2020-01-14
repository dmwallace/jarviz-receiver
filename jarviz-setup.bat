taskkill /F /IM node.exe
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;C:\ProgramData\chocolatey\bin"
choco upgrade -y nodejs.install --version 10.15.3
choco upgrade -y git -params '"/GitAndUnixToolsOnPath"'
choco upgrade -y python2 visualstudio2017-workload-vctools
choco upgrade -y vscode
rmdir c:\jarviz-receiver\ /q /s
mkdir c:\jarviz-receiver
cd c:\jarviz-receiver
set npm_path=C:\ProgramData\npm
set node_path=C:\Program Files\nodejs
set git_path=C:\Program Files\Git\cmd
echo PATH=%path%
echo %path%|find /i "%npm_path%">nul || setx /M PATH %npm_path%;"%path%"
set path=%npm_path%;%path%
echo %path%|find /i "%node_path%">nul || setx /M PATH %node_path%;"%path%"
set path=%node_path%;%path%
echo %path%|find /i "%git_path%">nul || setx /M PATH %git_path%;"%path%"
set path=%git_path%;%path%
set PM2_HOME=C:\etc\.pm2
setx /M PM2_HOME C:\etc\.pm2
git clone https://github.com/dmwallace/jarviz-receiver.git .
git checkout master
rmdir C:\etc\.pm2\ /q /s
mkdir C:\etc
mkdir C:\etc\.pm2
icacls C:\etc\.pm2 /grant "Authenticated Users":RX /T
mkdir C:\ProgramData\npm\npm-cache
mkdir C:\ProgramData\npm\npm
mkdir C:\ProgramData\npm\npm\node_modules
icacls C:\ProgramData\npm\npm-cache /grant "Authenticated Users":RX
icacls C:\ProgramData\npm\npm /grant "Authenticated Users":RX
icacls C:\ProgramData\npm\npm\node_modules /grant "Authenticated Users":RX
icacls C:\ProgramData\npm\npm-cache /grant "Administrators":M
icacls C:\ProgramData\npm\npm /grant "Administrators":M
icacls C:\ProgramData\npm\npm\node_modules /grant "Administrators":M
npm config --global set prefix "C:\ProgramData\npm"
npm config --global set prefix "C:\ProgramData\npm"
npm install -g node-gyp
npm install -g pm2@3
schtasks /delete /TN jarviz-receiver /F
cd \jarviz-receiver
npm install
rmdir %APPDATA%\npm /q /s
