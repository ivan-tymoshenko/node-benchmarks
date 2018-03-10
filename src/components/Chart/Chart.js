import React from 'react';

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.data = this.getData();
  }
  render() {
    return (<div id={this.props.version}></div>)
  }
  componentDidMount() { this.draw(); }

  draw() {
    const options = {
      selectionMode: 'multiple',
      chart: { title: 'Node: v' + this.props.version },
      width: 900,
      height: 500,
      axes: { x: { 0: {side: 'bottom'} }
    }
    };
    const element = document.getElementById(this.props.version);
    const chart = new this.props.link.charts.Line(element);
    chart.draw(this.data, this.props.link.charts.Line.convertOptions(options));
  }
  getData() {
    const data = new this.props.link.visualization.DataTable();
    data.addColumn('string', 'Count');
    this.props.funcData.forEach(func => {
      data.addColumn('number', func.join(' '));
    });

    data.addRows(this.props.time);
    return data;
  }
};

export default Chart;
