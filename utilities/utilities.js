const { isStrongPassword, isLength } = require('validator')

/**
 * cleanly resolves a promise, to be consumed with array destructuring
 * @param {promise} promise 
 * @returns an array containing either an error or the value of the resolved promise
 */
const resolver = async (promise) => {
    try {
        const data = await promise;
        return [data, null]
    }
    catch (err) {
        console.error(err);
        return [null, err]
    }
}

const validateNewProfile = (body) => {
    const {username, password, bio, title} = body
    if (!bio || !title || !username || !password) {
        return {error: 'incomplete sign up data'}
    }
    if (!isStrongPassword(password)) {
        return {error: 'password must be at least 8 letters long and contain an uppercase letter, a lowercase letter, a number, and a symbol'};
    }
    if (!isLength(username, {min: 1, max: 40})) {
        return {error: 'username can be no more than 40 characters long'};
    }
    if (!isLength(password, {max: 40})) {
        return {error: 'password can be no longer than 40 characters'};
    }
    if (username === password) {
        return {error: 'username and password can not match'};
    }
    if (!isLength(bio, {min: 1, max: 300})) {
        return {error: 'bio may not exceed 300 characters'};
    }
    if (!isLength(title, {min: 1, max: 60})) {
        return {error: 'title may not exceed 60 characters'}
    }
    return {message: 'all fields valid'}
}


module.exports = { resolver, validateNewProfile };