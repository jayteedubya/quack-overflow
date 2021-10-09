import React from 'react';
import TopicPage from '../frontPage/topicPage';
import {
    Switch,
    Route,
    useRouteMatch
  } from "react-router-dom";
  

  const TopicRouter = () => {
    let match = useRouteMatch();
    const element = <Switch>
        <Route path={`${match.path}/:topic`} render={props => <TopicPage key={window.location.pathname} topic={props.match.params.topic}/>}/>
    </Switch>
    return element
  }

  export default TopicRouter;