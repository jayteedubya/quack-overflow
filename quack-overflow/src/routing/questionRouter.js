import React from 'react';
import PostPage from'../postPage/postPage';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch
  } from "react-router-dom";
  

  const QuestionRouter = () => {
    let match = useRouteMatch();
    const element = <Switch>
        <Route path={`${match.path}/:questionId`} render={(props) => <PostPage id={props.match.params.questionId}/>}/>
    </Switch>
    return element
  }

  export default QuestionRouter;