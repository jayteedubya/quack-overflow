const users = require('./api/users');
const auth = require('./api/auth');

const apiRouter = require('express').Router()

apiRouter.use('/users', users);
apiRouter.use('/auth', auth)

apiRouter.use((error, req, res, next) => {
    if (error) {
        console.error(error);
        res.status(500).json({ error });
    }
    next()
})

module.exports = apiRouter;