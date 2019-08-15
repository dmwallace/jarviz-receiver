set PM2_HOME=C:\etc\.pm2 ^
 & setx /M PM2_HOME C:\etc\.pm2 ^
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
