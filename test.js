const app = require('./app.js');
const supertest = require('supertest');
const users = require('./database/users.js');
const questions = require('./database/questions.js');
const answers = require('./database/answers.js');

beforeAll(async () => await users.destroy());
beforeAll(async () => await questions.destroy());
beforeAll(async () => await answers.destroy());

test('make sure tests are working', () => {
    expect(true).toBe(true);
});

const extractCookie = (response) => {
    const cookieDough = response.header['set-cookie']; //causes it is a raw cookie, ha ha!
    const sessArray = cookieDough[0].split(';');
    const sessSigArray = cookieDough[1].split(';')
    const cookieArray = [sessArray[0], sessSigArray[0]];
    const cookie = cookieArray.join(';');
    return cookie
}

const getCredentials = async (username='tester', password='ThisIsV@l1d') => {
    const authResponse = await supertest(app)
            .post('/api/auth/sign-in')
            .send({username, password })
            .set('Accept', 'application/json');
        const credentials = extractCookie(authResponse);
        return credentials;
}

const signupTest = async (body, expectedResponse) => {
    const response = await supertest(app)
        .post('/api/auth/sign-up')
        .send(body)
        .set('Accept', 'application/json');
    expect(response.body).toEqual(expectedResponse);
}

const createTestPost = async (body) => {
    const credentials = await getCredentials()
    const response = await supertest(app)
        .post('/api/questions/new')
        .send(body)
        .set('Cookie', credentials)
        .set('Accept', 'application/json')
    return response;
}

describe('test all auth routes', () => {
    describe('test the /sign-up route', () => {
        test('should create a user given valid sign up details', () => signupTest(
            {
                username: 'tester', 
                password: 'ThisIsV@l1d', 
                bio: 'just a humble test profile, don\'t mind me', 
                title: 'god-emperor of testland'
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
                password: 'invalidAndAlsoWrong'
            },
            {
                error: 'password and username do not match'
            }
        ));
    })
    describe('test the /sign-out route', () => {
        test('should sign out when user logged in.', async () => {
            const credentials = await getCredentials();
            const testResponse = await supertest(app)
                .post('/api/auth/sign-out')
                .set('Cookie', credentials)
                .set('Accept', 'application/json');
            expect(testResponse.body).toStrictEqual({message: 'signed out!'});
    })})
    describe('test the token refresh route', () => {
        test('should return a different token than that submitted', async () => {
                const credentials = await getCredentials();
                const response = await supertest(app)
                    .get('/api/auth/refresh-token')
                    .set('Cookie', credentials)
                    .set('Accept', 'application/json');
                expect(extractCookie(response)).not.toBe(credentials);
                expect(extractCookie(response)).toBeDefined()
                expect(response.body).toStrictEqual({message: 'token refreshed!'});
        });
        test('it should not issue a token if the user is not logged in', async () => {
            const response = await supertest(app).get('/api/auth/refresh-token');
            expect(response.body).not.toStrictEqual({message: 'token refreshed!'});
            expect(response.body).toStrictEqual({error: 'please sign in to do this'});
        });
    });
    describe('test the delete account route', () => {
        signupTest(
            {
                username: "thisMeetsCriteria",
                password: "Va1idP@ssword",
                bio: "Hi there, I meet the criteria for a new profile.",
                title: "criteria met"
            },
            {
                message: "profile created!"
            }
        );
        test('should not delete an account when not logged in', async () => {
            const response = await supertest(app)
                .delete('/api/auth/delete-user/thisMeetsCriteria')
                .set('Accept', 'application/json');
            expect(response.body).toStrictEqual({error: 'please sign in to do this'})
        });
        test('should not delete a profile other than its own', async () => {
            const credentials = await getCredentials();
            const response = await supertest(app)
                .delete('/api/auth/delete-user/thisMeetsCriteria')
                .set('Cookie', credentials)
                .set('Accept', 'application/json');
            expect(response.body).toStrictEqual({error: 'you do not have permission to delete this persons profile!'});
        });
        test('should delete a profile when the user being deleted is logged in and making the request', async () => {
            const credentials = await getCredentials('thisMeetsCriteria', 'Va1idP@ssword');
            const response = await supertest(app)
                .delete('/api/auth/delete-user/thisMeetsCriteria')
                .set('Cookie', credentials)
                .set('Accept', 'application/json');
            expect(response.body).toStrictEqual({message: 'user successfully deleted!'})
        })
    })
});

describe('test all users routes', () => {
    describe('test the /:username route', () => {
        test('should get an object containing a valid users public data', async () => {
            const response = await supertest(app)
                .get('/api/users/tester')
                .set('Accept', 'application/json')
            expect(response.body).toStrictEqual({
                username: 'tester', 
                bio: 'just a humble test profile, don\'t mind me', 
                title: 'god-emperor of testland'
            });
        });
        test('should return an error if an invalid username is provided', async () => {
            const response = await supertest(app)
                .get('/api/users/notValid')
                .set('Accept', 'application/json')
            expect(response.body).toStrictEqual({error: "profile not found"})
        });
    });
    describe('test the /:username/questions route', () => {
        test('should get an array of all question the user has asked', async () => {
            await createTestPost({questionBody: 'this is a test question!!!!', title: 'questionable', topic: "tests"});
            const response = await supertest(app)
                .get('/api/users/tester/questions')
                .set('Accept', 'application/json')
            expect(response.body[0].id).toStrictEqual(1);
            expect(response.body[0].title).toBe('questionable');
            expect(response.body[0].topic).toBe('tests');
        });
        test('should not crash when asked for a user that doesn\'t exist', async () => {
            const response = await supertest(app)
                .get('/api/users/notRealMan/questions')
                .set('Accept', 'application/json');
            expect(response.body).toStrictEqual({message: "this user has no posts or does not exist"});
        })
    });
    describe('test the /:username/answers route', () => {

    });
    describe('test the /:username/bio/ route (PUT)', () => {

    });
    describe('test the /:username/title route (PUT)', () => {

    });
});

describe('test all the questions routes', () => {
    describe('test the / questions route', () => {

    })
    describe('test the questions/:id route (GET)', () => {

    })
    describe('test the questions/:id route (PUT)', () => {

    })
    describe('test the questions/:id route (DELETE)', () => {

    })
    describe('test the /question/new route (POST)', () => {

    })
})

describe('test all the answers routes', () => {

})

