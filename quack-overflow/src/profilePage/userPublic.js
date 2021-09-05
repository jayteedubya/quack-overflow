import React from 'react';
import ProfileNavbar from './profileNavbar';
import style from './userPublic.module.css';

class UserPublic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {titleReadOnly: true, bioReadOnly: true, bioButtonText: 'edit', titleButtonText: 'edit'}
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
        const element = <div className={style.userpublic}>
            <ProfileNavbar/>
            <div>
                <textarea id ="title" readOnly={this.state.titleReadOnly}>{`${this.props.username},  ${this.props.title}`}</textarea>
                <button onClick={this.toggleEditTitle}>{this.state.titleButtonText}</button>
            </div>
            <div>
                <textarea id="bio" readOnly={this.state.bioReadOnly}>{this.props.bio}</textarea>
                <button onClick={this.toggleEditBio}>{this.state.bioButtonText}</button>
            </div>
        </div>
        return element;
    }
}

export default UserPublic;