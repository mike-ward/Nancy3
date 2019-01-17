nuget restore
pushd App\js
call npm i
popd
msbuild App.sln /t:Clean;Rebuild /p:configuration=Release /p:DeployOnBuild=true /verbosity:minimal
copy /Y App\wwwroot\content\*.*s App\bin\Release\netcoreapp2.1\Publish\wwwroot
