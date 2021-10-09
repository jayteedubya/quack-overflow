import React from 'react';
import { Redirect } from 'react-router';
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
    editQuestion = () => {
        if (!this.state.readOnly) {
            const questionBody = document.getElementById('question-body').value;
            const body = JSON.stringify({ questionBody });
            fetch(`/api/questions/question/${this.props.id}`, {method: 'PUT', body, credentials: 'include', headers: {'Content-Type': 'application/json'}})
                .then(res => res.json())
                .catch(err => console.error(err));
            this.toggleEdit(); 
            return;
        }
        this.toggleEdit();
        return;
    }
    deleteQuestion = () => {
        const confirmation = window.confirm('are you sure you want to delete this question?')
        if (confirmation) {
            fetch(`/api/questions/question/${this.props.id}`, {method: 'DELETE', mode: 'cors', credentials: 'include', headers: {'Content-Type': 'application/json'}})
                .then(res => res.json())
                .then(() => this.props.updateAnswers())
                .catch(err => console.error(err));
            window.location.href = '/';
        }
    }
    render() {
        const element = <div className={style.questionarea}>
            <h1>{this.props.question.title}</h1>
            <textarea id="question-body" readOnly={this.state.readOnly} defaultValue={this.props.question.body}></textarea>
            <br/>
            <p><strong>author: </strong>{this.props.question.author}<a href="/profile">{this.props.author}</a> <strong>timestamp: </strong> {new Date(this.props.question.time).toLocaleString()}</p>
            {this.props.username === this.props.question.author && <div><button onClick={this.editQuestion}>{this.state.buttonText}</button><button onClick={this.deleteQuestion}>delete</button></div>}
        </div>
        return element;
    }
}

export default QuestionArea;