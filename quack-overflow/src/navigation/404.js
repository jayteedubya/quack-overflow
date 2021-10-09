import React from 'react';
import { Link } from 'react-router-dom';
import style from './fourzerofour.module.css';

class FourZeroFour extends React.Component {
    render() {
        const element = <div>
            <div className={style.fourzerofour}>
                <h1> Cant find anything here </h1>
                <h3> you should look somewhere else </h3>
                <h6> please... </h6>
                <Link to="/"> Home </Link>
            </div>
        </div>
        return element
    }
}

export default FourZeroFour;