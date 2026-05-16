$OutputFile = "c:\Users\user\AI 기업 두뇌\내 작업들\specs.txt"

$cpu = Get-CimInstance Win32_Processor | Select-Object -ExpandProperty Name
$ram = [Math]::Round((Get-CimInstance Win32_PhysicalMemory | Measure-Object -Property Capacity -Sum).Sum / 1GB, 2)
$gpu = Get-CimInstance Win32_VideoController | Select-Object -ExpandProperty Name
$os = Get-CimInstance Win32_OperatingSystem | Select-Object -ExpandProperty Caption
$disk = Get-CimInstance Win32_LogicalDisk | Where-Object DriveType -eq 3 | Select-Object DeviceID, @{Name="Size(GB)";Expression={[Math]::Round($_.Size / 1GB, 2)}}, @{Name="Free(GB)";Expression={[Math]::Round($_.FreeSpace / 1GB, 2)}}

$output = @"
===== 시스템 사양 =====
CPU: $cpu
RAM: ${ram}GB
GPU: $($gpu -join ', ')
OS: $os
=======================

[디스크 정보]
"@

$output | Out-File -FilePath $OutputFile -Encoding utf8
$disk | Format-Table -AutoSize | Out-File -FilePath $OutputFile -Encoding utf8 -Append

Write-Host "컴퓨터 사양 조회가 완료되었습니다. specs.txt 파일을 생성했습니다."
Start-Sleep -Seconds 3
