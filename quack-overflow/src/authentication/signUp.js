import React from 'react';
import style from './signIn.module.css';

class SignUp extends React.Component {
    signUp() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const title = document.getElementById('title').value;
        const bio = document.getElementById('bio').value;
        const body = JSON.stringify({ username, password, title, bio });
        fetch('http://localhost:4001/api/auth/sign-up', {method: 'POST', headers: {'content-type': 'application/json'}, body})
            .then(res => res.json())
            .then(res => console.log(res))
    }
    render() {
        const element = <div className={style.signinbox}>
            <div class={style.innerbox}>
                <h1> Sign Up For Quack Overflow! </h1>
                <label for="username"> username </label>
                <input type="text" id="username" name="username"/>
                <br/>
                <label for="title"> title </label>
                <input type="text" name="title" id="title"></input>
                <br/>
                <label for="password"> password </label>
                <input type="password" id="password" name="password"/>
                <br/>
                <label for="confirm-password"> confirm password </label>
                <input type="password" id="confirm-password" name="confirm-password"></input>
                <br/>
                <label for="bio"> bio </label>
                <br/>
                <textarea id="bio" name="bio"></textarea>
                <br/>
                <button onClick={this.signUp}> Sign Up! </button>
            </div>
        </div>
        return element
    }
}

export default SignUp;