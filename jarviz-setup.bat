if not defined in_subprocess (cmd /k set in_subprocess=y ^& %0 %*) & exit )
 "C:\Windows\System32\taskkill" /F /IM node.exe ^
 & @"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;C:\ProgramData\npm\chocolatey\bin" ^
 & "C:\ProgramData\chocolatey\bin\choco" upgrade -y nodejs.install --version 10.15.3 ^
 & "C:\ProgramData\chocolatey\bin\choco" upgrade -y git -params '"/GitAndUnixToolsOnPath"' ^
 & "C:\ProgramData\chocolatey\bin\choco" upgrade -y python2 visualstudio2017-workload-vctools ^
 & "C:\ProgramData\chocolatey\bin\choco" upgrade -y vscode ^
 & "C:\Windows\System32\setx" /M path "C:\ProgramData\npm;C:\Python27\;C:\Python27\Scripts;C:\WINDOWS\system32;C:\WINDOWS;C:\WINDOWS\System32\Wbem;C:\WINDOWS\System32\WindowsPowerShell\v1.0\;C:\ProgramData\chocolatey\bin;C:\Program Files\nodejs\;C:\Program Files\Git\cmd;C:\Program Files\Git\mingw64\bin;C:\Program Files\Git\usr\bin;C:\Program Files\Microsoft VS Code\bin;" ^
 & set path="C:\ProgramData\npm;C:\Python27\;C:\Python27\Scripts;C:\WINDOWS\system32;C:\WINDOWS;C:\WINDOWS\System32\Wbem;C:\WINDOWS\System32\WindowsPowerShell\v1.0\;C:\ProgramData\chocolatey\bin;C:\Program Files\nodejs\;C:\Program Files\Git\cmd;C:\Program Files\Git\mingw64\bin;C:\Program Files\Git\usr\bin;C:\Program Files\Microsoft VS Code\bin;" ^
 & rmdir c:\jarviz-receiver\ /q /s ^
 & mkdir c:\jarviz-receiver ^
 & cd c:\jarviz-receiver ^
 & "C:\Program Files\Git\cmd\git" clone https://github.com/dmwallace/jarviz-receiver.git . ^
 & "C:\Program Files\Git\cmd\git" checkout window-control ^
 & start c:\jarviz-receiver\jarviz-setup2.bat
pause
