import React from 'react';
import AnswerBox from '../postPage/answerBox';
import ProfileNavbar from './profileNavbar';
import style from './userAnswers.module.css';
import { Link } from 'react-router-dom'

class UserAnswers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answers: [],
            error: null,
            isLoaded: false
        }
    }
    updateAnswers = () => {
        fetch(`http://localhost:4001/api/users/${this.props.username}/answers`, {method: 'GET', headers: {'content-type': 'application/json'}})
            .then(response => response.json())
            .then(result => {
                this.setState({isLoaded: true, question: result.question, answers: result.answers});
            }, 
            error => {
                console.log(error);
                this.setState({isLoaded: true, error});
            })
        }
    componentDidMount() {
        fetch(`http://localhost:4001/api/users/${this.props.username}/answers`, {method: 'GET', headers: {'content-type': 'application/json'}})
            .then(response => response.json())
            .then(response => this.setState({isLoaded: true, answers: response}, error=> this.setState({isLoaded: true, error})));
    }
    render() {
        console.log('user answers user viewing', this.props.userViewing)
        const element = <div>
            <ProfileNavbar username={this.props.username}/>
                <div className={style.useranswers}>
                {this.state.answers.map(answer => <AnswerBox profilePage updateAnswers={this.props.updateAnswers} userViewing={this.props.userViewing} question_id={answer.question_id} id={answer.id} key={answer.id} author={answer.author} pob_count={answer.pob_count} body={answer.body} timestamp={answer.time}></AnswerBox>)}
                </div>
            </div>
        return element;
    }
}

export default UserAnswers;