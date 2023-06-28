var path = require('path');
var watch = require('watch');
var fs = require('fs');
var TEMP_PATH = path.resolve(__dirname, '.tmp');
var state = 0; // 0 = precompile; 1 = compiled; 2 = cleanup

if (!fs.existsSync(TEMP_PATH)) fs.mkdirSync(TEMP_PATH);
watch.createMonitor(path.resolve(__dirname, '.tmp'), function (monitor) {
  monitor.on('created', function () {
    state = 1;
  });
  monitor.on('removed', function () {
    console.log('deleted');
    state = 2;
  });
});
