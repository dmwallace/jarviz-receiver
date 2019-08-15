if not defined in_subprocess (cmd /k set in_subprocess=y ^& %0 %*) & exit )
 set PM2_HOME=C:\etc\.pm2 ^
 & set PATH="C:\ProgramData\npm;%PATH%" ^
 & "C:\Windows\System32\setx" /M path "C:\ProgramData\npm;C:\Python27\;C:\Python27\Scripts;C:\WINDOWS\system32;C:\WINDOWS;C:\WINDOWS\System32\Wbem;C:\WINDOWS\System32\WindowsPowerShell\v1.0\;C:\ProgramData\chocolatey\bin;C:\Program Files\nodejs\;C:\Program Files\Git\cmd;C:\Program Files\Git\mingw64\bin;C:\Program Files\Git\usr\bin;C:\Program Files\Microsoft VS Code\bin;" ^
 & set path="C:\ProgramData\npm;C:\Python27\;C:\Python27\Scripts;C:\WINDOWS\system32;C:\WINDOWS;C:\WINDOWS\System32\Wbem;C:\WINDOWS\System32\WindowsPowerShell\v1.0\;C:\ProgramData\chocolatey\bin;C:\Program Files\nodejs\;C:\Program Files\Git\cmd;C:\Program Files\Git\mingw64\bin;C:\Program Files\Git\usr\bin;C:\Program Files\Microsoft VS Code\bin;" ^
 & setx /M PM2_HOME C:\etc\.pm2 ^
 & setx /M PATH "C:\ProgramData\npm;%PATH%" ^
 & rmdir C:\etc\.pm2\ /q /s ^
 & mkdir C:\etc ^
 & mkdir C:\etc\.pm2 ^
 & icacls C:\etc\.pm2 /grant "Authenticated Users":RX /T ^
 & rmdir %APPDATA%\npm /q /s ^
 & mkdir C:\ProgramData\npm\npm-cache ^
 & mkdir C:\ProgramData\npm\npm ^
 & mkdir C:\ProgramData\npm\npm\node_modules ^
 & icacls C:\ProgramData\npm\npm-cache /grant "Authenticated Users":RX ^
 & icacls C:\ProgramData\npm\npm /grant "Authenticated Users":RX ^
 & icacls C:\ProgramData\npm\npm\node_modules /grant "Authenticated Users":RX ^
 & icacls C:\ProgramData\npm\npm-cache /grant "Administrators":M ^
 & icacls C:\ProgramData\npm\npm /grant "Administrators":M ^
 & icacls C:\ProgramData\npm\npm\node_modules /grant "Administrators":M ^
 & npm config --global set prefix "C:\ProgramData\npm" ^
 & npm config --global set prefix "C:\ProgramData\npm" ^
 & npm install -g node-gyp ^
 & npm install -g pm2@3 ^
 & schtasks /delete /TN jarviz-receiver /F ^
 & npm install
pause
