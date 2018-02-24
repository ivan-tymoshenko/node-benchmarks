'use strict';

const fs = require('fs');
const path = require('path');

const writeToJson = (
  // Function which write results to csv file
  result, // Map, results of all functions of all node versions
  count
) => {
  const filename = path.join(__dirname, '..', 'results/data.json');
  const res = [];
  const steps = [];
  for (let i = count / 10; i < count; i += count / 10) steps.push(i);
  steps.push(count);
  result.forEach((times, version) => {
    times.forEach(func => {
      res.push({
        label: func.name,
        percent: func.percent,
        anPercent: func.anPercent,
        y: func.stepsTime,
        x: steps,
        version
      });
    });
  });
  fs.writeFileSync(filename, JSON.stringify(res));
};

const makeResult = (
  // Function which generate result of test
  results, // Map, results of all functions of all node versions
  caption, // String
  count // Number
  // Returns: Map, sorted results of all functions of all node versions
) => {
  results.forEach((result, version) => {
    const sortedResults = result.sort((t1, t2) => (t1.time - t2.time));
    const relative = time => time * 100 / sortedResults[0].time;
    sortedResults.forEach((test) => {
      const percent = Math.round(relative(test.time)) - 100;
      test.percent = percent === 0 ? 'min' : '+' + percent + '%';
    });
    results.set(version, sortedResults);
  });
  writeToJson(results, count, caption);
  return results;
};

module.exports = makeResult;
