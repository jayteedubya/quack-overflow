import React from 'react';
import style from './signIn.module.css';
import { Redirect } from "react-router-dom";

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loggedIn: false, errorMessage: null}
    }
    signIn() {
        const username = document.getElementById('username').value
        const password = document.getElementById('password').value
        const req = {
            method: 'POST',
            credentials: 'include',      //IMPORTANT! if this is not here, the credentials will not be able to be used in requests, always include credentials
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                username,
                password
            })
        }
        fetch('/api/auth/sign-in', req)
            .then(res => res.json())
            .then(res => {
                if (res.message === 'log in success') {
                    this.setState({loggedIn: true});
                    this.props.updateAppState({username});  
                }
                if (res.error) {
                    this.setState({errorMessage: res.error});
                }
            });
        
    }
    render() { //DO NOT update state in render method. will call itself recursively
        const element = <div className={style.signinbox}>
            <div className={style.innerbox}>
                <h1> Sign In To Quack Overflow! </h1>
                <label htmlFor="username"> username </label>
                <input type="text" id="username" name="username"/>
                <br/>
                <label htmlFor="password"> password </label>
                <input type="password" id="password" name="password"/>
                <br/>
                {this.state.errorMessage && <p style={{color: 'red'}}>{this.state.errorMessage}</p>}
                <button onClick={()=>this.signIn()}> Sign In </button>
            </div>
        </div>
        if (this.state.loggedIn) {
            return <Redirect to="/"/>
        }
        return element
    }
}

export default SignIn;