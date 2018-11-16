nuget restore
pushd App\js
call npm i
popd
msbuild app.sln /t:Clean;Rebuild "/p:configuration=Release" /verbosity:minimal
