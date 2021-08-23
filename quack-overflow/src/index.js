import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Postbox from './postbox';
import Navbar from './navbar';

ReactDOM.render(<Navbar inUpOrOut="up" username="ducksicker"></Navbar>, document.getElementById('navbar'));
ReactDOM.render(
  <Postbox url="/none" title="This is a mock up" author="me" timestamp="today" views="25"></Postbox>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
