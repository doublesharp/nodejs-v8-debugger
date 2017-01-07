'use strict';

// Set the form values on load
document.addEventListener('DOMContentLoaded', function onLoad() {
  getOptions(function loadCb (options) {
    host.value = options.host;
    host.placeholder = options.host;
    port.value = options.port;
    port.placeholder = options.port;
    interval.value = options.interval;
    interval.placeholder = options.interval;
    autoScale.checked = options.autoScale;

    // Save the form values on click
    save.addEventListener('click', function onClick() {
      setOptions({
        host: host.value,
        port: port.value,
        autoScale: autoScale.checked,
        interval: interval.value,
      });
    }, false);
  });
}, false);
