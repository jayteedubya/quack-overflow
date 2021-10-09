import React from 'react';
import AnswerBox from './answerBox';
import style from './answerArea.module.css';

class AnswerArea extends React.Component {
    getAndValidateAnswer() {
        const answer = document.getElementById('new-comment').value;
        if (answer.length > 600) {
            window.alert('answer must be 600 characters or less');
            return null;
        }
        return answer;
    }
    submit = () => {
        const answerBody = this.getAndValidateAnswer();
        if (!answerBody) {
            return;
        }
        document.getElementById('new-comment').value = '';
        const body = JSON.stringify({ answerBody });
        fetch(`/api/answers/${this.props.questionId}`, {method: 'POST', body, mode: 'cors', credentials: 'include', headers: {'Content-Type': 'application/json'}})
            .then(() => this.props.updateAnswers())
            .catch(err => console.error(err));
    }
    render() {
        const element = <div>
                    {this.props.username && <div className={style.submitbox}>
                        <h3>Answer The Question!</h3>
                        <textarea id="new-comment"></textarea>
                        <br/>
                        <button onClick={this.submit}> submit </button>
                    </div>}
                {this.props.answers.map(answer => <AnswerBox updateAnswers={this.props.updateAnswers} id={answer.id} key={answer.id} author={answer.author} userViewing={this.props.username} pob_count={answer.pob_count} body={answer.body} timestamp={answer.time}></AnswerBox>)}
            </div>
        return element;
    }
}

export default AnswerArea;