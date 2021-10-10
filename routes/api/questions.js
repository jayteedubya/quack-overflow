const questionsRouter = require('express').Router();
const questions = require('../../database/questions.js');
const answers = require('../../database/answers.js');
const { authorizeRequest, verifyPostPermissions, validateQuestionBody, validateQuestionEdit } = require('../../utilities/middleware');
const { resolver } = require('../../utilities/utilities.js');

questionsRouter.get('/', async (req, res, next) => {
    const pageNumber = req.query.page ? req.query.page : 0;
    [ page, error ] = await resolver(questions.getNextPageByTime(Number(pageNumber)))
    if (error) {
        next(error);
        return;
    }
    if (!page[0]) {
        res.status(404).json({error: 'last page reached'});
        return;
    }
    res.json(page);
    return;
});

questionsRouter.get('/top', async (req, res, next) => {
    const pageNumber = req.query.page ? req.query.page : 0;
    [ page, error ] = await resolver(questions.getNextPageByViews(Number(pageNumber)))
    if (error) {
        next(error);
        return;
    }
    if (!page[0]) {
        res.status(404).json({error: 'last page reached'});
        return;
    }
    res.json(page);
    return;
});

questionsRouter.get('/topics', async (req, res, next) => {
    [ topics, error ] = await resolver(questions.getAllTopics());
    if (error) {
        next(error);
        return;
    }
    res.json(topics);
    return;
})

questionsRouter.get('/topics/:topic', async (req, res, next) => {
    var pageNumber = req.query.page ? req.query.page : 0;
    [ page, error ] = await resolver(questions.getQuestionsInTopicByPage(req.params.topic, pageNumber));
    if (error) {
        next(error);
        return;
    }
    if (!page[0]) {
        res.status(404).json({error: 'last page reached'});
        return;
    }
    res.json(page);
    return;
})



questionsRouter.post('/new', authorizeRequest, validateQuestionBody, async (req, res, next) => {
    let { questionBody, title, topic } = req.body;
    topic = topic.split(" ").join("_")
    const author = req.credentials.username;
    [ id, error ] = await resolver(questions.submitAQuestion(author, title, questionBody, topic));
    if (error) {
        next(error);
        return;
    }
    res.status(200).json({ id });
    return;
});

questionsRouter.get('/question/:id', async (req, res, next) => {
    const id = Number(req.params.id);
    [ question, questionError ] = await resolver(questions.getQuestionById(id));
    [ answerArray, answerError] = await resolver(answers.getAnswersForQuestion(id));
    [ result, viewError ] = await resolver(questions.incrementViews(id));
    if (questionError) {
        next({ questionError });
        return;
    }
    if (answerError) {
        next({ answerError });
        return;
    }
    if (viewError) {
        next({ viewError });
        return;
    }
    if (!question[0]) {
        res.status(404).json({error: 'post could not be found!'});
        return;
    }
    const fullQuestion = {};
    fullQuestion.question = question[0];
    fullQuestion.answers = answerArray;
    res.json(fullQuestion);
    return;
});

questionsRouter.put('/question/:id', authorizeRequest, verifyPostPermissions, validateQuestionEdit, async (req, res, next) => {
    const questionBody = req.body.questionBody;
    const id = req.params.id;
    [ data, error ] = await resolver(questions.editQuestion(questionBody, id));
    if (error) {
        next(error);
        return;
    }
    res.json({message: 'successful edit!'});
    return;
});

questionsRouter.delete('/question/:id', authorizeRequest, verifyPostPermissions, async (req, res, next) => {
    [ data, error ] = await resolver(questions.deleteQuestion(req.params.id));
    if (error) {
        console.log(error);
        next(error);
        return;
    }
    res.json({message: "post deleted!"});
    return;
});


module.exports = questionsRouter;