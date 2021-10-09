import React from 'react';
import Postbox from './postbox';
import { Link } from 'react-router-dom';

class PostContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            questions: [],
            currentPage: 0,
            ok: true
        }
    }
    componentDidMount() {
        fetch(`http://localhost:4001/api/questions?page=${this.state.currentPage}`, {method: 'GET', headers: {'content-type': 'application/json'}})
            .then(response => {
                this.setState({ok: response.ok})
                return response;
            })
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
    nextPage = () => {
        this.setState({currentPage: this.state.currentPage + 1});
        console.log(this.state.currentPage);
        fetch(`http://localhost:4001/api/questions?page=${this.state.currentPage}`, {method: 'GET', headers: {'content-type': 'application/json'}})
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
            fetch(`http://localhost:4001/api/questions?page=${this.state.currentPage}`, {method: 'GET', headers: {'content-type': 'application/json'}})
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
        let Items;
        console.log('continuing being triggered!!!!!');
        Items = this.state.questions.map(post => //use css to give this a class with margin 170px
            <Postbox key = {post.id} url={`/questions/${post.id}`} author={post.author} timestamp={new Date(post.time).toLocaleString()} views={post.views} title={post.title}/>
        );
        if (!this.state.ok) {
            Items = <div style={{textAlign: 'center', border: '1px solid black', marginLeft: '170px', padding: '5%', marginRight: '10px', backgroundColor: 'rgb(150, 150, 150)'}}>
                <h1> No posts have been made yet!</h1>
                <h3> You should really do something about that </h3>
                <h6> please... </h6>
                <Link to="/submit"> Make a Post</Link>
            </div>
        }
        return <div>
            {Items}
            {Items.length > 24 && <button style={{'margin-left': '170px'}} onClick={this.nextPage}> next page </button>}
        </div>
    }
}

export default PostContainer;