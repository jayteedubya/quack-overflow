const questionsRouter = require('express').Router();
const questions = require('../../database/questions.js');
const answers = require('../../database/answers.js');
const { authorizeRequest, verifyPostPermissions, validateQuestionBody } = require('../../utilities/middleware');
const { resolver } = require('../../utilities/utilities.js');

questionsRouter.get('/', async (req, res, next) => {
    let pageNumber = 1
    if (req.query.page) {
        pageNumber = req.query.page;
    }
    const page = resolver(questions.getNextPageByTime(pageNumber))
    if (!page[0]) {
        res.status(404).json({error: 'last page reached'});
        return;
    }
    res.json(page);
    return;
});

questionsRouter.post('/new', authorizeRequest, validateQuestionBody, async (req, res, next) => {
    const { questionBody, title, topic } = req.body;
    const author = req.credentials.username;
    [ id, error ] = await resolver(questions.submitAQuestion(author, title, questionBody, topic));
    if (error) {
        next(error);
        return;
    }
    res.status(200).json({ id });
});

questionsRouter.get('/question/:id', async (req, res, next) => {
    const id = req.params.id;
    [ question, questionError ] = await resolver(questions.getQuestionById(id));
    [ answers, answerError] = await resolver(answers.getAnswersForQuestion(id));
    [ result, viewError ] = await resolver(questions.incrementViews(id));
    if (questionError) {
        next(questionError);
        return;
    }
    if (answerError) {
        next(answerError);
        return;
    }
    if (viewError) {
        next(viewError);
        return;
    }
    if (!question) {
        res.status(404).json({error: 'post could not be found!'});
        return;
    }
    const fullQuestion = {}
    fullQuestion.question = question[0];
    fullQuestion.answers = answers;
    res.json(fullQuestion);
    return;
});

questionsRouter.put('/question/:id', verifyPostPermissions, validateQuestionBody, async (req, res, next) => {
    const questionBody = req.body.questionBody;
    const id = req.params.id
    [ data, error ] = await resolver(questions.editQuestion(questionBody, id));
    if (error) {
        next(error);
        return;
    }
    res.json({message: 'successful edit!'});
    return;
});

questionsRouter.delete('question/:id', verifyPostPermissions, async (req, res, next) => {
    const id = req.params.id
    [ data, error ] = await resolver(questions.deleteQuestion(questionBody, id));
    if (error) {
        next(error);
        return;
    }
    res.json({message: "post deleted!"});
    return;
});

module.exports = questionsRouter;