const app = require('./app.js');
const supertest  =require('supertest');
const users = require('./database/users.js');
const questions = require('./database/questions.js');
const answers = require('./database/answers.js');

beforeAll(async () => await users.destroy());
beforeAll(async () => await questions.destroy());
beforeAll(async () => await answers.destroy());

test('make sure tests are working', () => {
    expect(true).toBe(true);
});

describe('test all auth routes', () => {
    describe('test the /sign-up route', () => {
        const signupTest = async (body, expectedResponse) => {
            const response = await supertest(app)
                .post('/api/auth/sign-up')
                .send(body)
                .set('Accept', 'application/json');
            expect(response.body).toEqual(expectedResponse);
        }
        test('should create a user given valid sign up details', () => signupTest(
            {
                username: 'tester', 
                password: 'ThisIsV@l1d', 
                bio: 'just a humble test profile, don\'t mind me', 
                title: 'god-emperor of testand'
            },
            {
                message: "profile created!"
            }
        ))
        test('should not create a user with a password that does not meet security standards', () => signupTest(
            {
                username: "potatoFarmer",
                password: "doesnotmeetspecs", 
                bio: "farms potatoes", 
                title: "madame ambassador to ireland"
            },
            {
                error: 'password must be at least 8 letters long and contain an uppercase letter, a lowercase letter, a number, and a symbol'
            }
        ));
        test('should not create a user with a password longer than 40 characters', () => signupTest(
            {
                username: "potatoFarmer", 
                password: "thispassworddoesnotmeetspecsImeancomeonl00kh0w#$%(inglongitis", 
                bio: "farms potatoes", 
                title: "madame ambassador to ireland"
            },
            {
                error: 'password can be no longer than 40 characters'
            }
        ));
        test('should not create a user with a password that is the same as their username', () => signupTest(
            {
                username: "potatoFarmer1!", 
                password: "potatoFarmer1!", 
                bio: "farms potatoes", 
                title: "madame ambassador to ireland"
            },
            {
                error: 'username and password can not match'
            }
        ))
        test('should not create a user with username longer than 40 characters', () => signupTest(
            {
                username: "potatoFarmerButLookHowLongMyF$%^&ingUsernameIsImeanReally", 
                password: "potatoFarmer", 
                bio: "farms potatoes", 
                title: "madame ambassador to ireland"
            },
            {
                error: 'username can be no more than 40 characters long'
            }
        ))
        test('should not create a user that already exists', () => signupTest(
            {
                username: 'tester', 
                password: 'ThisIsV@l1d', 
                bio: 'just a humble test profile, don\'t mind me', 
                title: 'god-emperor of testand'
            },
            {
                error: 'username already taken'
            }
        ));
        test('should not create a user with a title over 60 characters', () => signupTest(
            {
                username: "potatoFarmer",
                password: "potatoFarmer1!",
                bio: "farms potatoes",
                title: "madame ambassador to the grand empire of ireland, the netherlands, and north korea"
            },
            {
                error: 'title may not exceed 60 characters'
            }
        ))
        test('should not create a user with a bio over 300 characters', () => signupTest(
            {
                username: 'testerator',
                password: 'ThisIsV@l1d', 
                bio: 'Hello, I am a software engineer from the united states. I am posting here to assist those trying to get into my trade. I hope to be as welcoming as possible. once I have a large number of tech savvy followers, I shall craft them into an army. Then THEY shall pay. anyways, the intention of this bio is to be too long.', 
                title: 'god-emperor of testand'
            },
            {
                error: 'bio may not exceed 300 characters'
            }
        ))
    })
    describe('test the /sign-in route', () => {
        const signInTest = async (body, expectedResponse) => {
            const response = await supertest(app)
                .post('/api/auth/sign-in')
                .send(body)
                .set('Accept', 'application/json')
            expect(response.body).toEqual(expectedResponse);
        }
        test('should log in when given valid credentials', () => signInTest(
            {
                username: 'tester',
                password: 'ThisIsV@l1d'
            },
            {
                message: 'log in success'
            }
        ));
        test('should not log in when username does not exist', () => signInTest(
            {
                username: 'notTester',
                password: 'notEvenValid'
            },
            {
                error: 'username not found'
            }
        ));
        test('should not log in with valid username but incorrect password', () => signInTest(
            {
                username: 'tester',
                password: 'invalidAndAlsoWring'
            },
            {
                error: 'password and username do not match'
            }
        ));
    })
});

