@echo off  
set /p path=������bnd-vue-seed�ļ���·��: 
echo bnd-vue-seed�ļ���·���� %path%
move config %path%\src
move components %path%\src
move router %path%\src
move store %path%\src
move assets\fonts %path%\src\assets\fonts
move assets\images %path%\src\assets\images
mklink /j %~dp0assets\fonts %path%\src\assets\fonts
mklink /j %~dp0assets\images %path%\src\assets\images
mklink /j %~dp0config %path%\src\config
mklink /j %~dp0components %path%\src\components
mklink /j %~dp0router %path%\src\router
mklink /j %~dp0store %path%\src\store
pause