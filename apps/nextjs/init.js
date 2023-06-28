var fs = require('fs');
var path = require('path');
var TEMP_PATH = path.resolve(__dirname, '.tmp');
var shouldCleanup = process.argv[2] === '--cleanup';

process.stdin.resume();

if (!fs.existsSync(TEMP_PATH)) fs.mkdirSync(TEMP_PATH);
function cleanup() {
  if (fs.existsSync(TEMP_PATH))
    fs.rmSync(TEMP_PATH, { recursive: true, force: true });
}
if (shouldCleanup)
  [
    'exit',
    'SIGINT',
    'SIGUSR1',
    'SIGUSR2',
    'uncaughtException',
    'SIGTERM',
  ].forEach((eventType) => {
    process.on(eventType, cleanup);
  });
else process.exit(0);
