const Queryer = require('./queryer');

class Users extends Queryer {
    constructor() {
        super('users', ['username', 'password', 'token', 'twofa_secret']);
    }
    /**
     * 
     * @param {string} username 
     * @returns a promise containing the users username and password
     */
    getUserCredentials(username) {
        return this.getColumnFromAttribute(['username', 'password'], username);
    }
    /**
     * 
     * @param {string} username 
     * @returns the users web token
     */
    getUserToken(username) {
        return this.getColumnFromAttribute('token', username);
    }
    /**
     * 
     * @param {string} username 
     * @returns the users id
     */
    getIdFromUsername(username) {
        return this.getColumnFromAttribute('id', 'username', username);
    }
}
module.exports = new Users();