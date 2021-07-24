const Queryer = require('./queryer');

class Users extends Queryer {
    constructor() {
        super('users', ['username', 'password', 'token', 'twofa_secret']);
    }
    getUserCredentials(username) {
        return this.getColumnFromAttribute(['username', 'password', 'token']);
    }
}

module.exports = new Users();