const users = require('../../database/users.js');
const questions = require('../../database/questions.js');
const answers = require('../../database/answers.js');
const { resolver } = require('../../utilities/utilities.js')

const usersRouter = require('express').Router();

usersRouter.get('/:username', async (req, res, next) => {
    const query = users.getUserPublic(req.params.username);
    [ userData, error ] = await resolver(query);
    res.json(userData);
    next(error);
});

usersRouter.get('/:username/questions', async (req, res, next) => {
    const query = questions.getAllQuestionsByUser(req.params.username);
    [ userQuestions, error ] = await resolver(query);
    res.json(userQuestions);
    next(error);
});

module.exports = usersRouter;
