import React from 'react';
import styles from './navbar.module.css'; 
import { Link, BrowserRouter as Router } from 'react-router-dom';

class Navbar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: null,
            error: null,
            isLoaded: false,
        }
    }
    componentDidUpdate() {
        fetch('http://localhost:4001/api/auth/who-am-i', {method: 'GET', credentials: 'include', mode: 'cors'})
            .then(res => res.json)
            .then(res => this.setState({username: res.username}))
            .catch(err => console.log(err))
    }
    render() {
        const navbar = <div className={styles.navbar}>
            <div>
                <h1> Quack Overflow </h1>
                    <ul>
                        <li><Link to="/"> Questions By Date </Link></li>
                        <li><Link to="/top"> Questions By Views </Link></li>
                        <li><Link to="/sign-in"> Sign In </Link></li>
                        <li><Link to="/sign-up"> Sign Up </Link></li>
                        <li><Link to={`/users/${this.props.username}`}> {this.props.username} </Link></li>
                        <li><Link to="/submit"> Submit a Post </Link></li>
                    </ul>
            </div>
        </div>
        return navbar;
    }
}

export default Navbar;