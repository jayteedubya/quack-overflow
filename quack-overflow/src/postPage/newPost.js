import React from 'react';
import style from './newPost.module.css'

class NewPost extends React.Component {
    submit() {
        return;
    }
    render() {
        const element = <div className={style.newpost}>
            <label for="title"> title </label>
            <br/>
            <input type="text" name="title"></input>
            <br/>
            <label for="topic"> topic </label>
            <br/>
            <input type="text" name="topic"></input>
            <br/>
            <div className={style.textcontainer}>
                <textarea></textarea>
                <br/>
                <button> submit </button>
            </div>
        </div>
        return element;
    }
}

export default NewPost;