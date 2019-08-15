if not defined in_subprocess (cmd /k set in_subprocess=y ^& %0 %*) & exit )
 taskkill /F /IM node.exe ^
 & @"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;C:\ProgramData\npm\chocolatey\bin" ^
 & choco upgrade -y nodejs.install --version 10.15.3 ^
 & choco upgrade -y git -params '"/GitAndUnixToolsOnPath"' ^
 & choco upgrade -y python2 visualstudio2017-workload-vctools ^
 & choco upgrade -y vscode ^
 & set PATH="C:\ProgramData\npm;C:\Program Files\nodejs;C:\Program Files\Git\cmd\;Windows\System32;%PATH%" ^
 & rmdir c:\jarviz-receiver\ /q /s ^
 & mkdir c:\jarviz-receiver ^
 & cd c:\jarviz-receiver ^
 & "C:\Program Files\Git\cmd\git" clone https://github.com/dmwallace/jarviz-receiver.git . ^
 & "C:\Program Files\Git\cmd\git" checkout window-control ^
 & rmdir C:\etc\.pm2\ /q /s ^
 & mkdir C:\etc ^
 & mkdir C:\etc\.pm2 ^
 & "C:\Windows\System32\icacls" C:\etc\.pm2 /grant "Authenticated Users":RX /T ^
 & "C:\Windows\System32\setx" /M PM2_HOME C:\etc\.pm2 ^
 & "C:\Windows\System32\setx" /M PATH "C:\ProgramData\npm;C:\Program Files\nodejs;%SystemRoot%\System32;%PATH%" ^
 & set PM2_HOME=C:\etc\.pm2 ^
 & rmdir %APPDATA%\npm /q /s ^
 & mkdir C:\ProgramData\npm\npm-cache ^
 & mkdir C:\ProgramData\npm\npm ^
 & mkdir C:\ProgramData\npm\npm\node_modules ^
 & "C:\Windows\System32\icacls" C:\ProgramData\npm\npm-cache /grant "Authenticated Users":RX ^
 & "C:\Windows\System32\icacls" C:\ProgramData\npm\npm /grant "Authenticated Users":RX ^
 & "C:\Windows\System32\icacls" C:\ProgramData\npm\npm\node_modules /grant "Authenticated Users":RX ^
 & "C:\Windows\System32\icacls" C:\ProgramData\npm\npm-cache /grant "Administrators":M ^
 & "C:\Windows\System32\icacls" C:\ProgramData\npm\npm /grant "Administrators":M ^
 & "C:\Windows\System32\icacls" C:\ProgramData\npm\npm\node_modules /grant "Administrators":M ^
 & "C:\Program Files\nodejs\npm" config --global set prefix "C:\ProgramData\npm" ^
 & "C:\Program Files\nodejs\npm" config --global set prefix "C:\ProgramData\npm" ^
 & "C:\Program Files\nodejs\npm" install -g node-gyp ^
 & "C:\Program Files\nodejs\npm" install -g pm2@3 ^
 & "C:\Windows\System32\schtasks" /delete /TN jarviz-receiver /F ^
 & "C:\Program Files\nodejs\npm" install
pause
