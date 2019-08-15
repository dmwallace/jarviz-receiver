if not defined in_subprocess (cmd /k set in_subprocess=y ^& %0 %*) & exit )
 rmdir C:\etc\.pm2\ /q /s ^
 & mkdir C:\etc ^
 & mkdir C:\etc\.pm2 ^
 & icalcs C:\etc\.pm2 /grant "Authenticated Users":RX /T ^
 & setx /M PM2_HOME C:\etc\.pm2 ^
 & setx /M PATH "C:\ProgramData\npm;%PATH%" ^
 & set PM2_HOME=C:\etc\.pm2 ^
 & set PATH="C:\ProgramData\npm;%PATH%" ^
 & rmdir %APPDATA%\npm /q /s ^
 & mkdir C:\ProgramData\npm\npm-cache ^
 & mkdir C:\ProgramData\npm\npm ^
 & mkdir C:\ProgramData\npm\npm\node_modules ^
 & icalcs C:\ProgramData\npm\npm-cache /grant "Authenticated Users":RX ^
 & icalcs C:\ProgramData\npm\npm /grant "Authenticated Users":RX ^
 & icalcs C:\ProgramData\npm\npm\node_modules /grant "Authenticated Users":RX ^
 & icalcs C:\ProgramData\npm\npm-cache /grant "Administrators":M ^
 & icalcs C:\ProgramData\npm\npm /grant "Administrators":M ^
 & icalcs C:\ProgramData\npm\npm\node_modules /grant "Administrators":M ^
 & npm config --global set prefix "C:\ProgramData\npm" ^
 & npm config --global set prefix "C:\ProgramData\npm" ^
 & npm install -g node-gyp ^
 & npm install -g pm2@3 ^
 & schtasks /delete /TN jarviz-receiver /F ^
 & npm install
pause
