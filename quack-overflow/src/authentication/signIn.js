import React from 'react';
import style from './signIn.module.css';

class SignIn extends React.Component {
    signIn() {
        const username = document.getElementById('username').value
        const password = document.getElementById('password').value
        const req = {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                username,
                password
            })
        }
        fetch('http://localhost:4001/api/auth/sign-in', req)
            .then(res => res.json())
            .then(res => console.log(res));
    }
    render() {
        const element = <div className={style.signinbox}>
            <div class={style.innerbox}>
                <h1> Sign In To Quack Overflow! </h1>
                <label for="username"> username </label>
                <input type="text" id="username" name="username"/>
                <br/>
                <label for="password"> password </label>
                <input type="password" id="password" name="password"/>
                <br/>
                <button onClick={this.signIn}> Sign In </button>
            </div>
        </div>
        return element
    }
}

export default SignIn;