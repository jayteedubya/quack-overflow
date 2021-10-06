import React from 'react';
import Postbox from './postbox';

class TopicPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            questions: [],
            currentPage: 0
        }
    }
    componentDidMount() {
        fetch(`http://localhost:4001/api/questions/topics/${this.props.topic}?page=${this.state.currentPage}`, {method: 'GET', headers: {'content-type': 'application/json'}})
            .then(response => {
                return response;
            })
            .then(response => response.json())
            .then(result => {
                this.setState({isLoaded: true, questions: result});
            }, 
            error => {
                console.log(error);
                this.setState({isLoaded: true, error});
            })
    }
    nextPage = () => {
        this.setState({currentPage: this.state.currentPage + 1});
        fetch(`http://localhost:4001/api/questions/topics/${this.props.topic}?page=${this.state.currentPage}`, {method: 'GET', headers: {'content-type': 'application/json'}})
            .then(response => response.json())
            .then(result => {
                console.log(result)
                this.setState({isLoaded: true, questions: result});
            }, 
            error => {
                console.log(error);
                this.setState({isLoaded: true, error});
            })
        
    }
    prevPage = () => {
        if (this.state.pageNumber - 1 >= 0) {
            this.setState({currentPage: this.state.currentPage - 1});
            fetch(`http://localhost:4001/api/questions/topics/${this.props.topic}?page=${this.state.currentPage}`, {method: 'GET', headers: {'content-type': 'application/json'}})
                .then(response => response.json())
                .then(result => {
                    console.log(result)
                    this.setState({isLoaded: true, questions: result});
                }, 
                error => {
                    console.log(error);
                    this.setState({isLoaded: true, error});
                })
                return;
        }
        return;
    }
    render() {
        const Items = this.state.questions.map(post => //use css to give this a class with margin 170px
                <Postbox key = {post.id} url={`/questions/${post.id}`} author={post.author} timestamp={new Date(post.time).toLocaleString()} views={post.views} title={post.title}/>
            );
        return <div>
            {Items}
            {Items.length > 24 && <button style={{'margin-left': '170px'}} onClick={this.nextPage}> next page </button>}
        </div>
    }
}

export default TopicPage;