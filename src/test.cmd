@echo off
pushd Test\bin\Release\netcoreapp2.1
vstest.console Test.dll
popd
if ERRORLEVEL 1 goto END

pushd App\js
npm test
popd

:END
