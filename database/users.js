const Queryer = require('./queryer');

class Users extends Queryer {
    constructor() {
        super('users', ['username', 'password', 'token', 'bio', 'title']);
    }
    /**
     * retrieves a users password and token given a username
     * @param {string} username 
     * @returns a promise containing the users username and password
     */
    getUserCredentials(username) {
        return this.getColumnFromAttribute(['token', 'password'], 'username', username);
    }
    /**
     * returns the users web token to verify it from a second source
     * @param {string} username 
     * @returns the users web token
     */
    getUserToken(username) {
        return this.getColumnFromAttribute('token', 'username', username);
    }
    /**
     * updates the users token in the db
     * @param {string} username 
     * @returns nothing
     */
    updateUserToken(username, token) {
        return this.updateRow('token', token, 'username', username);
    }
    /**
     * returns the id given the username
     * @param {string} username 
     * @returns the users id
     */
    getIdFromUsername(username) {
        return this.getColumnFromAttribute('id', 'username', username);
    }
    /**
     * create a new user
     * @param {string} username 
     * @param {string} password 
     * @param {string} token 
     * @param {string} bio
     * @param {string} title
     * @returns an empty promise
     */
    createNewUser(username, password, token, bio, title) {
        return this.addRow([username, password, token, bio, title]);
    }
    /**
     * changes a users password
     * @param {string} username 
     * @param {string} newPassword 
     * @returns an empty promise
     */
    changeUserPassword(username, newPassword) {
        return this.updateRow('password', newPassword, 'username', username);
    }
    /**
     * deletes a user from the database
     * @param {string} username
     * @returns an empty promise
     */
    deleteUser(username) {
        return this.deleteRow('username', username);
    }
    /**
     * gets a users publicly available information
     * @param {string} username 
     * @returns an object containing a users username, bio, and title
     */
    getUserPublic(username) {
        return this.getColumnFromAttribute(['bio', 'title', 'username'], 'username', username);
    }
    /**
     * edits a users bio, replacing the existing text with that provided
     * @param {string} username 
     * @param {string} bio 
     * @returns nothing
     */
    editUserBio(username, bio) {
        return this.updateRow('bio', bio, 'username', username);
    }
    /**
     * edits a users title, replacing the existing on with that provided
     * @param {string} username 
     * @param {string} title 
     * @returns 
     */
    editUserTitle(username, title) {
        return this.updateRow('title', title, 'username', username);
    }
}

const users = new Users();

module.exports = users