'use strict';

const title = 'Node.JS V8 Debugger';

const defaults = {
  host: 'localhost',
  port: 9229,
  interval: 1000,
  autoScale: true,
};

// Colors for badge icon overlay
const icon = {
  running: [0, 255, 0, 50],
  stopped: [255, 0, 0, 50],
};

// Track the intervalId so the monitor can be canceled
let intervalId = undefined;

// Track the URL that is being opened for a few seconds to account for lag in opening a new tab
const opening = {};

// Set extension options
function setOptions(options, callback) {
  chrome.storage.sync.set(Object.assign(defaults, options), callback);
}

// Get extension options
function getOptions(callback) {
  chrome.storage.sync.get(defaults, callback);
}

// Set the on click action for the badge icon
function setBrowserClickAction() {
  chrome.browserAction.setTitle({ title: `${title} stopped` });
  chrome.browserAction.setBadgeText({text:" "});
  chrome.browserAction.setBadgeBackgroundColor({color: icon.stopped});
  chrome.browserAction.onClicked.addListener(function(tab) { 
    const running = toggleMonitor();
    chrome.browserAction.setTitle({ title: `${title} ${running ? 'running' : 'stopped'}` });
    chrome.browserAction.setBadgeBackgroundColor({ color: running ? icon.running : icon.stopped });
  });
}

// Keep track of ports we want to check for a debugger in case new app threads are spawned
const monitorPorts = {};

// Toggle the monitor on and off
function toggleMonitor() {
  if (!intervalId) {
    console.log(`Starting ${title}`);
    getOptions(function toggleMonitorCallback(options) {
      intervalId = setInterval(function() {
        if (!Object.keys(monitorPorts).length) {
          const port = parseInt(options.port, 10);
          monitorPorts[port] = true;
        }
        Object.keys(monitorPorts).forEach(monitorPort => {
          const port = parseInt(monitorPort, 10);
          const jsonUrl = `http://${options.host}:${port}/json/list`;

          fetch(jsonUrl)
          .then(function getJSON(response) {
            if (response.status !== 200) {
              throw new Error(`Invalid configuration data at ${jsonUrl}`);
            } 
            return response.json();
          })
          .then(function openDeveloperToolsTab(data) {
            if (data && data[0]) {
              if (data[0].devtoolsFrontendUrl) {
                let devtoolsFrontendUrl = data[0].devtoolsFrontendUrl;
                if (options.host !== 'localhost') {
                  devtoolsFrontendUrl = devtoolsFrontendUrl.replace(/ws=localhost:\d+/g,
                    `ws=${options.host}:${port}`);
                }
                if (!opening[devtoolsFrontendUrl]) {
                  setTimeout(function clearOpeningURL() {
                    if (opening[devtoolsFrontendUrl]) {
                      console.log(`Removing devtoolsFrontendUrl: ${devtoolsFrontendUrl}`);
                      delete opening[devtoolsFrontendUrl];
                    }
                  }, 5000);
                  console.log(`Adding devtoolsFrontendUrl: ${devtoolsFrontendUrl}`);
                  opening[devtoolsFrontendUrl] = true;
                  chrome.tabs.create({ url: devtoolsFrontendUrl });
                } else {
                  console.log(`Already opening devtoolsFrontendUrl: ${devtoolsFrontendUrl}`);
                }
              } else if (options.autoScale && !monitorPorts[port + 1]) {
                console.log(`Start monitoring for new debugger threads on port ${port + 1}`);
                monitorPorts[port + 1] = true;
              }
            }
          })
          .catch(err => {
            console.log(`Cannot connect to v8 debugger: ${jsonUrl}`);
            delete monitorPorts[port];
          })
        });
      }, options.interval);
    });
    return true;
  }
  console.log(`Stopping ${title}`);
  intervalId = clearInterval(intervalId);
  return false;
}
