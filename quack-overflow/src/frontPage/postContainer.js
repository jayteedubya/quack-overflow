import React from 'react';
import Postbox from './postbox';

class PostContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            questions: [],
            currentPage: 1
        }
    }
    componentDidMount() {
        fetch(`http://localhost:4001/api/questions/?page=${this.state.currentPage}`, {method: 'GET', headers: {'content-type': 'application/json'}})
            .then(response => response.json())
            .then(result => {
                this.setState({isLoaded: true, questions: result});
            }, 
            error => {
                console.log(error);
                this.setState({isLoaded: true, error});
            })
    }
    render() {
        const Items = this.state.questions.map(post => 
                <Postbox url={`/questions/${post.id}`} author={post.author} timestamp={new Date(post.time).toLocaleString()} views={post.views} title={post.title}>
                </Postbox>
            );
        return <div>
            {Items}
        </div>
    }
}

export default PostContainer;