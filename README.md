# Benchmark library for NodeJs

[![TravisCI](https://travis-ci.org/bugagashenkj/node-benchmarks.svg?branch=master)](https://travis-ci.org/bugagashenkj/node-benchmarks)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/79d81f700ad441568d1dc6cca687ea77)](https://www.codacy.com/app/bugagashenkj/node-benchmarks)

`node-benchmarks` is a library for testing the execution time of functions and comparing functions by speed.

## Features

- Tests synchronous and asynchronous functions
- Detects anomalies of testing and filters them out
- Compares functions by execution time
- Can run optimizing iterations before testing
- Tests each function in a separate process
- Test each function sequentially
- Gets optimization status of test function

## Speed test

`speed(caption, fns, [, options])`

- `caption` - test caption
- `fns` - array of test functions
- `options` - test options(optional)
  - `count` - number of test iterations
  - `startCount` - number of first optimizing iterations
  - `anomalyPercent` - maximum possible percent of anomalies

Example:

```JavaScript
speed('Benchmark example',
  [f1, f2, f3, [f4, f5]], {
    count: 250000,
    anomalyPercent: 5,
    startCount: 0
});

```

- Synchronous test functions: `f1, f2, f3`
- Asynchronous test functions(callback-last / err-first function): `f4, f5`

## Contributors

- See github for full [contributors list](https://github.com/bugagashenkj/node-benchmarks/graphs/contributors)
