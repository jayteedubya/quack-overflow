const { db } = require('./connect.js');

const buildUsersTable = () => {
    const query = '\
    CREATE TABLE users(\
        id SERIAL PRIMARY key,\
        username VARCHAR(40) UNIQUE NOT NULL,\
        password TEXT NOT NULL,\
        bio VARCHAR(300) NOT NULL,\
        title VARCHAR(60),\
        token TEXT UNIQUE,\
        twoFA_secret TEXT UNIQUE\
    );';
    return db.none(query);
}

const buildQuestionsTable = () => {
    const query = '\
    CREATE TABLE questions(\
        id SERIAL PRIMARY KEY,\
        title VARCHAR(80),\
        author VARCHAR(40) NOT NULL REFERENCES users(username),\
        body VARCHAR(1000),\
        views INTEGER,\
        topic VARCHAR(60),\
        time TIMESTAMPTZ DEFAULT NOW()\
    );';
    return db.none(query);
}

const buildAnswersTable = () => {
    const query = '\
    CREATE TABLE answers(\
        id SERIAL PRIMARY KEY,\
        author VARCHAR(40) NOT NULL REFERENCES users(username),\
        pob_count INTEGER DEFAULT 0,\
        body VARCHAR(600),\
        question_id INT REFERENCES questions(id),\
        time TIMESTAMPTZ DEFAULT NOW()\
    );';
    return db.none(query);
}

const initialize = async () => {
    await buildUsersTable();
    await buildQuestionsTable();
    await buildAnswersTable();
    return 'done';
}

initialize().then(res => console.log(res));