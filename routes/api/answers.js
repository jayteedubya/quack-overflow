const answersRouter = require('express').Router();
const answers = require('../../database/answers');
const questions = require('../../database/questions');
const { resolver } = require('../../utilities/utilities');
const { authorizeRequest, validateAnswerBody, verifyAnswerPermissions, verifyPostPermissions } = require('../../utilities/middleware');
const users = require('../../database/users');

answersRouter.put('/answer/:id', authorizeRequest, verifyAnswerPermissions, async (req, res, next) => {
    const body = req.body.answerBody;
    const id = req.params.id;
    [ data, error ] = await resolver(answers.editAnswer(id, body));
    if (error) {
        next(error);
        return;
    }
    res.json({message: 'successful edit!'});
    return;
});

answersRouter.delete('/answer/:id', authorizeRequest, verifyAnswerPermissions, async (req, res, next) => {
    const id = req.params.id;
    [ data, error ] = await resolver(answers.deleteAnswer(id));
    if (error) {
        next(error);
        return;
    }
    res.json({message: 'answer deleted'});
    return;
});

answersRouter.put('/answer/:id/POB', authorizeRequest, async (req, res, next) => {
    const id = Number(req.params.id);
    const username = req.credentials.username;
    [ userPOBs, userGetError ] = await resolver(users.getUserPOBs(username));
    if (userGetError) {
        next(userGetError);
        return;
    }
    if (!userPOBs[0]) {
        res.status(400).json({error: 'user could not be found!'});
        return;
    }
    const currentPOBs = userPOBs[0].pobed_answers;
    console.log(id)
    console.log(currentPOBs)
    console.log(currentPOBs.indexOf(id))
    if (currentPOBs.indexOf(id) !== -1) {
        res.status(400).json({error: 'user has already patted post in the back!'});
        return;
    }
    [ userData, userError ] = await resolver(users.pobAnswer(id, username));
    [ data, error ] = await resolver(answers.patAnswerOnTheBack(id));
    if (error) {
        next(error);
        return;
    }
    if (userError) {
        console.log(userError);
        next(userError)
        return;
    }
    res.json({message: 'post successfully POB\'d'});
    return;
})

answersRouter.post('/:questionId', authorizeRequest, validateAnswerBody, async (req, res, next) => {
    const author = req.credentials.username;
    const questionId = req.params.questionId;
    [ questionData, questionError ] = await resolver(questions.getQuestionById(req.params.questionId));
    if (!questionData[0]) {
        res.status(404).json({error: 'question attempted to answer does not exist'});
        return;
    }
    if (questionError) {
        next(questionError);
        return;
    }
    [ answerData, answerError ] = await resolver(answers.answerQuestion(author, req.body.answerBody, questionId));
    if (answerError) {
        next(answerError);
        return;
    }
    res.json({message: 'answer submitted'});
    return;
});

module.exports = answersRouter;