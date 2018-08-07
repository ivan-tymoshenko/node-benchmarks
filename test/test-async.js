'use strict';

const { speed } = require('../bugaga-tests');

const baseFunction = callback => {
  setTimeout(callback, 10);
};

const twiceAsLongFunction = callback => {
  setTimeout(callback, 20);
};

speed('Speed test', [[
  baseFunction,
  twiceAsLongFunction
]], {
  count: 1000,
  anomalyPercent: 1,
  startCount: 0
});
