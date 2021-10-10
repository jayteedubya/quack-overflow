import React from 'react';
import Postbox from './postbox';
import { Link } from 'react-router-dom';

class TopPosts extends React.Component {
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
        fetch(`/api/questions/top?page=${this.state.currentPage}`, {method: 'GET', headers: {'content-type': 'application/json'}})
            .then(response => {
                this.setState({ok: response.ok})
                return response;
            })
            .then(response => response.json())
            .then(result => {
                console.log(result);
                this.setState({isLoaded: true, questions: result});
            })
            .catch(err => console.error(err));
    }
    nextPage = () => {
        this.setState({currentPage: this.state.currentPage + 1});
        fetch(`/api/questions/top?page=${this.state.currentPage}`, {method: 'GET', headers: {'content-type': 'application/json'}})
            .then(response => response.json())
            .then(result => {
                this.setState({isLoaded: true, questions: result});
            })
            .catch(err => console.error(err));
        
    }
    prevPage = () => {
        if (this.state.pageNumber - 1 >= 0) {
            this.setState({currentPage: this.state.currentPage - 1});
            fetch(`/api/questions/top?page=${this.state.currentPage}`, {method: 'GET', headers: {'content-type': 'application/json'}})
                .then(response => response.json())
                .then(result => {
                    if (result.error) {
                        this.setState({error: result.error, isLoaded: true});
                    }
                    this.setState({isLoaded: true, questions: result});
                });
        }
        return;
    }
    render() {
        let Items;
        if (this.state.isLoaded && !this.state.error) {
            try {
                Items = this.state.questions.map(post => //use css to give this a class with margin 170px
                <Postbox key = {post.id} url={`/questions/${post.id}`} author={post.author} timestamp={new Date(post.time).toLocaleString()} views={post.views} title={post.title}/>
            );
            }
            catch (err) {
                return <div style={{textAlign: 'center', border: '1px solid black', marginLeft: '170px', padding: '5%', marginRight: '10px', backgroundColor: 'rgb(150, 150, 150)'}}>
                    <h1> No posts have been made yet!</h1>
                    <h3> You should really do something about that </h3>
                    <h6> please... </h6>
                    <Link to="/submit"> Make a Post</Link>
                </div>
            }
        }
        if (this.state.isLoaded && this.state.error) {
            Items = <div style={{textAlign: 'center', border: '1px solid black', marginLeft: '170px', padding: '5%', marginRight: '10px', backgroundColor: 'rgb(150, 150, 150)'}}>
                <h1> No posts have been made yet!</h1>
                <h3> You should really do something about that </h3>
                <h6> please... </h6>
                <Link to="/submit"> Make a Post</Link>
            </div>
        }
        return <div>
            {Items}
            {this.state.questions.length > 24 && <button style={{'margin-left': '170px'}} onClick={this.nextPage}> next page </button>}
        </div>
    }
}

export default TopPosts;