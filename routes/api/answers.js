const answersRouter = require('express').Router();
const answers = require('../../database/answers');
const { resolver } = require('../../utilities/utilities');
const { authorizeRequest, validateAnswerBody, verifyAnswerPermissions } = require('../../utilities/middleware');
const users = require('../../database/users');

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

answersRouter.delete('/answer/:answerId', authorizeRequest, verifyAnswerPermissions, async (req, res, next) => {
    const id = req.params.answerId;
    [ data, error ] = await resolver(answers.deleteAnswer(id));
    if (error) {
        next(error);
        return;
    }
    res.json({message: 'answer deleted'});
    return;
});

answersRouter.put('/answer/:answerId/POB', authorizeRequest, async (req, res, next) => {
    const id = req.params.id;
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
    if (currentPOBs.indexOf(id) !== -1) {
        res.status(400).json({error: 'user has already patted post in the back!'});
        return;
    }
    [ userData, userError ] = await resolver(users.pobAnswer(id));
    [ data, error ] = await resolver(answers.patAnswerOnTheBack(id));
    if (error) {
        next(error);
        return;
    }
    if (userError) {
        next(userError)
        return;
    }
    res.json({message: 'post successfully POB\'d'});
    return;
})

module.exports = answersRouter;