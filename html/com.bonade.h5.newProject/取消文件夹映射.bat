@echo off
echo ȡ���ļ���ӳ��
set /p path=������bnd-vue-seed�ļ���·��: 
rd/s/q %~dp0\assets
rd/s/q %~dp0\components
rd/s/q %~dp0\config
rd/s/q %~dp0\router
rd/s/q %~dp0\store
echo bnd-vue-seed�ļ���·���� %path%
md assets
move %path%\src\assets\fonts %~dp0\assets
move %path%\src\assets\images %~dp0\assets
move %path%\src\components %~dp0
move %path%\src\config %~dp0
move %path%\src\router %~dp0
move %path%\src\store %~dp0
pause