'use strict';

const metasync = require('metasync');
const rpad = (s, char, count) => (s + char.repeat(count - s.length));
const getResult = require('./get-result.js');

let dc;

const getTimeSync = (func, count) => {
  const name = rpad(func.name, '.', 25);
  const result = [];
  let i, time = 0;
  for (i = 0; i < count; i++) {
    const begin = process.hrtime();
    result.push(func());
    const end = process.hrtime(begin);
    time += end[0] * 1e9 + end[1];
  }
  dc.pick(name, { name, time });
};

const getTimeAsync = (func, count) => {
  const name = rpad(func.name, '.', 25);
  const result = [];
  let i, time = 0;
  const partFunc = (begin, ...args) => {
    func(...args, () => {
      const end = process.hrtime(begin);
      time += end[0] * 1e9 + end[1];
      result.push(end);
      if (result.length === count) dc.pick(name, { name, time });
    });
  };
  for (i = 0; i < count; i++) {
    partFunc(process.hrtime());
  }
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
  });

  if (testsSync) {
    testsSync.forEach((func) => {
      getTimeSync(func, count);
    });
  }

  if (testsAsync) {
    testsAsync.forEach((func) => {
      getTimeAsync(func, count);
    });
  }
};

module.exports = speed;
