const chalk = require('chalk');

const good = "\033[92m✔\033[0m";
const bad = "\033[91m✘\033[0m";

function showHelp() {
  let helpMessage = '';
  process.stdout.write(helpMessage);
  process.exit();
}

function printStatus(up, site) {
  let status = (up) ? 'up' : 'down';
  process.stdout.write(`${site} is ${status}`);
}

function _url(site) {
  fetch(site, { method: 'GET' })
    .then(res => {
      if (res.statusCode != 200) {
        printStatus(false, site);
      } else {
        printStatus(true, site);
      }
    })
    .catch(err => printStatus(false, site));
}

if (process.argv == 1 || process.argv[1] === '-h') {
  showHelp();
}

if (process.argv[1].startsWith('http')) {
  _url(process.argv[1]);
  process.exit();
}
