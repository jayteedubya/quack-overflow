import React from 'react';
import styles from './sidebar.module.css';

class Sidebar extends React.Component {
    render() {
        return <div className={styles.sidebar}>
                <a href="/stuff">topic</a>
                <br/>
                <a>topic</a>
                <br/>
                <a>topic</a>
        </div>
    }
}

export default Sidebar;