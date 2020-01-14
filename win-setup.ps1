Add-WindowsCapability –online –Name “Rsat.ActiveDirectory.DS-LDS.Tools~~~~0.0.1.0”
Enable-PSRemoting
Enter-PSSession
Enter-PSSession FOYS_CABANA2 -Authentication Default -Credential FOYS_CABANA1\csi