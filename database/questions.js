const Queryer = require('./queryer');

class Questions extends Queryer {
    constructor() {
        super('questions', ['author', 'body', 'views', 'topic']);
    }
    /**
     * gets a page of posts (25 posts per page) 
     * @param {number} page | for posts 26 - 50, input 2
     * @returns an array of question objects
     */
    getNextQuestions(page) {
        return this.chunkedQuery('*', page * 25, 25);
    }
    /**
     * adds a new question ot the database
     * @param {string} author 
     * @param {string} body 
     * @param {string} topic 
     * @returns nothing
     */
    submitAQuestion(author, body, topic) {
        return this.addRow([author, body, 0, topic]);
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

