import React from 'react';
import UserPublic from '../profilePage/userPublic';
import UserQuestions from '../profilePage/userQuestions';
import UserAnswers from '../profilePage/userAnswers';
import {
    Switch,
    Route,
    useRouteMatch
  } from "react-router-dom";
  

  const UserRouter = () => {
    let match = useRouteMatch();
    const element = <Switch>
        <Route path={`${match.path}/:username`} exact render={props => <UserPublic username={props.match.params.username}/>}/>
        <Route path={`${match.path}/:username/questions/`} render={props => <UserQuestions username={props.match.params.username}/>}/>
        <Route path={`${match.path}/:username/answers/`} render={props => <UserAnswers username={props.match.params.username}/>}/>
    </Switch>
    return element
  }

  export default UserRouter;