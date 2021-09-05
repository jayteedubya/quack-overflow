import React from 'react';
import AnswerArea from './answerArea';
import QuestionArea from './questionArea';
import style from './postPage.module.css';

class PostPage extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <div className={style.postpage}>
            <QuestionArea author="some_guy" timestamp="2021-09-03" title="this is a test post, what is thing?"></QuestionArea>
            <AnswerArea></AnswerArea>
        </div>
    }
}

export default PostPage;