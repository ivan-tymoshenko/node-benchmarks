'use strict';

const fs = require('fs');
const path = require('path');

const createResult = (
  // Function which write results to csv file
  results, // Map, results of all functions of all node versions
  caption, // String, caption of test
  count, // Number, number of iterations
  NUMBER_OF_STEPS // Number, number of divisions of the graph
) => {
  const resultTime = [];
  const pathToFile = path.join(__dirname, '..', 'src/data.json');
  results.forEach((versionResult, version) => {
    const funcData = [];
    const versionTime = [];
    const sortedResult = versionResult.sort((t1, t2) => (t1.time - t2.time));
    for (let i = 0, step = 0; i < NUMBER_OF_STEPS; i++) {
      step += count / NUMBER_OF_STEPS;
      versionTime[i] = [Math.round(step)];
    }
    const relative = time => time * 100 / sortedResult[0].time;
    sortedResult.forEach(func => {
      const percent = Math.round(relative(func.time)) - 100;
      func.percent = percent === 0 ? 'min' : '+' + percent + '%';
      func.anPercent += '%';
      funcData.push([func.percent, func.name, func.anPercent]);
      for (let i = 0; i < NUMBER_OF_STEPS; i++) {
        versionTime[i].push(func.stepsTime[i]);
      }
    });
    resultTime.push({ versionTime, version, funcData });
  });
  fs.writeFileSync(pathToFile, JSON.stringify({ caption, count, resultTime }));
};

module.exports = createResult;
