import React from 'react';
import AnswerBox from './answerBox';

class AnswerArea extends React.Component {
    render() {
        const element = <div>
                {this.props.answers.map(answer => <AnswerBox id={answer.id} author={answer.author} pob_count={answer.pob_count} body={answer.body} timestamp={answer.time}></AnswerBox>)}
            </div>
        return element;
    }
}

export default AnswerArea;