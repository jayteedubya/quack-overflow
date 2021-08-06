
const users = require('../../database/users.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { authorizeRequest } = require('../../utilities/middleware');
const { resolver, validateNewProfile } = require('../../utilities/utilities.js');

const authRouter = require('express').Router();

authRouter.post('/sign-in', async (req, res, next) => {
    const { username, password } = req.body;
    const query = users.getUserCredentials(username);
    [ storedCredentials, error ] = await resolver(query);
    if (error) {
        next(error);
        return;
    }
    if (storedCredentials[0].password === password) {
        const token = jwt.sign({ username } ,process.env.TOKEN_SECRET, {expiresIn: "1h"});
        [result, error] = await resolver(users.updateUserToken(username, token));
        req.session.token = token;
        res.json({message: 'log in success'});
        return;
    }
    if (error) {
        next(error);
        return;
    }
    res.status(401).json({error: 'password and username do not match'});
    return;
});

authRouter.post('/sign-up', async (req, res, next) => {
    const { username, password, bio, title } = req.body;
    const validation = validateNewProfile(req.body);
    const hashedPassword = bcrypt.hashSync(password, 10);
    [ id, idError ] = await resolver(users.getIdFromUsername(username));
    if (validation.error) {
        res.status(400).json(validation);
        return;
    }
    if (id.length > 0) {
        res.status(400).json({error: 'username already taken'});
        return;
    }
    const token = jwt.sign({ username }, process.env.TOKEN_SECRET, {expiresIn: '1h'});
    [ value, error ] = await resolver(users.createNewUser(username, hashedPassword, token, bio, title));
    req.session.token = token
    if (error) {
        next(error);
        return;
    }
    res.sendStatus(201);
    return;
});

authRouter.get('/check-availability', async (req, res, next) => {
    const username = req.body.username;
    [ id, error ] = await resolver(users.getIdFromUsername(username));
    if (id[0]) {
        
        res.json({message: 'username already taken.'});
        return;
    }
    if (error) {
        next(error);
        return;
    }
    res.json({message: 'username available!'});
    return;
})

authRouter.get('/test', authorizeRequest, (req, res, next) => {
    const token = req.session.token;
    const username = req.credentials.username;
    res.json({ token, username });
});

authRouter.delete('/delete-user', (req, res, next) => {
    res.json({message: 'nice try!'})
})

module.exports = authRouter;