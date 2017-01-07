![nodejs-v8-debugger](https://github.com/doublesharp/nodejs-v8-debugger/raw/master/images/logo128.png)

# nodejs-v8-debugger

Extension for automatically launching Developer Tools to debug Node.js applications.

## Usage

1. Install the `nodejs-v8-debugger` extension into Chome by unzipping and selecting "Load unpacked extension..." after enabling "Developer mode".
2. Click the ![nodejs-v8-debugger](https://github.com/doublesharp/nodejs-v8-debugger/raw/master/images/logo16.png) icon in your toolbar to start monitoring for debug ports.
3. Run a Node.js application with the `--inspect` command line flag. If you don't already have breakpoints set it's recommended to pass in the `--debug-brk` flag as well to pause on the first line and allow the files to be loaded in order to set breakpoints.
4. Chrome should automatically load a new tab with developer tools for debugging your application. Note that while your application is being debugged Chrome re-open this tab if you close it.
5. Debug your application.
6. Stop your application.
7. Close the Chrome developer tools tab.

## Options

Right click on the browser icon and select options to configure settings for this extension.

### Debug Host

This value is the hostname that the extension will monitor for open debug ports.

### Debug Port

This value is the initial port that the extension will monitor for debugging.

### Interval

This is the frequency that the extension checks for open debug ports. Due to the lag in opening a new tab the default of 1000ms should suffice.

### Auto Scale

When debugging applications that use the `cluster` module, the debug ports will be auto-incremented from the starting port. When a debugging session is initiated on the default port, the next port is also checked and if it is opened a new tab will be created to debug the new thread created by `cluster.fork()`. 
