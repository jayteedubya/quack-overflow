const Queryer = require('./queryer');

class Users extends Queryer {
    constructor() {
        super('users', ['username', 'password', 'token', 'twofa_secret']);
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
     * @param {string} twofa_secret 
     * @returns an empty promise
     */
    createNewUser(username, password, token, twofa_secret) {
        return this.addRow([username, password, token, twofa_secret]);
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
     * @param {number} id 
     * @returns an empty promise
     */
    deleteUser(id) {
        return this.deleteRow('id', id);
    }
    /**
     * gets a users publicly available information
     * @param {string} username 
     * @returns an object containing a users username, bio, and title
     */
    getUserPublic(username) {
        return this.getColumnFromAttribute(['bio', 'title', 'username'], 'username', username);
    }
    editUserBio(username, bio) {
        return
    }
    editUserTitle(username, title) {
        return
    }
}

const users = new Users();

module.exports = users