const users = require('./api/users');
const auth = require('./api/auth');
const questions = require('./api/questions');
const answers = require('./api/answers');

const apiRouter = require('express').Router()

apiRouter.use('/users', users);
apiRouter.use('/auth', auth);
apiRouter.use('/questions', questions);
apiRouter.use('/answers', answers);

apiRouter.use((error, req, res, next) => {
    if (error) {
        console.error(error);
        res.status(500).json({ error });
    }
    next()
})

module.exports = apiRouter;