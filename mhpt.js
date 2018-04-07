'use strict';

const path = require('path');
const { fork } = require('child_process');
const makeResults = require('./lib/create-results.js');

const PATH_TO_GET_TIME = path.join(__dirname, '/lib/get-time.js');

const defaultOptions = {
  anomaly: 5,
  count: 25000,
  startCount: 1000
};

const prepareRequests = (
  // Function which prepares requests to child processes
  syncFunctions, // Array of synchronous functions
  asyncFunctions // Array of asynchronous functions, callback-last
  // Returns: Array, array of requests
) => {
  const requests = [];
  syncFunctions.forEach(func => requests.push([func.name, 'sync']));
  asyncFunctions.forEach(func => requests.push([func.name, 'async']));
  return requests;
};

const exportsFunctions = (
  // Function that adds test function to module.exports
  syncFunctions, // Array of synchronous functions
  asyncFunctions // Array of asynchronous functions, callback-last
) => {
  const childProcessExports = module.parent.exports;
  syncFunctions.forEach(func => { childProcessExports[func.name] = func; });
  asyncFunctions.forEach(func => { childProcessExports[func.name] = func; });
};

const speed = (
  // Function which manages the process of testing functions
  caption, // String, caption of test
  testFunctions, // Array, sync functions and array of async functions
  config = {} // Object, config (count, maxAnomalyPercent, startCount)
) => {
  const syncFunctions = []; // Array of synchronous functions
  const asyncFunctions = []; // Array of asynchronous functions, callback-last
  testFunctions.forEach(value => {
    if (typeof(value) === 'function') syncFunctions.push(value);
    else value.forEach(func => asyncFunctions.push(func));
  });

  if (process.argv[1] === PATH_TO_GET_TIME) { // start only from child process
    exportsFunctions(syncFunctions, asyncFunctions);
    return;
  }

  for (const option in defaultOptions) {
    config[option] = config[option] || defaultOptions[option];
  }

  const results = []; // results of all functions
  config.testFile = module.parent.filename;
  const requests = prepareRequests(syncFunctions, asyncFunctions);

  const sendRequest = (
    funcName, // String, name of test function
    funcType // String, 'sync' or 'async'
  ) => {
    const forked = fork(PATH_TO_GET_TIME, { execArgv: ['--expose-gc'] });
    forked.send(Object.assign(config, { funcName, funcType }));
    forked.on('message', result => {
      results.push(result);
      if (requests.length) sendRequest(...requests.pop());
      else makeResults(results, caption, config.count);
    });
  };
  sendRequest(...requests.pop());
};
module.exports = { speed };
