import React from 'react';
import AnswerArea from './answerArea';
import QuestionArea from './questionArea';
import style from './postPage.module.css';
import { Redirect } from 'react-router';

class PostPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            question: {},
            answers: []
        }
    }
    updateAnswers = () => {
        fetch(`/api/questions/question/${this.props.id}`, {method: 'GET', headers: {'content-type': 'application/json'}})
            .then(response => response.json())
            .then(result => {
                this.setState({isLoaded: true, question: result.question, answers: result.answers});
            })
            .catch(err => console.error(err));
    }
    componentDidMount() {
        fetch(`/api/questions/question/${this.props.id}`, {method: 'GET', headers: {'content-type': 'application/json'}})
            .then(response => response.json())
            .then(result => {
                this.setState({isLoaded: true, question: result.question, answers: result.answers});
            })
            .catch(err => console.error(err));
    }
    render() {
        if (!this.state.isLoaded) {
            Items = <div style={{margin: '0 10px 0 170px', border: '1px solid black', backgroundColor: 'rgb(150, 150, 150)'}}><h3> Loading... </h3></div>
        }
        let element = <div><Redirect to="/404"/></div>
        if (this.state.question) {
        element = <div className={style.postpage}>
            <QuestionArea id={this.props.id} username={this.props.username} question={this.state.question}></QuestionArea>
            <AnswerArea username={this.props.username} userLoggedin={this.props.userLoggedin} questionId={this.props.id} answers={this.state.answers} updateAnswers={this.updateAnswers}></AnswerArea>
        </div>
        }
        return element;
    }
}

export default PostPage;