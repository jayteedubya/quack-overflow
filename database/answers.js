const Queryer = require('./queryer.js');

class Answers extends Queryer {
    constructor() {
        super('answers', ['author', 'body', 'question_id'])
    }
    /**
     * gets all answers associated with the given question id
     * @param {number} question_id 
     * @returns an array of all answers on a specific question
     */
    getAnswersForQuestion(question_id) {
        return this.getColumnFromAttribute('*', 'question_id', question_id);
    }
    /**
     * increments the pob_count by one
     * @param {number} id 
     * @returns nothing
     */
    patAnswerOnTheBack(id) {
        return this.incrementValue('pob_count', 1, 'id', id);
    }
    /**
     * decrements the pob_count by one
     * @param {number} id 
     * @returns nothing
     */
    unPatAnswerOnTheBack(id) {
        return this.decrementValue('pob_count', 1, 'id', id);
    }
    /**
     * gets the total number of pobs a user has
     * @param {string} username 
     * @returns an object containing the sum of all pobs a user has
     */
    getTotalPOBbyUser(author) {
        return this.getAggregate('SUM', 'pob_count', 'author', author)
    }
    /**
     * adds a new answer to the question identified
     * @param {string} author 
     * @param {string} body 
     * @param {number} question_id 
     */
    answerQuestion(author, body, question_id ) {
        return this.addRow([author, body, question_id]);
    }
    /**
     * deletes the answer with the specified id
     * @param {number} id 
     * @returns nothing
     */
    deleteAnswer(id) {
        return this.deleteRow('id', id)
    }
    /**
     * replaces the body of the answer with the specified new body
     * @param {number} id 
     * @param {string} body 
     * @returns nothing
     */
    editAnswer(id, body) {
        return this.updateRow('body', body, 'id', id);
    }
    /**
     * gets all answers given by the specified user
     * @param {string} username 
     * @returns an array of answers
     */
    getAllAnswersByUser(username) {
        return this.getColumnFromAttribute('*', 'author', username);
    }
    /**
     * gets the author of the answer
     * @param {number} id 
     * @returns an array containing an object with propery author
     */
    getAuthorById(id) {
        return this.getColumnFromAttribute('author', 'id', id);
    }
}

const answers = new Answers();

module.exports = answers;
