const users = require('../../database/users.js');
const questions = require('../../database/questions.js');
const answers = require('../../database/answers.js');
const { resolver } = require('../../utilities/utilities.js');
const { authorizeRequest, verifyUserPermissions, validateBio, validateTitle } = require('../../utilities/middleware.js')

const usersRouter = require('express').Router();

usersRouter.get('/:username', async (req, res, next) => {
    const query = users.getUserPublic(req.params.username);
    [ userData, error ] = await resolver(query);
    if (error) {
        next(error);
        return;
    }
    if (!userData[0]) {
        res.status(404).json({error: "profile not found"});
        return;
    }
    res.json(userData[0]);
    return;
});

usersRouter.get('/:username/questions', async (req, res, next) => {
    const query = questions.getAllQuestionsByUser(req.params.username);
    [ userQuestions, error ] = await resolver(query);
    if (error) {
        next(error);
        return;
    }
    if (userQuestions.length < 1) {
        res.status(404).json({message: "this user has no posts or does not exist"});
        return;
    }
    res.json(userQuestions);
    return;
});

usersRouter.get('/:username/answers', async (req, res, next) => {
    const query = answers.getAllAnswersByUser(req.params.username);
    [ userAnswers, error ] = await resolver(query);
    if (error) {
        next(error);
    }
    res.json(userAnswers);
})

usersRouter.put('/:username/title', authorizeRequest, verifyUserPermissions, validateTitle, async (req, res, next) => {
    const title = req.body.title;
    const username = req.credentials.username;
    users.editUserTitle(username, title);
    res.sendStatus(201);
})

usersRouter.put('/:username/bio', authorizeRequest, verifyUserPermissions, validateBio, async (req, res, next) => {
    const bio = req.body.bio;
    const username = req.credentials.username
    users.editUserBio(username, bio)
})

module.exports = usersRouter;
