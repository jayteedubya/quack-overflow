const users = require('./api/users');


const apiRouter = require('express').Router()

apiRouter.use('/users', users);

apiRouter.use((error, req, res, next) => {
    if (error) {
        console.error(error);
        res.json({ error });
    }
    next()
})

module.exports = apiRouter;