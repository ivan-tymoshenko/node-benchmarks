'use strict';

const createResult = (
  // Function which logs results to console
  results, // Map, results of all functions of all node versions
  caption, // String
  count // Number
) => {
  const rpad = (s, count) => (s + '.'.repeat(count - s.length));
  const lpad = (s, count) => ('.'.repeat(count - s.length) + s);

  console.log('\n' + rpad(caption, 35) + lpad('Count: ' + count, 15));

  results.forEach((result, version) => {
    const sortedResults = result.sort((t1, t2) => (t1.time - t2.time));
    const relative = time => time * 100 / sortedResults[0].time;
    console.log('\nNode version: ' + version);
    console.log(
      rpad('Function.name', 25) +
      lpad('Percent', 10) +
      lpad('Time', 15) +
      lpad('Anomaly', 10) +
      lpad('An.Time', 10)
    );
    sortedResults.forEach(func => {
      const percent = Math.round(relative(func.time)) - 100;
      console.log(
        rpad(func.name, 25) +
        lpad(percent ? percent + '%' : 'min', 10) +
        lpad(Math.round(func.time).toString(), 15) +
        lpad(func.anPercent + '%', 10) +
        lpad(func.anTime + '%', 10)
      );
    });
  });
};

module.exports = createResult;
