nuget restore
msbuild app.sln /t:Clean;Rebuild "/p:configuration=Release" /verbosity:minimal
pushd App\js
call npm run build
popd
