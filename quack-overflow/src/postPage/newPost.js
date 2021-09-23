import React from 'react';
import style from './newPost.module.css'

class NewPost extends React.Component {
    submit() {
        const title = document.getElementById('title').value;
        const topic = document.getElementById('topic').value;
        const questionBody = document.getElementById('body').value
        const body = JSON.stringify({ title, topic, questionBody });
        fetch('http://localhost:4001/api/questions/new', {method: 'POST', body, mode: 'cors', credentials: 'include', headers: {'Content-Type': 'application/json'}})
            .then(res => {
                console.log(res.headers)
                return res
            })
            .then(res => res.json())
            .then(result => console.log(result))
            .catch(err => console.log(err)) //credentials: 'same-origin' maybe //HTTP BEFORE localhost //api route
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
        return element;
    }
}

export default NewPost;