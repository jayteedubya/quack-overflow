import React from 'react';
import AnswerBox from '../postPage/answerBox';
import ProfileNavbar from './profileNavbar';
import style from './userAnswers.module.css';

class UserAnswers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answers: [],
            error: null,
            isLoaded: false
        }
    }
    componentDidMount() {
        fetch(`http://localhost:4001/api/users/${this.props.username}/answers`, {method: 'GET', headers: {'content-type': 'application/json'}})
            .then(response => response.json())
            .then(response => this.setState({isLoaded: true, answers: response}, error=> this.setState({isLoaded: true, error})));
    }
    render() {
        const element = <div>
            <ProfileNavbar username={this.props.username}/>
                <div className={style.useranswers}>
                {this.state.answers.map(answer => <AnswerBox id={answer.id} author={answer.author} pob_count={answer.pob_count} body={answer.body} timestamp={answer.time}></AnswerBox>)}
                </div>
            </div>
        return element;
    }
}

export default UserAnswers;