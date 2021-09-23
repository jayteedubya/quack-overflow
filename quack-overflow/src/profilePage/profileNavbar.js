import React from 'react';
import style from './profileNavbar.module.css';
import { Link } from 'react-router-dom';

class ProfileNavbar extends React.Component {
    render() {
        const element = <ul className={style.profilenavbar}>
            <li><h3>{this.props.username}</h3></li>
            <li><Link to={`/users/${this.props.username}/questions`}>Questions</Link></li>
            <li><Link to={`/users/${this.props.username}/answers`}>Answers</Link></li>
            <li><Link to={`/users/${this.props.username}`}>About me</Link></li>
        </ul>
        return element;
    }
}

export default ProfileNavbar;