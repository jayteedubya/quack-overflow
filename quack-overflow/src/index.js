import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import PostContainer from './frontPage/postContainer';
import PostPage from './postPage/postPage';
import UserPublic from './profilePage/userPublic';
import Navbar from './navigation/navbar';
import Sidebar from './navigation/sidebar'

ReactDOM.render(<Navbar upOrOut="out" username="ducksicker"></Navbar>, document.getElementById('navbar'));
/*ReactDOM.render(<PostContainer></PostContainer>,
  document.getElementById('root')
);*/
/*ReactDOM.render(<PostPage></PostPage>, document.getElementById('root'))*/
ReactDOM.render(<UserPublic/>, document.getElementById('root'));
ReactDOM.render(<Sidebar></Sidebar>, document.getElementById('sidebar'));
