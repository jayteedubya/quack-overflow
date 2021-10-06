
import PostPage from'../postPage/postPage';
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

export default withRouter(QuestionRouter);