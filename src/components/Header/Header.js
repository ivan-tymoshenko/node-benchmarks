import React from 'react';

const Header = props => {
  return (
    <div id='header'>
      <h1>{'Caption: ' + props.caption}</h1>
      <h1>{'Count: ' + props.count}</h1>
    </div>
  )
}

export default Header;
