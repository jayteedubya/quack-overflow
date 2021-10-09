import React from 'react';
import style from './newPost.module.css';
import { Redirect } from 'react-router-dom';
import validator from 'validator';

class NewPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {postId: null, characterCountBody: 0, characterCountTitle: 0, characterCountTopic: 0};
    }
    redirect = (postId) => {
        this.setState({postId})
    }
    getAndValidateQuestion() {
        const title = document.getElementById('title').value;
        if (title.length > 80) {
            window.alert('title must be 80 characters or less');
            return null
        }
        const topic = document.getElementById('topic').value;
        if (topic.length > 60) {
            window.alert('topic must be 60 characters or less');
            return null;
        }
        const questionBody = document.getElementById('body').value;
        if (questionBody.length > 1000) {
            window.alert('topic must be 1000 characters or less');
            return null;
        }
        return { title, topic, questionBody };
    }
    submit = () => {
        const questionBody = this.getAndValidateQuestion();
        if (!questionBody) {
            return
        }
        const body = JSON.stringify(questionBody);
        fetch('http://localhost:4001/api/questions/new', {method: 'POST', body, mode: 'cors', credentials: 'include', headers: {'Content-Type': 'application/json'}})
            .then(res => res.json())
            .then(res => {
                this.redirect(res.id.id);
            })
            .catch(err => console.error(err)) //credentials: 'same-origin' maybe //HTTP BEFORE localhost //api route
    }
    render() {
        const element = <div className={style.newpost}>
            <label for="title"> title </label>
            <br/>
            <input type="text" name="title" id="title"></input>
            <br/>
            <label for="topic"> topic </label>
            <br/>
            <input type="text" name="topic" id="topic"></input>
            <br/>
            <div className={style.textcontainer}>
                <textarea id="body"></textarea>
                <br/>
                <button onClick={this.submit}> submit </button>
            </div>
        </div>
        if (this.state.postId) {
            return <Redirect to={`/questions/${this.state.postId}`}/>
        }
        if (!this.props.username) {
            return <Redirect to='/sign-in'/>
        }
        return element;
    }
}

export default NewPost;