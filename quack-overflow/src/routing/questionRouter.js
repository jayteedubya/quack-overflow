
/*import PostPage from'../postPage/postPage';
import React from "react";
import PropTypes from "prop-types";
import { withRouter, Route } from "react-router";
 
class QuestionRouter extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };
  render() {
    const { location } = this.props;
    return <Route><PostPage id={location.pathname.split('/').pop()} username={this.props.username} userLoggedIn={this.props.userLoggedIn}/></Route>
  }
}

export default withRouter(QuestionRouter);*/

import React from 'react';
import {
    Switch,
    Route,
    useRouteMatch
  } from "react-router-dom";
import PostPage from '../postPage/postPage';
  

const QuestionRouter = ({ userLoggedIn, username, updateAppState }) => {
  let match = useRouteMatch();
  const element = <Switch>
      <Route path={`${match.path}/:id`} render={props => <PostPage userLoggedIn={userLoggedIn} username={username} updateAppState={updateAppState} key={window.location.pathname} id={props.match.params.id}/>}/>
  </Switch>
  return element
}

  export default QuestionRouter;