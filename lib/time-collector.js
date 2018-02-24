'use strict';

class TimeCollector {
  constructor(count, EXTRA_PERCENT = 5) {
    this.count = count > 1000 ? count : 1000;
    this.EXTRA_PERCENT = EXTRA_PERCENT;
    this.BUFFER_SIZE = 100;
    this.sync = this.getTimeSyncFunc;
    this.async = this.getTimeAsyncFunc;
  }

  getfunctionTime(func, type, callback) {
    const testParams = {
      buffer: [],
      stepsTime: [],
      functionTime: 0,
      stepTime: Math.round(this.count / 10),
      anomalyTime: 0,
      anomalyCount: 0,
      done: callback,
      add: (time, count) => {
        testParams.buffer.push(time);
        if (testParams.buffer.length === this.BUFFER_SIZE) {
          this.findAnomaly(testParams, count);
        }
      }
    };
    this[type](func, testParams);
  }

  findAnomaly(testParams, count) {
    const sumTime = testParams.buffer.reduce((sum, time) => sum + time);
    if (!this.EXTRA_PERCENT) {
      testParams.functionTime += sumTime;
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
    if (percent <= this.EXTRA_PERCENT && anomalyCount) {
      testParams.anomalyCount += anomalyCount;
      testParams.anomalyTime += anomalyTime;
      totalTime += anomalyCount * average;
    } else {
      totalTime += anomalyTime;
    }
    testParams.buffer = [];
    testParams.functionTime += totalTime;
    if (count > testParams.stepTime) {
      testParams.stepsTime.push(Math.round(testParams.functionTime / count));
      testParams.stepTime += this.count / 10;
    }
  }

  getTimeSyncFunc(func, testParams) {
    const results = [];
    for (let i = 0; i < this.count; i++) {
      const begin = process.hrtime();
      results[i] = func();
      const end = process.hrtime(begin);
      testParams.add(end[0] * 1e9 + end[1], i);
    }
    if (testParams.buffer.length) this.findAnomaly(testParams);
    this.makeResults(testParams);
    return results;
  }

  getTimeAsyncFunc(func, testParams) {
    let done = 0;
    const funcWithTestCb = (begin, i, ...args) => {
      func(...args, () => {
        const end = process.hrtime(begin);
        testParams.add(end[0] * 1e9 + end[1], i);
        if (++done === this.count) {
          if (testParams.buffer.length) this.findAnomaly(testParams);
          this.makeResults(testParams);
        }
      });
    };
    for (let i = 0; i < this.count; i++) {
      funcWithTestCb(process.hrtime(), i);
    }
  }

  makeResults(testParams) {
    const funcTime = Math.round(testParams.functionTime / this.count);
    testParams.stepsTime.push(funcTime);
    const getPercent = (numerator, denominator, accuracy = 0) => {
      const coef = Math.pow(10, accuracy);
      return (Math.round((numerator / denominator) * coef * 100) / coef);
    };
    const results = {
      time: funcTime,
      stepsTime: testParams.stepsTime,
      anPercent: getPercent(testParams.anomalyCount, this.count, 2),
      anTime: getPercent(testParams.anomalyTime, testParams.functionTime)
    };
    testParams.done(null, results);
  }
}

module.exports = TimeCollector;
