import React from 'react';
import styles from './postbox.module.css'; 

class Postbox extends React.Component {
    render() {
        console.log(this.props)
        const box = <div className={styles.postbox}>
            <div>
            <h3><a href={this.props.url}>{this.props.title}</a></h3>
            <p><strong>author:</strong> {this.props.author}</p>
            <p><strong>timestamp:</strong> {this.props.timestamp}</p>
            <p><strong>views:</strong> {this.props.views}</p>
        </div>
        </div>
        return box;
    }
}

export default Postbox;