const db = require('./connect.js');

const buildUsersTable = () => {
    const query = '\
    CREATE TABLE users(\
        id SERIAL PRIMARY key\
        username VARCHAR(40) UNIQUE NOT NULL\
        password VARCHAR(40) NOT NULL\
        token TEXT\
        2FA_secret TEXT\
    );';
    return db.none(query);
}

const buildQuestionsTable = () => {
    const query = '\
    CREATE TABLE questions(\
        id SERIAL PRIMARY KEY\
        author VARCHAR(40) NOT NULL REFERENCES users(username)\
        body VARCHAR(1000)'
}