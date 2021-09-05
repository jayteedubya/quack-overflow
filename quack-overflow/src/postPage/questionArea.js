import React from 'react';
import style from './questionarea.module.css';

class QuestionArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {readOnly: true, buttonText: 'edit'}
    }
    toggleEdit = () => {
        this.setState(state => {
            state.readOnly = !state.readOnly;
            state.buttonText = state.readOnly ? 'edit' : 'submit';
            return state;
        })
    }
    render() {
        const element = <div className={style.questionarea}>
            <h1>{this.props.title}</h1>
            <textarea readOnly={this.state.readOnly}>{this.props.body}</textarea>
            <br/>
            <p><strong>author: </strong><a href="/profile">{this.props.author}</a> <strong>timestamp: </strong> {this.props.timestamp}</p>
            <button onClick={this.toggleEdit}>{this.state.buttonText}</button><button>delete</button>
        </div>
        return element;
    }
}

export default QuestionArea;