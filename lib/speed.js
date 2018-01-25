'use strict';

const metasync = require('metasync');
const { fork } = require('child_process');
const getResult = require('./get-result.js');

const PATH_TO_CHILD = '../lib/get-time.js';
let dc;

const makeRequest = (func, count, type) => {
  if (type !== 'sync' && type !== 'async') throw new Error('Invalid type');
  if (typeof(func) !== 'function') throw new Error(func + 'is not a function');
  return {
    typeOfReq: type,
    iterations: count,
    funcName: func.name,
    funcBoby: func.toString()
  };
};

const speed = (
  caption,
  count,
  testsSync,
  testsAsync = null
) => {
  const lengthSync = testsSync ? testsSync.length : 0;
  const lengthAsync = testsAsync ? testsAsync.length : 0;

  dc = metasync.collect(lengthSync + lengthAsync);
  dc.done(() => {
    getResult(Object.values(dc.data));
    process.exit(-1);
  });

  if (testsSync) {
    testsSync.forEach((func) => {
      const forked = fork(PATH_TO_CHILD);
      const obj = makeRequest(func, count, 'sync');
      forked.send(obj);
      forked.on('message', (msg) => dc.pick(func.name, msg));
    });
  }

  if (testsAsync) {
    testsAsync.forEach((func) => {
      const forked = fork(PATH_TO_CHILD);
      const obj = makeRequest(func, count, 'async');
      forked.send(obj);
      forked.on('message', (msg) => dc.pick(func.name, msg));
    });
  }
};

module.exports = speed;
