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
        return;
    }
    if (userAnswers.length < 1) {
        res.status(404).json({message: "this user has no answers or does not exist"});
        return
    }
    res.json(userAnswers);
    return;
})

usersRouter.put('/:username/title', authorizeRequest, verifyUserPermissions, validateTitle, async (req, res, next) => {
    [ data, error ] = await resolver(users.editUserTitle(req.credentials.username, req.body.title));
    if (error) {
        next(error);
        return;
    }
    res.json({message: 'title edited successfully'});
    return;
})

usersRouter.put('/:username/bio', authorizeRequest, verifyUserPermissions, validateBio, async (req, res, next) => {
    [ data, error ] = await resolver(users.editUserBio(req.credentials.username, req.body.bio));
    if (error) {
        next(error);
        return;
    }
    res.json({message: 'bio edited successfully'});
})

module.exports = usersRouter;
