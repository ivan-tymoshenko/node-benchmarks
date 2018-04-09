# Performance testing library

[![TravisCI](https://travis-ci.org/bugagashenkj/mhpt.svg?branch=master)](https://travis-ci.org/bugagashenkj/mhpt)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/79d81f700ad441568d1dc6cca687ea77)](https://www.codacy.com/app/bugagashenkj/mhpt)

`MHPT` is a library for testing the execution time of functions and comparing functions by speed.

## Features

  - Tests synchronous and asynchronous functions
  - Detects anomalies of testing and filters them out
  - Compares functions by execution time
  - Can run optimizing iterations before testing
  - Tests each function in a separate process
  - Test each function sequentially
  - Gets optimization status of test function

## Speed test
`mhpt.speed(caption, fns, [, options])`
- `caption` <string> test caption
- `fns` <array> array of test functions
- `options` <Object> test options(optional)
    - `count` <number> number of test iterations
    - `startCount` <number> number of first optimizing iterations
    - `anomalyPercent` <number> maximum possible percent of anomalies

Example:

```JavaScript
mhpt.speed('Benchmark example',
  [f1, f2, f3, [f4, f5]], {
    count: 250000,
    anomalyPercent: 5,
    startCount: 0
});

```
- Synchronous test functions: `f1, f2, f3`
- Asynchronous test functions(callback-last / err-first function): `f4, f5`

## Contributors
  - See github for full [contributors list](https://github.com/bugagashenkj/mhpt/graphs/contributors)