const users = require('./api/users');
const auth = require('./api/auth');
const questions = require('./api/questions');
const answers = require('./api/answers');

const apiRouter = require('express').Router()

apiRouter.use('/users', users);
apiRouter.use('/auth', auth);
apiRouter.use('/questions', questions);
apiRouter.use('/answers', answers);

apiRouter.use((err, req, res, next) => {
    if (err) {
        const error = {error: err, url: req.url, method: req.method}
        console.log(error)
        res.status(500).json(error);
        return;
    }
    next();
    return;
})

module.exports = apiRouter;