const users = require('../../database/users.js');
const questions = require('../../database/questions.js');
const answers = require('../../database/answers.js');
const { resolver } = require('../../utilities/utilities.js')

const usersRouter = require('express').Router();

usersRouter.get('/:username', async (req, res, next) => {
    const userQuery = users.getUserPublic(req.params.username);
    [userData, error] = await resolver(userQuery);
    res.json(userData);
    next(error);
    return;
});

module.exports = usersRouter;
