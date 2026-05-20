@echo off
chcp 65001 > nul
echo 컴퓨터 절전 모드 설정을 확인하는 중입니다...
powercfg /q SCHEME_CURRENT SUB_SLEEP STANDBYIDLE > "c:\Users\user\AI 기업 두뇌\내 작업들\sleep_status.txt"
echo 확인 완료! 이제 터미널 창을 닫으셔도 됩니다.
pause
