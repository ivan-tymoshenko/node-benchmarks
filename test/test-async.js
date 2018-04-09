'use strict';

const mhpt = require('..');

const baseFunction = callback => {
  setTimeout(callback, 100);
};

const twiceAsLongFunction = callback => {
  setTimeout(callback, 200);
};

mhpt.speed('Speed test', [[
  baseFunction,
  twiceAsLongFunction
]], {
  count: 10000,
  anomalyPercent: 1,
  startCount: 0
});
