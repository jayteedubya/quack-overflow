import React from 'react';
import style from './answerBox.module.css';
import { Link } from 'react-router-dom';

class AnswerBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {readOnly: true, buttonText: 'edit', buttonDisabled: false};
    }
    toggleEdit = () => {
        this.setState(state => {
            state.readOnly = !state.readOnly;
            state.buttonText = state.readOnly ? 'edit' : 'submit';
            return state;
        })
    }
    editAnswer = () => {
        if (!this.state.readOnly) {
            const answerBody = document.getElementById('answer-body').value;
            const body = JSON.stringify({ answerBody });
            fetch(`http://localhost:4001/api/answers/answer/${this.props.id}`, {method: 'PUT', body, mode: 'cors', credentials: 'include', headers: {'Content-Type': 'application/json'}})
                .then(res => res.json())
                .catch(err => console.error(err));
            this.toggleEdit(); 
            return;
        }
        this.toggleEdit();
        return;
    }

    deleteAnswer = () => {
        const confirmation = window.confirm('are you sure you want to delete this answer?')
        if (confirmation) {
            fetch(`http://localhost:4001/api/answers/answer/${this.props.id}`, {method: 'DELETE', mode: 'cors', credentials: 'include', headers: {'Content-Type': 'application/json'}})
                .then(res => res.json())
                .then(() => this.props.updateAnswers())
                .catch(err => console.error(err));
                
        }
    }
    patOnTheBack = () => {
        fetch(`http://localhost:4001/api/answers/answer/${this.props.id}/POB`,{method: 'PUT', credentials: 'include'})
            .then(res => res.json())
            .then(res => {
                if (res.message === 'post successfully POB\'d' || res.error === 'user has already patted post in the back!') {
                    this.setState({buttonDisabled: true});
                }
            })
    }
    render() {
        const element = 
        <div className={style.answerbox}>
            {this.props.profilePage && <Link to={`/questions/${this.props.question_id}`}>original question</Link>}
            <textarea readOnly={this.state.readOnly} defaultValue={this.props.body} id="answer-body"></textarea>
            <br/>
            <p><strong>author: </strong><Link to={`/users/${this.props.author}`}>{this.props.author}</Link>    <strong>timestamp: </strong> {new Date(this.props.timestamp).toLocaleString()}    <strong>Patted on the back </strong>{`${this.props.pob_count}`}<strong> times</strong></p>
            {this.props.userViewing === this.props.author && <span><button onClick={this.editAnswer}>{this.state.buttonText}</button><button onClick={this.deleteAnswer}>delete</button></span>}
            {!!this.props.userViewing && <button onClick={this.patOnTheBack} disabled={this.state.buttonDisabled}>pat 'em on the back</button>}
        </div>
        return element;
    }
}

export default AnswerBox;