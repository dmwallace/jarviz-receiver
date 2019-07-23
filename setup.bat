taskkill /F /IM node.exe
@"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
choco install -y nodejs.install --version 10.15.3
choco install -y git -params '"/GitAndUnixToolsOnPath"'
RefreshEnv
if exist c:\jarviz-receiver\ rmdir c:\jarviz-receiver\ /q /s
mkdir c:\jarviz-receiver
cd c:\jarviz-receiver
git clone https://github.com/dmwallace/jarviz-receiver.git .
git checkout window-control
npm install
pause