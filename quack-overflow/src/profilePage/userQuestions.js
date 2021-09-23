
import React from 'react';
import Postbox from '../frontPage/postbox';
import ProfileNavbar from './profileNavbar';

class UserQuestions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: [],
            error: null,
            isLoaded: false
        }
    }
    componentDidMount() {
        fetch(`http://localhost:4001/api/users/${this.props.username}/questions`, {method: 'GET', headers: {'content-type': 'application/json'}})
            .then(response => response.json())
            .then(response => this.setState({questions: response, isLoaded: true}), error => this.setState({error, isLoaded: true}));
    }
    render() {
    const element = <div>
        <ProfileNavbar username={this.props.username}/>
            <div>
                {this.state.questions.map(post => <Postbox url={`/questions/${post.id}`} author={post.username} timestamp={post.time} views={post.views} title={post.title}></Postbox>)}
            </div>
        </div>
    return element;
    }
}

export default UserQuestions;