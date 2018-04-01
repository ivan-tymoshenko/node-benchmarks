'use strict';

const mhpt = require('..');

const baseFunction = callback => {
  setTimeout(callback, 10);
};

const twiceAsLongFunction = callback => {
  setTimeout(callback, 20);
};

mhpt.speed('Speed test', [[
  baseFunction,
  twiceAsLongFunction
]], {
  count: 1000,
  MAX_ANOMALY_PERCENT: 1,
  NODE_VERSIONS: ['9']
});
