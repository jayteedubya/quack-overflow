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
        fetch('api/questions/new', {method: 'POST', body, mode: 'cors', credentials: 'include', headers: {'Content-Type': 'application/json'}})
            .then(res => res.json())
            .then(res => {
                this.redirect(res.id.id);
            })
            .catch(err => console.error(err)) //credentials: 'same-origin' maybe //HTTP BEFORE localhost //api route
    }
    characterCounterTitle() {
        this.setState({characterCountTitle: document.getElementById('title').value.length});
    } //consider changing to one function that updates all three at once.
    characterCounterTopic() {
        this.setState({characterCountTopic: document.getElementById('topic').value.length});
    }
    characterCounterBody() {
        this.setState({characterCountBody: document.getElementById('body').value.length});
    }
    render() {
        const element = <div className={style.newpost}>
            <label for="title"> title </label>
            <br/>
            <input onInput={() => this.characterCounterTitle()} type="text" name="title" id="title"></input>
            <p>{this.state.characterCountTitle} / 80 characters</p>
            <br/>
            <label for="topic"> topic </label>
            <br/>
            <input onInput={() => this.characterCounterTopic()} type="text" name="topic" id="topic"></input>
            <p>{this.state.characterCountTopic} / 60 characters</p>
            <br/>
            <div className={style.textcontainer}>
                <textarea onInput={() => this.characterCounterBody()} id="body"></textarea>
                <br/>
                <p>{this.state.characterCountBody} / 1000 characters</p>
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