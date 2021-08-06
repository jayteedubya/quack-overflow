const app = require('./app.js');
const supertest  =require('supertest');
const users = require('database/users.js');
const questions = require('database/questions.js');
const answers = require('database/answers.js');

beforeAll()
