const users = require('../../database/users.js');
const questions = require('../../database/questions.js');
const answers = require('../../database/answers.js');
const { resolver } = require('../../utilities/utilities.js')

const usersRouter = require('express').Router();

usersRouter.get('/:username', async (req, res, next) => {
    const query = users.getUserPublic(req.params.username);
    [ userData, error ] = await resolver(query);
    if (error) {
        next(error);
    }
    res.json(userData[0]);
    
});

usersRouter.get('/:username/questions', async (req, res, next) => {
    const query = questions.getAllQuestionsByUser(req.params.username);
    [ userQuestions, error ] = await resolver(query);
    if (error) {
        next(error);
    }
    res.json(userQuestions);
});

usersRouter.get('/:username/answers', async (req, res, next) => {
    const query = answers.getAllAnswersByUser(req.params.username);
    [ userAnswers, error ] = await resolver(query);
    if (error) {
        next(error);
    }
    res.json(userAnswers);
})

module.exports = usersRouter;
