import React from 'react';
import { Redirect } from 'react-router-dom';
import validator from 'validator';
import style from './signIn.module.css';

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loggedIn: false, profileCreated: false}
    }
    getAndValidateFields() {
        const username = document.getElementById('username').value;
        if (!validator.isAlphanumeric(username) || username.length > 40) {
            window.alert('username must be alpha numeric and less than 40 characters or less in length');
            document.getElementById('username').value = '';
            return null;
        }
        const password = document.getElementById('password').value;
        if (!validator.isStrongPassword(password) || password.length > 40) {
            window.alert('password must contain a capital letter, a lowercase letter, a number, and a symbol and must be between 8 and 41 characters long');
            document.getElementById('password').value = '';
            return null;
        }
        const confirmPassword = document.getElementById('confirm-password').value
        if (password !== confirmPassword) {
            window.alert('password and confirm password must match');
            document.getElementById('password').value = '';
            document.getElementById('confirm-password').value = '';
            return null;
        }
        const title = document.getElementById('title').value;
        if (!validator.isAlphanumeric(title) && title.length > 60) {
            window.alert('title must not be more than 60 characters in length and must be alphanumeric');
            document.getElementById('title').value = '';
            return null;
        }
        const bio = document.getElementById('bio').value;
        if (bio.length > 300) {
            window.alert('bio must not be longer than 300 characters in length');
            return null;
        }

        return { username, password, title, bio };
    }
    signUp = () => {
        const body = this.getAndValidateFields();
        if (!body) {
            console.log('no body')
            return null;
        }
        fetch('http://localhost:4001/api/auth/sign-up', {method: 'POST', credentials: 'include', headers: {'content-type': 'application/json'}, body: JSON.stringify(body)})
            .then(res => res.json())
            .then(res => {
                if (res.message && res.message === 'profile created!') {
                    this.setState({loggedIn: true, profileCreated: true});
                    this.props.updateAppState({ username: body.username });
                }
                if (res.error && res.error === 'username already taken') {
                    window.alert('that username is already taken');
                    document.getElementById('username').value = '';
                }
            });
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
        if (this.state.loggedIn) {
            return <Redirect to="/"/>
        }
        return element
    }
}

export default SignUp;