'use strict';

const speed = require('../lib/speed');

const baseFunction = () => {
  let a;
  for (let i = 0; i < 100000; i++) {
    a = i + a;
  }
  return a;
};

const twiceLongFunction = () => {
  let a;
  for (let i = 0; i < 200000; i++) {
    a = i + a;
  }
  return a;
};

speed('Speed test', 10000, [
  baseFunction,
  twiceLongFunction
]);
