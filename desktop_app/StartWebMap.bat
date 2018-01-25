@echo off
:: Parts of this script originally authored by Eric Falsken

SET "DBservice=postgresql-x64-9.2"

SC query %DBservice% | FIND "STATE" >NUL
IF errorlevel 1 GOTO SystemOffline

:ResolveInitialState
SC query %DBservice% | FIND "STATE" | FIND "STOPPED" >NUL
IF errorlevel 0 IF NOT errorlevel 1 GOTO StartService
SC query %DBservice% | FIND "STATE" | FIND "RUNNING" >NUL
IF errorlevel 0 IF NOT errorlevel 1 GOTO StartedService
SC query %DBservice% | FIND "STATE" | FIND "PAUSED" >NUL
IF errorlevel 0 IF NOT errorlevel 1 GOTO SystemOffline
echo Service State is changing, waiting for service to resolve its state before making changes
sc query %DBservice% | Find "STATE"
timeout /t 2 /nobreak >NUL
GOTO ResolveInitialState

:StartService
echo Starting %DBservice% 
sc start %DBservice% >NUL

GOTO StartingService
:StartingServiceDelay
echo Waiting for %DBservice% to start
timeout /t 2 /nobreak >NUL
:StartingService
SC query %DBservice% | FIND "STATE" | FIND "RUNNING" >NUL
IF errorlevel 1 GOTO StartingServiceDelay

:StartedService
echo %DBservice% is started
cd C:..path to code..\wolverine_web_map
call npm run prod || goto error

GOTO:end

:SystemOffline
echo Server is not accessible or is offline
GOTO:end

:error
echo App was not able to start

GOTO:end
:end
REMcmd /k  remove this line for window to close
