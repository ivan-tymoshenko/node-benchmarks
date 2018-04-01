'use strict';

const TimeCollector = require('./time-collector.js');

process.on('message', req => {
  const { name, count, type, path, MAX_ANOMALY_PERCENT, START_COUNT } = req;
  const func = require(path)[name];

  const tc = new TimeCollector(count, MAX_ANOMALY_PERCENT, START_COUNT);
  tc.getFunctionTime(func, type, (err, res) => {
    res.name = func.name;
    process.send(res);
    process.exit();
  });
});
