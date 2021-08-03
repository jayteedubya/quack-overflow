require('dotenv').config();
const users = require('../../database/users.js');
const jwt = require('jsonwebtoken');
const { resolver } = require('../../utilities/utilities.js');

const authRouter = require('express').Router();

authRouter.post('/sign-in', async (req, res, next) => {
    const { username, password } = req.body;
    const query = users.getUserCredentials(username);
    [storedCredentials, error] = await resolver(query);
    if (storedCredentials.password === password) {
        const token = jwt.sign(username ,process.env.TOKEN_SECRET, {expiresIn: '5m'})
        req.session.token = token
    }
})

module.exports = authRouter;