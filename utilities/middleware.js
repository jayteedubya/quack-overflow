const jwt = require('jsonwebtoken');
const users = require('../database/users');
const questions = require('../database/questions');
const answers = require('../database/answers');
const { resolver, tryWrapper } = require('./utilities');
const { isStrongPassword, isLength } = require('validator');

/**
 * safely extracts the submitted token from the request object
 * @param {object} req 
 * @returns the token or null
 */
const getRequestToken = (req) => {
    if (req.session) {
        return req.session.token
    }
    return null
}

/**
 * safely retrieves a users stored token from the database
 * @param {string} username 
 * @returns 
 */
const getStoredToken = async (username) => {
    [ queryResult, error ] = await resolver(users.getUserToken(username));
    if (!queryResult[0]) {
        return null
    }
    if (error) {
        console.error(error);
        return null
    }
    return queryResult[0].token;
}

/**
 * safely retrieves a username from the provided token
 * @param {string} token 
 * @returns the username stored in the token or null
 */
const extractUsernameFromToken = (token) => {
    [ data, error ] = tryWrapper(jwt.verify, [token, process.env.TOKEN_SECRET]);
    if (error) {
        console.error(error);
        return null
    }
    return data.username
}

/**
 * authorizes an incoming request and attaches the username to the request, or responds with an error if credentials are not present
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 * @returns null
 */
const authorizeRequest = async (req, res, next) => {
    const submittedToken = getRequestToken(req);
    if (!submittedToken) {
        res.status(401).json({error: 'please sign in to do this'});
        return;
    }
    const decodedUsername = extractUsernameFromToken(submittedToken);
    if (!decodedUsername) {
        res.status(500).json({error: 'credentials could not be verified'});
        return;
    }
    storedToken = await getStoredToken(decodedUsername);
    if (!storedToken || storedToken !== submittedToken) {
        res.status(401).json({error: 'submitted token could not be verified with database'});
        return;
    }
    req.credentials = {};
    req.credentials.username = decodedUsername;
    req.credentials.token = submittedToken;
    next()
}

/**
 * verifies that the username making the request is the same as the username being accessed
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 * @returns null
 */
const verifyUserPermissions = (req, res, next) => {
    if (req.params.username !== req.credentials.username) {
        res.status(403).json({error: 'you do not have permission to alter this information!'});
        return;
    }
    next();
    return;
}

/**
 * verifies that the user trying to modify a post is the user who made it
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 * @returns null
 */
const verifyPostPermissions = async (req, res, next) => {
    const id = req.params.id;
    [ authorData, error ] = await resolver(questions.getAuthorById(id));
    if (!authorData[0]) {
        res.status(404).json({error: 'post could not be found'});
        return;
    }
    const author = authorData[0].author;
    if (author !== req.credentials.username) {
        res.status(403).json({error: 'you do not have permission to modify this post!'});
        return;
    }
    next();
    return;
}

/**
 * verifies that the user trying to modify the answer is the author of the answer
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 * @returns 
 */
const verifyAnswerPermissions = async (req, res, next) => {
    const id = req.params.id;
    [ authorData, error ] = await resolver(answers.getAuthorById(id));
    if (error) {
        next(error);
        return;
    }
    if (!authorData[0]) {
        res.status(400).json({error: 'answers does not exist!'});
        return;
    }
    const author = authorData[0].author;
    if (author !== req.credentials.username) {
        res.status(403).json({error: 'you do not have permission to modify this post'});
        return;
    }
    next();
    return;
}

/**
 * ensures the submitted question body meets requirements
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 * @returns null
 */
const validateQuestionBody = (req, res, next) => {
    const questionBody = req.body.questionBody;
    if (!isLength(questionBody, {max: 1000})) {
        res.status(400).json({error: 'question body must be between 1 and 1000 characters long'});
        return;
    }
    if(!isLength(req.body.topic, {min: 1, max: 60})) {
        res.status(400).json({error: 'question topic must be between 1 and 60 characters long'});
        return;
    }
    if(!isLength(req.body.title, {min: 1, max: 80})) {
        res.status(400).json({error: 'question title must be between 1 and 80 characters long'});
        return;
    }
    next()
    return;
}

const validateAnswerBody = (req, res, next) => {
    const answerBody = req.body.answerBody;
    if (!isLength(answerBody, {max: 600})) {
        res.status(400).send({error: 'answer body is too long'});
        return;
    }
    next();
    return;
}

/**
 * validates that the provided bio meets requirements
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 * @returns null
 */
const validateBio = (req, res, next) => {
    if (!isLength(req.body.bio, {min: 1, max: 300})) {
        res.json({error: 'bio may not exceed 300 characters'});
        return;
    }
    next();
    return;
}

/**
 * validates that the provided title meets requirements
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 * @returns null
 */
const validateTitle = (req, res, next) => {
    if (!isLength(req.body.title, {min: 1, max: 60})) {
        res.json({error: 'title may not exceed 60 characters'});
        return;
    }
    next()
    return
}

/**
 * validates that the provided username meets requirements
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 * @returns null
 */
const validateUsername = async (req, res, next) => {
    [ id, idError ] = await resolver(users.getIdFromUsername(req.body.username));
    if (id[0]) {
        res.json({error: 'username already taken'});
        return;
    }
    if (!isLength(req.body.username, {min: 1, max: 40})) {
        res.json({error: 'username can be no more than 40 characters long'});
        return;
    }
    next();
    return;
}

/**
 * validates that the provided username meets requirements
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 * @returns null
 */
const validatePassword = (req, res, next) => {
    if (!isStrongPassword(req.body.password)) {
        res.json({error: 'password must be at least 8 letters long and contain an uppercase letter, a lowercase letter, a number, and a symbol'});
        return;
    }
    if (!isLength(req.body.password, {max: 40})) {
        res.json({error: 'password can be no longer than 40 characters'});
        return;
    }
    if (req.body.username === req.body.password) {
        res.json({error: 'username and password can not match'});
        return;
    }
    next();
    return;
}
/**
 * validates that the provided profile body meets requirements
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 * @returns null
 */
const validateNewProfileBody = (req, res, next) => {
    const { username, password, bio, title } = req.body
    if (!bio || !title || !username || !password) {
        res.json({error: 'incomplete sign up data'})
        return;
    }
    next()
    return;
}


module.exports = { 
    authorizeRequest, 
    verifyUserPermissions, 
    verifyPostPermissions,
    verifyAnswerPermissions, 
    validateBio, 
    validateTitle, 
    validatePassword, 
    validateUsername, 
    validateNewProfileBody,
    validateQuestionBody,
    validateAnswerBody
}