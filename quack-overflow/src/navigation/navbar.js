import React from 'react';
import styles from './navbar.module.css'; 
import { Link, BrowserRouter as Router } from 'react-router-dom';

class Navbar extends React.Component {
    render() {
        const navbar = <div className={styles.navbar}>
            <div>
                <h1> Quack Overflow </h1>
                    <ul>
                        <li><Link to="/"> View All Questions </Link></li>
                        <li><Link to="/top"> Most Viewed Questions </Link></li>
                        <li><Link to="/popular"> Hot Questions </Link></li>
                        <li><Link to="/most-answered"> Most Answered Questions</Link></li>
                        <li><Link to="/sign-in"> Sign In </Link></li>
                        <li><Link to="/sign-up"> Sign Up </Link></li>
                        <li><Link to="/me"> {this.props.username} </Link></li>
                    </ul>
            </div>
        </div>
        return navbar;
    }
}

export default Navbar;