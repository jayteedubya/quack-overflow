import React from 'react';
import style from './profileNavbar.module.css';

class ProfileNavbar extends React.Component {
    render() {
        const element = <ul className={style.profilenavbar}>
            <li><a>Questions</a></li>
            <li><a>Answers</a></li>
            <li><a>About me</a></li>
        </ul>
        return element;
    }
}

export default ProfileNavbar;