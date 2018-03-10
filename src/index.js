import React from 'react';
import ReactDOM from 'react-dom';
import Chart from './components/Chart/Chart';
import Header from './components/Header/Header';
import data from './data';

const loadScript = src => {
  return new Promise(function(resolve, reject){
    const script = document.createElement('script');
    script.src = src;
    script.addEventListener('load', () => { resolve(); });
    script.addEventListener('error', e => { reject(e); });
    document.body.appendChild(script);
  })
};

const formatNumber = times => {
  times.forEach(time => time[0] = time[0].toLocaleString('en'));
  return times;
}

loadScript('https://www.gstatic.com/charts/loader.js').then(() => {
  window.google.charts.load('current', {'packages':['line']});
  window.google.charts.setOnLoadCallback(() => {
  const charts = [];
  const { caption, count, resultTime } = data;
  charts.push(React.createElement(Header, {caption, count, key: caption}));
    resultTime.forEach(versionResult => {
      charts.push(React.createElement(Chart, {
        key: versionResult.version,
        funcData: versionResult.funcData,
        version: versionResult.version,
        link: window.google,
        time: formatNumber(versionResult.versionTime)
      }));
    });
    const container = React.createElement('div', {}, charts);
    ReactDOM.render(container, document.getElementById('root'));
  });
});
