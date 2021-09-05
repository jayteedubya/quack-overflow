import React from 'react';
import styles from './postbox.module.css'; 

class Postbox extends React.Component {
    render() {
        const box = <div className={styles.postbox}>
            <div>
            <h3><a href={this.props.url}>{this.props.title}</a></h3>
            <p>{this.props.author}</p>
            <p>{this.props.timestamp}</p>
            <p>views: {this.props.views}</p>
        </div>
        </div>
        return box;
    }
}

export default Postbox;