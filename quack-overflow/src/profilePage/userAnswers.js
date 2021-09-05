import React from 'react';
import AnswerBox from '../postPage/answerBox';

class UserAnswers extends React.Component {
    render() {
        const element = <div>
            {this.answers.map(answer => <AnswerBox id={answer.id} author={answer.author} pob_count={answer.pob_count} body={answer.body} timestamp={answer.time}></AnswerBox>)}
            </div>
        return element;
    }
}

export default UserAnswers;