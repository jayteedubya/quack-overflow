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
    render() {
        const navbar = <div className={styles.navbar}>
            <div>
                <h1> Quack Overflow </h1>
                    <ul>
                        <li><Link to="/"> Questions By Date </Link></li>
                        <li><Link to="/top"> Questions By Views </Link></li>
                        <li><Link to="/submit"> Ask A Question </Link></li>
                        {!this.props.username && <li><Link to="/sign-in"> Sign In </Link></li>}
                        {!this.props.username && <li><Link to="/sign-up"> Sign Up </Link></li>}
                        {!!this.props.username && <li><Link to="/sign-out"> Sign Out</Link></li>}
                        {!!this.props.username && <li><Link to={`/users/${this.props.username}`}> {this.props.username} </Link></li>}
                    </ul>
            </div>
        </div>
        return navbar;
    }
}

export default Navbar;