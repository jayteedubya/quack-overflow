import React from 'react';
import Postbox from '../frontPage/postbox';
import ProfileNavbar from './profileNavbar';

class UserQuestions extends React.Component {
    constructor(props) {
        super(props);
        this.posts = [
            {
                id: 1,
                title: 'test',
                time: 'now',
                topic: 'stuff',
                views: 10,
                username: "me"
            },
            {
                id: 2,
                title: 'another',
                time: 'now',
                topic: 'more stuff',
                views: 10,
                username: "me"
            }
        ]
    }
    render() {
    const element = <div>
        <ProfileNavbar/>
            <div>
                {this.posts.map(post => <Postbox url={`/question/${post.id}`} author={post.username} timestamp={post.time} views={post.views} title={post.title}></Postbox>)}
            </div>
        </div>
    return element;
    }
}

export default UserQuestions;