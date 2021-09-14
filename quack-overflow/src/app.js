import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import QuestionRouter from './routing/questionRouter';
import './index.css';
import PostContainer from './frontPage/postContainer';
import PostPage from './postPage/postPage';
import UserPublic from './profilePage/userPublic';
import UserAnswers from './profilePage/userAnswers';
import UserQuestions from './profilePage/userQuestions';
import SignUp from './authentication/signUp';
import SignIn from './authentication/signIn'
import Navbar from './navigation/navbar';
import Sidebar from './navigation/sidebar';
import NewPost from './postPage/newPost';

export default function App() {
  return (
      <Switch>
        <Route exact path="/">
          <PostContainer view="home"/>
        </Route>
        <Route path="/top">
          <PostContainer view="top"/>
        </Route>
        <Route path="/most-answered">
          <PostContainer view="mostAnswered"/>
        </Route>
        <Route path="/sign-in">
          <SignIn/>
        </Route>
        <Route path="/user">
          <UserPublic/>
        </Route>
        <Route path="/sign-up">
          <SignUp/>
        </Route>
        <Route path="/me">
          <UserPublic/>
        </Route>
        <Route path="/popular">
          <PostContainer view="popular"/>
        </Route>
        <Route path="/submit">
          <NewPost/>
        </Route>
        <Route path="/questions">
          <QuestionRouter/>
        </Route>
      </Switch>
  )
}
