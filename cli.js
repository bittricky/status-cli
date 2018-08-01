#!/usr/bin/env node
const fetch = require('node-fetch');
const fs = require('fs');

const good = '\033[92m✔\033[0m';
const bad = '\033[91m✘\033[0m';

function showHelp() {
  let message = `
    Usage: \n
    $ down -f [file] check list of address in external file \n
    $ down -u [url]  check direct url address \n
    $ down -h        display commands \n`;

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

function handleUrl() {
  if(process.argv[3] !== undefined) {
    if (process.argv[3].startsWith('http') || process.argv[3].startsWith('https'))
      getStatus(process.argv[3]);
  } else {
    showHelp();
  }
}

function handleFile() {
  if (process.argv[3] !== undefined) {
    file(process.argv[3]);
  } else{
    showHelp();
  }
}

function init(arg) {
  switch(arg) {
    case undefined:
      showHelp();
      break;
    case '-h':
      showHelp();
      break;
    case '-u':
      handleUrl();
      break;
    case '-f':
      handleFile();
      break;
  }
}

init(process.argv[2]);
