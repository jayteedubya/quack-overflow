
const index = require('express').Router();
const { join } = require('path')

index.get('/', (req, res, next) => {
    res.sendFile(join(__dirname, 'build', 'index.html'));
});

module.exports = index;