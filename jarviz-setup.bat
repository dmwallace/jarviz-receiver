"C:\Windows\System32\taskkill" /F /IM node.exe ^
 & @"%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -InputFormat None -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;C:\ProgramData\npm\chocolatey\bin" ^
 & "C:\ProgramData\chocolatey\bin\choco" upgrade -y nodejs.install --version 10.15.3 ^
 & "C:\ProgramData\chocolatey\bin\choco" upgrade -y git -params '"/GitAndUnixToolsOnPath"' ^
 & "C:\ProgramData\chocolatey\bin\choco" upgrade -y python2 visualstudio2017-workload-vctools ^
 & "C:\ProgramData\chocolatey\bin\choco" upgrade -y vscode ^
 & rmdir c:\jarviz-receiver\ /q /s ^
 & mkdir c:\jarviz-receiver ^
 & cd c:\jarviz-receiver ^
 & "C:\Program Files\Git\cmd\git" clone https://github.com/dmwallace/jarviz-receiver.git . ^
 & "C:\Program Files\Git\cmd\git" checkout window-control ^
 & start c:\jarviz-receiver\jarviz-setup2.bat
pause