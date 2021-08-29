import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import PostContainer from './postContainer';
import Navbar from './navbar';
import Sidebar from './sidebar'

ReactDOM.render(<Navbar upOrOut="out" username="ducksicker"></Navbar>, document.getElementById('navbar'));
ReactDOM.render(<PostContainer></PostContainer>,
  document.getElementById('root')
);
ReactDOM.render(<Sidebar></Sidebar>, document.getElementById('sidebar'));
