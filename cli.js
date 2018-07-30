#!/usr/bin/env node
const fetch = require('node-fetch');
const fs = require('fs');

const good = '\033[92m✔\033[0m';
const bad = '\033[91m✘\033[0m';

function showHelp() {
  let message = `
    Usage:
	  $ down [file] [url]
  `;
  process.stdout.write(message);
  process.exit();
}

function printStatus(up, site) {
  let status = (up) ? `up ${good}` : `down ${bad}`;
  process.stdout.write(`${site} is ${status} \n`);
}

function getStatus(site) {
  fetch(`${site}`, { method: 'GET' })
    .then(res => (res.status !== 200 ? printStatus(false, site) : printStatus(true, site)))
    .catch(err => printStatus(false, site));
}

function file(file) {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err !== null && err.code === 'ENOENT') {
      process.stdout.write(`No such file: ${file} \n`);
    } else {
      let split = data.split('\n').filter(x => x !== '');
      split.forEach(x => getStatus(x));
    }
  });
}

if (process.argv[2] === undefined || process.argv[2] === '-h') {
  showHelp();
}

if (process.argv[2].startsWith('http') || process.argv[2].startsWith('https')) {
  getStatus(process.argv[2]);
}

file(process.argv[2]);
