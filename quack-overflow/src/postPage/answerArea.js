import React from 'react';
import AnswerBox from './answerBox';

class AnswerArea extends React.Component {
    constructor(props) {
        super(props);
        this.answers = [
            {
                id: 1,
                author: 'testy mctestface',
                pob_count: 5,
                body: 'this is test answer text stuff I bet',
                time: 'today'
            },
            {
                id: 2,
                author: 'testy mctestface',
                pob_count: 5,
                body: 'this is test answer text stuff I bet',
                time: 'today'
            }
        ]
    }
    render() {
        const element = <div>
                {this.answers.map(answer => <AnswerBox id={answer.id} author={answer.author} pob_count={answer.pob_count} body={answer.body} timestamp={answer.time}></AnswerBox>)}
            </div>
        return element;
    }
}

export default AnswerArea;