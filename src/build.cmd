pushd App\js
call npm i
popd
msbuild App.sln /t:Restore;Rebuild /p:Configuration=Release /p:DeployOnBuild=true /verbosity:minimal
