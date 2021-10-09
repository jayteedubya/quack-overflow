import React from 'react';
import styles from './sidebar.module.css';
import { Link } from 'react-router-dom';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {topics: []};
    }
    componentDidMount() {
        fetch('/api/questions/topics')
            .then(res => res.json())
            .then(topics => this.setState({ topics }))
            .catch(err => console.error(err));
    }
    render() {
        return <div className={styles.sidebar}>
            <h3 style={{marginTop: 0, marginBottom: '10px', textAlign: "center", textDecoration: 'underline'}}> Popular Topics </h3>
            {this.state.topics.map(topic => <div key={topic.topic}><Link to={`/topics/${topic.topic}`}>{topic.topic}</Link><br/></div>)}
        </div>
    }
}



export default Sidebar;