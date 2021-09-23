import React from 'react';
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
        console.log(this.props.username)
        fetch(`http://localhost:4001/api/users/${this.props.username}`, {method: 'GET', headers: {'content-type': 'application/json'}})
            .then(response => response.json())
            .then(result => {
                console.log(result);
                const { bio, title } = result
                this.setState({isLoaded: true, bio, title: `${this.props.username},  ${title}`});
            }, 
            error => {
                console.log(error);
                this.setState({isLoaded: true, error});
            })
    }
    toggleEditTitle = () => {
        this.setState(state => {
            state.titleReadOnly = !state.titleReadOnly;
            state.titleButtonText = state.titleReadOnly ? 'edit' : 'submit';
            //when text readonly is true, submit changes
            return state;
        })
    }
    toggleEditBio = () => {
        this.setState(state => {
            state.bioReadOnly = !state.bioReadOnly;
            state.bioButtonText = state.bioReadOnly ? 'edit' : 'submit';
            return state;
        })
    }
    render() {
        const element = <div>
            <ProfileNavbar username={this.props.username}/>
            <div className={style.userpublic}>
                <div className={style.title}>
                    <textarea readOnly={this.state.titleReadOnly} defaultValue={this.state.title}></textarea>
                    <button onClick={this.toggleEditTitle}>{this.state.titleButtonText}</button>
                </div>
                <div className={style.bio}>
                    <textarea readOnly={this.state.bioReadOnly} defaultValue={this.state.bio}></textarea>
                    <button onClick={this.toggleEditBio}>{this.state.bioButtonText}</button>
                </div>
            </div>
        </div>
        return element;
    }
}

export default UserPublic;