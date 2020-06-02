import React, { Component } from 'react';
import '@progress/kendo-theme-default/dist/all.css';
import { render } from 'react-dom';
import Root from './components/Root';
import './style.css';

const App = () => {
  const content = (
    <div className="container">
      <br/>
      <hr/>
      <Root/>
    </div>
  )

  return content;
}

render(<App />, document.getElementById('root'));
