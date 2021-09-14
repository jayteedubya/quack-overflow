import React from 'react';
import AnswerArea from './answerArea';
import QuestionArea from './questionArea';
import style from './postPage.module.css';

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
    componentDidMount() {
        fetch(`http://localhost:4001/api/questions/question/${this.props.id}`, {method: 'GET', headers: {'content-type': 'application/json'}})
            .then(response => response.json())
            .then(result => {
                this.setState({isLoaded: true, question: result.question, answers: result.answers});
            }, 
            error => {
                console.log(error);
                this.setState({isLoaded: true, error});
            })
    }
    render() {
        return <div className={style.postpage}>
            <QuestionArea question={this.state.question}></QuestionArea>
            <AnswerArea answers={this.state.answers}></AnswerArea>
        </div>
    }
}

export default PostPage;