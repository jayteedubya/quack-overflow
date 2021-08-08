const answersRouter = require('express').Router();
const answers = require('../../database/answers');
const { resolver } = require('../../utilities/utilities');
const { authorizeRequest, validateAnswerBody, verifyAnswerPermissions } = require('../../utilities/middleware');

answersRouter.post('/:questionId', authorizeRequest, validateAnswerBody, (req, res, next) => {
    const author = req.credentials.username;
    const questionId = req.params.questionId;
    answers.answerQuestion(author, req.body.answerBody, questionId);
    res.json({message: 'answer submitted'});
    return;
});

answersRouter.put('/answer/:answerId', authorizeRequest, verifyAnswerPermissions, async (req, res, next) => {
    const body = req.body.answerBody;
    const id = req.params.answerId
    [ data, error ] = await resolver(answers.editAnswer(id, body));
    if (error) {
        next(error);
        return;
    }
    res.json({message: 'successful edit!'});
    return;
});

answersRouter.delete('/answer/:answerId', authorizeRequest, verifyAnswerPermissions, (req, res, next) => {
    const id = req.params.answerId;
    [ data, error ] = await resolver(answers.deleteAnswer(id));
    if (error) {
        next(error);
        return;
    }
    res.json({message: 'answer deleted'});
    return;
})