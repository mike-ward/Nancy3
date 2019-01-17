nuget restore
pushd App\js
call npm i
popd
msbuild App.sln /t:Clean;Rebuild /p:configuration=Release /p:DeployOnBuild=true /verbosity:minimal
