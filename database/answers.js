const Queryer = require('./queryer.js');

class Answers extends Queryer {
    constructor() {
        super('answers', ['author', 'body', 'question_id'])
    }
    
}