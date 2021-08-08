const questionsRouter = require('express').Router();
const validator = require('validator')
const questions = require('../../database/questions.js');
const answers = require('../../database/answers.js');
const { resolver, tryWrapper } = require('../../utilities/utilities.js');

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
});

questionsRouter.post('/new', async (req, res, next) => {
    const { questionBody, title, author, topic}
    if (!validator.isLength(questionBody)) {
        res.status(400).send({error: 'post body is too long'});
        return
    }
    [ id, error ] = await resolver(questions.submitAQuestion(author, title, questionBody, topic))
})