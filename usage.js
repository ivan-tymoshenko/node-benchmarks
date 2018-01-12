'use strict';

const speed = require('./speed-with-callback');

const readConfig = callback => {
  setTimeout(callback, 10);
};

const readFile = callback => {
  setTimeout(callback, 20);
};

speed('Speed test', 100, [
  readFile,
  readConfig
]);
