import React from 'react';
import { Redirect } from 'react-router-dom';
import validator from 'validator';
import style from './signIn.module.css';

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false, 
            profileCreated: false,
            usernameCharCount: 0, 
            passwordCharCount: 0, 
            titleCharCount: 0,
            bioCharCount: 0,
            passwordMatch: false
        }
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
            return null;
        }
        fetch('/api/auth/sign-up', {method: 'POST', credentials: 'include', headers: {'content-type': 'application/json'}, body: JSON.stringify(body)})
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
    updatePasswordMatch = () => {
        const passwordMatch = document.getElementById('password').value === document.getElementById('confirm-password').value ? 'passwords match!' : 'passwords do not match'
        this.setState({ passwordMatch })
    }
    updateCharCounters = () => {
        this.setState(
            {
                usernameCharCount: document.getElementById('username').value.length, 
                titleCharCount: document.getElementById('title').value.length, 
                passwordCharCount: document.getElementById('password').value.length, 
                bioCharCount: document.getElementById('bio').value.length,
            })
    }
    render() {
        const element = <div className={style.signinbox}>
            <div class={style.innerbox}>
                <h1> Sign Up For Quack Overflow! </h1>
                <label for="username"> username </label>
                <span><input onInput={this.updateCharCounters} type="text" id="username" name="username"/><p>{this.state.usernameCharCount} / 40 characters</p></span>
                <label for="title"> title </label>
                <span><input onInput={this.updateCharCounters} type="text" name="title" id="title"></input><p>{this.state.titleCharCount} / 80 characters</p></span>
                <label for="password"> password </label>
                <span><input onInput={this.updateCharCounters} type="password" id="password" name="password"/><p>{this.state.passwordCharCount} / 40 characters</p></span>
                <label for="confirm-password"> confirm password </label>
                <span><input onInput={this.updatePasswordMatch} type="password" id="confirm-password" name="confirm-password"></input><p>{this.state.passwordMatch}</p></span>
                <label for="bio"> bio </label>
                <span><textarea onInput={this.updateCharCounters} id="bio" name="bio"></textarea><p>{this.state.bioCharCount} / 300 characters</p></span>
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