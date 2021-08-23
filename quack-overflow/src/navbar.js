import React from 'react';
import styles from './navbar.module.css'; 


class Navbar extends React.Component {
    render() {
        const navbar = <div className={styles.navbar}>
        <div>
        <h1> Quack Overflow </h1>
        <ul>
            <li><a href="/"> View all questions </a></li>
            <li><a href="/auth"> Sign {this.props.inUpOrOut} </a></li>
            <li><a href="/me"> {this.props.username} </a></li>
        </ul>
        </div>
        </div>;
        return navbar;
    }
}

export default Navbar;