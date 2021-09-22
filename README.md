Installation Instructions

Download and extract https://github.com/dmwallace/jarviz-receiver/archive/refs/heads/master.zip

Right click jarviz-setup.bat and run as administrator.  If you get a windows warning about running the bat file click
"more info" and "run anyway" or whatever is required to permit the file to run.

This will install jarviz-receiver along with all its dependencies and create a task to run on startup as well as an
auto-update task (entire process can take several minutes)

You can verify that jarviz-receiver is running correctly by going to http://localhost:5000/ping in a browser on the
same machine (or http://[ip address of machine running jarviz-receiver]:5000/ping from another machine on the same
network).

If you see the hostname returned then jarviz-receiver is running correctly