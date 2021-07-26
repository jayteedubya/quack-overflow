const Queryer = require('./queryer');

class Questions extends Queryer {
    constructor() {
        super('questions', ['author', 'body', 'views', 'topic']);
    }
    getAllQuestionsByTime() {
        
    }
}