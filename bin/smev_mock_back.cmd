cd c:\projects\subsidies\ws\smev_mock\back\lib

type nul > c:\projects\subsidies\ws\smev_mock\back\logs\app.log
type nul > c:\projects\subsidies\ws\smev_mock\back\logs\db.log
type nul > c:\projects\subsidies\ws\smev_mock\back\logs\f_s.log
type nul > c:\projects\subsidies\ws\smev_mock\back\logs\http.log
type nul > c:\projects\subsidies\ws\smev_mock\back\logs\js.log
type nul > c:\projects\subsidies\ws\smev_mock\back\logs\queue.log

taskkill /F /IM baretail.exe

start c:\projects\subsidies\ws\smev_mock\back\logs\app.log
rem start c:\projects\subsidies\ws\smev_mock\back\logs\db.log
rem start c:\projects\subsidies\ws\smev_mock\back\logs\f_s.log
start c:\projects\subsidies\ws\smev_mock\back\logs\http.log
start c:\projects\subsidies\ws\smev_mock\back\logs\js.log
rem start c:\projects\subsidies\ws\smev_mock\back\logs\queue.log

node index > ..\logs\js.log 2>&1

pause