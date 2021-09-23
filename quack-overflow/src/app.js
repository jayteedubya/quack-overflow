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
import UserRouter from './routing/userRouter';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {username: null, userLoggedIn: false}
    this.updateText1 = this.updateText1
  }
  updateUsername = state => {
    this.setState(state);
  }
  render() {
    return (
    <div>
      <Navbar username={this.state.username}/>
      <Sidebar/>
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
          <SignIn updateUsername={this.updateUsername}/>
        </Route>
        <Route path="/user">
          <UserPublic/>
        </Route>
        <Route path="/sign-up">
          <SignUp/>
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
        <Route path="/users">
          <UserRouter/>
        </Route> 
      </Switch>
    </div>
  )
  }
}
