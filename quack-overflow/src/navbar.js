import React from 'react';
import styles from './navbar.module.css'; 


class Navbar extends React.Component {
    render() {
        const navbar = <div className={styles.navbar}>
        <div>
        <h1> Quack Overflow </h1>
        <ul>
            <li><a href="/"> View All Questions </a></li>
            <li><a href="/top"> Most Viewed Questions </a></li>
            <li><a href="/popular"> Hot Questions </a></li>
            <li><a href="most answered"> Most Answered Questions</a></li>
            <li><a href="/auth"> Sign {this.props.upOrOut} </a></li>
            <li><a href="/me"> {this.props.username} </a></li>
        </ul>
        </div>
        </div>;
        return navbar;
    }
}

export default Navbar;