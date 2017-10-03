if not defined in_subprocess (cmd /k set in_subprocess=y ^& %0 %*) & exit )
cd \jarviz-receiver && npm run setup
pause