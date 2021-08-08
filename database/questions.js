const Queryer = require('./queryer');

class Questions extends Queryer {
    constructor() {
        super('questions', ['author', 'title', 'body', 'views', 'topic']);
    }
    /**
     * gets a page of posts (25 posts per page) organized by time
     * @param {number} page | for posts 26 - 50, input 2
     * @returns an array of question objects
     */
    getNextPageByTime(page) {
        return this.chunkedQuery(['id', 'title', 'time', 'topic', 'views'], page * 25, 25, 'time');
    }
    /**
     * adds a new question ot the database
     * @param {string} author 
     * @param {string} body 
     * @param {string} topic 
     * @returns on object containing the id of the post
     */
    submitAQuestion(author, title, body, topic) {
        return this.addRowReturning([author, title, body, 0, topic]);
    }
    /**
     * edits a question at the given id
     * @param {string} body 
     * @param {number} id 
     * @returns nothing
     */
    editQuestion(body, id) {
        return this.updateRow('body', body, 'id', id);
    }
    /**
     * removes a question from the database
     * @param {number} id 
     * @returns nothing
     */
    deleteQuestion(id) {
        return this.deleteRow('id', id);
    }
    /**
     * retrieves all questions from the database with the specified username
     * @param {string} username 
     * @returns an array of question objects
     */
    getAllQuestionsByUser(username) {
        return this.getColumnFromAttribute('*', 'author', username)
    }
    /**
     * retrieves all questions from the database with the specified topic
     * @param {string} topic 
     * @returns an array of question objects
     */
    getAllQuestionsInTopic(topic) {
        return this.getColumnFromAttribute('*', 'topic', topic);
    }

}

const questions = new Questions();

module.exports = questions;

