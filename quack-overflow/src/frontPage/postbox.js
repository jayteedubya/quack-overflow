import React from 'react';
import { Link } from 'react-router-dom';
import styles from './postbox.module.css'; 

class Postbox extends React.Component {
    render() {
        const box = <div className={styles.postbox}>
            <div>
            <h3><Link to={this.props.url}>{this.props.title}</Link></h3>
            <p><strong>author:</strong> {this.props.author}</p>
            <p><strong>timestamp:</strong> {this.props.timestamp}</p>
            <p><strong>views:</strong> {this.props.views}</p>
        </div>
        </div>
        return box;
    }
}

export default Postbox;