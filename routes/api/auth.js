require('dotenv').config();
const users = require('../../database/users.js');
const jwt = require('jsonwebtoken');
const { isStrongPassword, isLength } = require('validator');
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

    console.log(username, password);
    console.log(storedCredentials)
    
    if (storedCredentials[0].password === password) {
        const token = jwt.sign({ username } ,process.env.TOKEN_SECRET, {expiresIn: "1h"});
        req.session.token = token;
        res.json({message: 'log in success'});
        return;
    }

    res.status(401).json({error: 'password and username do not match'});
    return;
});

authRouter.post('/sign-up', async (req, res, next) => {
    const { username, password, bio, title } = req.body;
    const validation = validateNewProfile(req.body);
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
    [ value, error ] = await resolver(users.createNewUser(username, password, token, bio, title));
    req.session.token = token
    if (error) {
        next(error);
        return;
    }
    res.sendStatus(201);
    return;
})

module.exports = authRouter;