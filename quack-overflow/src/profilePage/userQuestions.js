
import React from 'react';
import Postbox from '../frontPage/postbox';
import ProfileNavbar from './profileNavbar';
import { Redirect } from 'react-router-dom';

class UserQuestions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            error: null,
            isLoaded: false,
            ok: true
        }
    }
    componentDidMount() {
        fetch(`http://localhost:4001/api/users/${this.props.username}/questions`, {method: 'GET', headers: {'content-type': 'application/json'}})
            .then(response => {
                this.setState({ok: response.ok});
                return response;
            })
            .then(response => response.json())
            .then(response => this.setState({questions: response, isLoaded: true}), error => this.setState({error, isLoaded: true}));
    }
    render() {
    let element = <div>
        <ProfileNavbar username={this.props.username}/>
            <div>
                {this.state.questions.map(post => <Postbox url={`/questions/${post.id}`} author={post.username} timestamp={post.time} views={post.views} title={post.title}></Postbox>)}
            </div>
        </div>
    if (!this.state.ok) {
        element = <div><Redirect to="/404"/></div>
    }
    return element;
    }
}

export default UserQuestions;