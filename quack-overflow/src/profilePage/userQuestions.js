import React from 'react';
import Postbox from '../frontPage/postbox';

class UserQuestions extends React.Component {
    render() {
    const element = <div>
        {this.posts.map(post => <Postbox url={`/question/${post.id}`} author={post.username} timestamp={post.time} views={post.views} title={post.title}></Postbox>)}
    </div>
    return element;
    }
}

export default UserQuestions;