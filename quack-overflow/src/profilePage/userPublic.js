import React from 'react';
import { Redirect } from 'react-router';
import ProfileNavbar from './profileNavbar';
import style from './userPublic.module.css';

class UserPublic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            titleReadOnly: true,
            bioReadOnly: true,
            bioButtonText: 'edit', 
            titleButtonText: 'edit', 
            title: null, 
            bio: null, 
            isLoaded: false
        }
    }
    componentDidMount() {
        fetch(`/api/users/${this.props.match.params.username}`, {method: 'GET', headers: {'content-type': 'application/json'}})
            .then(response => response.json())
            .then(result => {
                const { bio, title } = result
                this.setState({isLoaded: true, bio, title});
            })
            .catch(err => console.error(err));
    }
    toggleEditTitle = () => {
        this.setState(state => {
            state.titleReadOnly = !state.titleReadOnly;
            state.titleButtonText = state.titleReadOnly ? 'edit' : 'submit';
            return state;
        })
    }
    editTitle = () => {
        if (!this.state.titleReadOnly) {
            const title = document.getElementById('title').value;
            const body = JSON.stringify({ title });
            fetch(`/api/users/${this.props.match.params.username}/title`, {method: 'PUT', body, mode: 'cors', credentials: 'include', headers: {'Content-Type': 'application/json'}})
                .then(res => res.json())
                .catch(err => console.error(err));
            this.toggleEditTitle(); 
            return;
        }
        this.toggleEditTitle();
        return;
    }
    toggleEditBio = () => {
        this.setState(state => {
            state.bioReadOnly = !state.bioReadOnly;
            state.bioButtonText = state.bioReadOnly ? 'edit' : 'submit';
            return state;
        })
    }
    editBio = () => {
        if (!this.state.bioReadOnly) {
            const bio = document.getElementById('bio').value;
            const body = JSON.stringify({ bio });
            fetch(`/api/users/${this.props.match.params.username}/bio`, {method: 'PUT', body, mode: 'cors', credentials: 'include', headers: {'Content-Type': 'application/json'}})
                .then(res => res.json())
                .catch(err => console.error(err));
            this.toggleEditBio(); 
            return;
        }
        this.toggleEditBio();
        return;
    }
    render() {
        var element = <div>
            <ProfileNavbar username={this.props.match.params.username}/>
            <div className={style.userpublic}>
                <div className={style.title}>
                    <h3 style={{margin: 0}}> title </h3>
                    <textarea id="title" readOnly={this.state.titleReadOnly} defaultValue={this.state.title}></textarea>
                    {this.props.userViewing === this.props.match.params.username && <button onClick={this.editTitle}>{this.state.titleButtonText}</button>}
                </div>
                <div className={style.bio}>
                    <h3 style={{margin: 0}}> bio </h3>
                    <textarea id="bio" readOnly={this.state.bioReadOnly} defaultValue={this.state.bio}></textarea>
                    {this.props.userViewing === this.props.match.params.username && <button onClick={this.editBio}>{this.state.bioButtonText}</button>}
                </div>
            </div>
        </div>
        if (!this.state.bio && this.state.isLoaded) {
            element = <div><Redirect to="/404"/></div>
        }
        return element;
    }
}

export default UserPublic;