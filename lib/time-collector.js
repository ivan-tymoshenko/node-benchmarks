'use strict';

class TimeCollector {
  constructor(count = 20000, MAX_ANOMALY_PERCENT = 5, START_COUNT) {
    this.count = count;
    this.START_COUNT = START_COUNT;
    const userBuffer = (count * MAX_ANOMALY_PERCENT) / 100;
    this.BUFFER_SIZE = userBuffer > 10000 ? 10000 : userBuffer;
    this.MAX_ANOMALY_PERCENT = MAX_ANOMALY_PERCENT;
    this.sync = this.getTimeSyncFunc;
    this.async = this.getTimeAsyncFunc;
  }

  getFunctionTime(func, type, callback) {
    const testParams = {
      buffer: [],
      bufferResult: null,
      avarageTime: 0,
      anomalyTime: 0,
      anomalyCount: 0,
      done: callback,
      add: (time, result = null) => {
        testParams.bufferResult = result;
        testParams.buffer.push(time);
        if (testParams.buffer.length === this.BUFFER_SIZE) {
          global.gc();
          this.findAnomaly(testParams);
        }
      }
    };
    this[type](func, testParams);
  }

  findAnomaly(testParams) {
    const sumTime = testParams.buffer.reduce((sum, time) => sum + time);
    if (!this.MAX_ANOMALY_PERCENT) {
      testParams.avarageTime += sumTime;
      return;
    }
    const bufferSize = testParams.buffer.length;
    const average = sumTime / bufferSize;
    const sumOfSquares = testParams.buffer.reduce((sum, time) => {
      const res = Math.pow((time - average), 2) / bufferSize;
      return res + sum;
    }, 0);
    const coef = (Math.sqrt(sumOfSquares) * 3) / Math.sqrt(bufferSize);
    let totalTime = 0;
    let anomalyTime = 0;
    let anomalyCount = 0;
    testParams.buffer.forEach(time => {
      if (Math.abs(time - average) > coef) {
        anomalyCount++;
        anomalyTime += time;
      } else {
        totalTime += time;
      }
    });
    const percent = (anomalyCount / bufferSize) * 100;
    if (percent <= this.MAX_ANOMALY_PERCENT && anomalyCount) {
      testParams.anomalyCount += anomalyCount;
      testParams.anomalyTime += anomalyTime;
      totalTime += anomalyCount * average;
    } else {
      totalTime += anomalyTime;
    }
    testParams.buffer = [];
    testParams.avarageTime += totalTime;
  }

  getTimeSyncFunc(func, testParams) {
    const testFunc = (begin, i) => {
      const result = func();
      const end = process.hrtime(begin);
      testParams.add(end[0] * 1e9 + end[1], result + i);
    };
    for (let i = 0; i < this.START_COUNT; i++) func();
    for (let i = 0; i < this.count; i++) testFunc(process.hrtime(), i);
    if (testParams.buffer.length) this.findAnomaly(testParams);
    this.makeResults(testParams);
  }

  getTimeAsyncFunc(func, testParams) {
    const funcWithTestCb = (begin, i, ...args) => {
      func(...args, () => {
        const end = process.hrtime(begin);
        testParams.add(end[0] * 1e9 + end[1]);
        if (++i < this.count) funcWithTestCb(process.hrtime(), i);
        else {
          if (testParams.buffer.length) this.findAnomaly(testParams);
          this.makeResults(testParams);
        }
      });
    };

    const optimisationRunFunc = (i, ...args) => {
      func(...args, () => {
        if (++i < this.START_COUNT) optimisationRunFunc(i);
        else funcWithTestCb(process.hrtime(), 0);
      });
    };
    optimisationRunFunc(0);
  }

  makeResults(testParams) {
    const getPercent = (numerator, denominator, accuracy = 0) => {
      const coef = Math.pow(10, accuracy);
      return (Math.round((numerator / denominator) * coef * 100) / coef);
    };
    const results = {
      time: Math.round(testParams.avarageTime / this.count),
      anPercent: getPercent(testParams.anomalyCount, this.count, 2),
      anTime: getPercent(testParams.anomalyTime, testParams.avarageTime)
    };
    testParams.done(null, results);
  }
}

module.exports = TimeCollector;
