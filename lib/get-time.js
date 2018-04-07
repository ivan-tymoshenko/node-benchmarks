'use strict';

const TimeCollector = require('./time-collector.js');

process.on('message', req => {
  const { funcName, funcType, testFile, count, anomaly, startCount } = req;
  const testFunction = require(testFile)[funcName];

  const tc = new TimeCollector(count, anomaly, startCount);
  tc.getFunctionTime(testFunction, funcType, (err, result) => {
    result.funcName = funcName;
    process.send(result);
    process.exit();
  });
});
