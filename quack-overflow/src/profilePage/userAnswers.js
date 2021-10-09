import React from 'react';
import AnswerBox from '../postPage/answerBox';
import ProfileNavbar from './profileNavbar';
import style from './userAnswers.module.css';
import { Redirect } from 'react-router-dom'

class UserAnswers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answers: [],
            error: null,
            isLoaded: false,
            ok: true
        }
    }
    updateAnswers = () => {
        fetch(`http://localhost:4001/api/users/${this.props.username}/answers`, {method: 'GET', headers: {'content-type': 'application/json'}})
            .then(response => {
                this.setState({ok: response.ok});
                return response;
            })
            .then(response => response.json())
            .then(result => {
                this.setState({isLoaded: true, answers: result.answers});
            })
            .catch(err => console.error(err));
        }
    componentDidMount() {
        fetch(`http://localhost:4001/api/users/${this.props.username}/answers`, {method: 'GET', headers: {'content-type': 'application/json'}})
            .then(response => {
                this.setState({ok: response.ok});
                return response;
            })
            .then(response => response.json())
            .then(response => this.setState({isLoaded: true, answers: response}, error=> this.setState({isLoaded: true, error})));
    }
    render() {
        var element = <div>
            <ProfileNavbar username={this.props.username}/>
                <div className={style.useranswers}>
                {this.state.answers.map(answer => <AnswerBox profilePage updateAnswers={this.props.updateAnswers} userViewing={this.props.userViewing} question_id={answer.question_id} id={answer.id} key={answer.id} author={answer.author} pob_count={answer.pob_count} body={answer.body} timestamp={answer.time}></AnswerBox>)}
                </div>
            </div>
        if (!this.state.ok) {
            element = <div><Redirect to="/404"/></div>
        }
        return element;
    }
}

export default UserAnswers;