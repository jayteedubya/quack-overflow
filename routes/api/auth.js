
const users = require('../../database/users.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { authorizeRequest, validateNewProfileBody, validateBio, validatePassword, validateUsername, validateTitle } = require('../../utilities/middleware');
const { resolver } = require('../../utilities/utilities.js');

const authRouter = require('express').Router();

authRouter.post('/sign-in', async (req, res, next) => {
    const { username, password } = req.body;
    const query = users.getUserCredentials(username);
    [ storedCredentials, dbError ] = await resolver(query);
    if (dbError) {
        next(dbError);
        return;
    }
    if (!storedCredentials[0]) {
        res.status(400).json({error: 'username not found'});
        return;
    }
    if (!bcrypt.compareSync(password, storedCredentials[0].password)) {
        res.status(401).json({error: 'password and username do not match'});
        return;
    }
    const token = jwt.sign({ username } ,process.env.TOKEN_SECRET, {expiresIn: "1h"});
    [ result, tokenError ] = await resolver(users.updateUserToken(username, token));
    if (tokenError) {
        next(tokenError);
        return;
    }
    req.session.token = token;
    res.json({message: 'log in success'});
    
});

authRouter.post('/sign-up', validateNewProfileBody, validateUsername,  validatePassword, validateBio, validateTitle,  async (req, res, next) => {
    const { username, password, bio, title } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const token = jwt.sign({ username }, process.env.TOKEN_SECRET, {expiresIn: '1h'});
    [ value, error ] = await resolver(users.createNewUser(username, hashedPassword, token, bio, title));
    req.session.token = token
    if (error) {
        next(error);
        return;
    }
    res.status(201).json({message: 'profile created!'});
    return;
});

authRouter.get('/test', authorizeRequest, (req, res, next) => {
    const token = req.session.token;
    const username = req.credentials.username;
    res.json({ token, username });
});

authRouter.delete('/delete-user/:username', authorizeRequest, (req, res, next) => {
    const { username } = req.credentials;
    if (req.params.username !== username) {
        res.status(403).json({ error: 'you do not have permission to delete this persons profile!'})
    }
    users.deleteUser(username);
    res.status(200).json({message: 'user successfully deleted!'});
})

module.exports = authRouter;