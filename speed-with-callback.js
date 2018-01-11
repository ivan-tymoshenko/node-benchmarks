'use strict';

const rpad = (s, char, count) => (s + char.repeat(count - s.length));
const lpad = (s, char, count) => (char.repeat(count - s.length) + s);

const speed = (
  caption,
  count,
  tests
) => {
  const times = [];

  const getResult = () => {
    const top = times.sort((t1, t2) => (t1.time - t2.time));
    const best = top[0].time;
    const relative = (time) => (time * 100 / best);
    top.forEach((test) => {
      test.percent = Math.round(
        Math.round(relative(test.time) * 100) / 100
      ) - 100;
      const time = lpad(test.time.toString(), '.', 15);
      const percent = lpad((
        test.percent === 0 ? 'min' : '+' + test.percent + '%'
      ), '.', 10);
      console.log(test.name + time + percent);
    });
  };

  const toPromise = callbackFn => (
    (...args) => (new Promise((resolve, reject) => {
      callbackFn(...args, (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    }))
  );

  tests.map(async (callbackFn) => {
    let i, time = 0;
    const result = [];
    const fn = toPromise(callbackFn);
    for (i = 0; i < count; i++) {
      const begin = process.hrtime();
      result.push(await fn());
      const end = process.hrtime(begin);
      time += end[0] * 1e9 + end[1];
    }
    const name = rpad(callbackFn.name, '.', 25);
    times.push({ name, time });
    if (tests.length === times.length) getResult();
  });
};

module.exports = speed;
