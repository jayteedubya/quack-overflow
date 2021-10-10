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
import TopicPage from './frontPage/topicPage';
import TopicRouter from './routing/topicsRouter';
import SignOut from './authentication/signOut';
import FourZeroFour from './navigation/404';
import TopPosts from './frontPage/topPosts';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {username: null}
  }
  updateAppState = state => {
    this.setState(state);
  }
  componentDidMount() {
    fetch('/api/auth/who-am-i', {method: 'GET', credentials: 'include', mode: 'cors'})
        .then(res => res.json())
        .then(res => {
          this.setState({username: res.username})
        })
        .catch(err => console.error(err));
  }
  render() {
    return (
    <div>
      <Navbar username={this.state.username}/>
      <Sidebar/>
      <Switch>
        <Route exact path="/">
          <PostContainer/>
        </Route>
        <Route path="/top">
          <TopPosts/>
        </Route>
        <Route path="/most-answered">
          <PostContainer view="mostAnswered"/>
        </Route>
        <Route path="/sign-in">
          <SignIn updateAppState={this.updateAppState}/>
        </Route>
        <Route path="/user">
          <UserPublic/>
        </Route>
        <Route path="/sign-up">
          <SignUp updateAppState={this.updateAppState}/>
        </Route>
        <Route path="/popular">
          <PostContainer view="popular"/>
        </Route>
        <Route path="/submit">
          <NewPost username={this.state.username}/>
        </Route>
        <Route path="/questions">
          <QuestionRouter username={this.state.username} updateAppState={this.updateAppState}/>
        </Route>
        <Route path="/users">
          <UserRouter userViewing={this.state.username}/>
        </Route> 
        <Route path="/topics">
          <TopicRouter/>
        </Route>
        <Route path="/sign-out">
          <SignOut updateAppState={this.updateAppState}/>
        </Route>
        <Route path="/404">
          <FourZeroFour/>
        </Route>
      </Switch>
    </div>
  )
  }
}
