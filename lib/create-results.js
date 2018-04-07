'use strict';

const createResult = (
  // Function which logs results to console
  results, // Map, results of all functions of all node versions
  caption, // String
  count // Number
) => {
  const rpad = (s, count) => (s + '.'.repeat(count - s.length));
  const lpad = (s, count) => ('.'.repeat(count - s.length) + s);

  console.log('\n' + rpad(caption, 35) + lpad('Count: ' + count, 25));

  const sortedResults = results.sort((t1, t2) => (t1.time - t2.time));
  const relative = time => time * 100 / sortedResults[0].time;
  console.log(
    rpad('Function.name', 25) +
    lpad('Percent', 10) +
    lpad('Time', 15) +
    lpad('Anomaly', 10) +
    lpad('An.Time', 10)
  );
  sortedResults.forEach(funcResult => {
    const percent = Math.round(relative(funcResult.time)) - 100;
    console.log(
      rpad(funcResult.funcName, 25) +
      lpad(percent ? percent + '%' : 'min', 10) +
      lpad(Math.round(funcResult.time).toString(), 15) +
      lpad(funcResult.anPercent + '%', 10) +
      lpad(funcResult.anTime + '%', 10)
    );
  });
};

module.exports = createResult;
