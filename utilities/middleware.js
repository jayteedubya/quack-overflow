const jwt = require('jsonwebtoken');
const users = require('../database/users');
const { resolver, tryHandler } = require('./utilities');

const authorizeRequest = async (req, res, next) => {
    const token = req.session.token;
    [ username, jwtError ] = tryHandler(() => jwt.verify(token, process.env.TOKEN_SECRET).username);
    [ storedToken, tokenError ] = await resolver(users.getUserToken(username));
    if (tokenError) {
        next(tokenError);
        return;
    }
    if (jwtError) {
        next(jwtError);
        return;
    }
    if (storedToken[0].token !== token) {
        res.status(403).json({error: 'token does not match!'});
        return;
    }
    req.credentials = {};
    req.credentials.username = username;
    req.credentials.token = token;
    next()
    return;
}

module.exports = { authorizeRequest }