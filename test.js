const app = require('./app.js');
const supertest = require('supertest');
const users = require('./database/users.js');
const questions = require('./database/questions.js');
const randWords = require('random-words');
const answers = require('./database/answers.js');
const { range } = require('./utilities/utilities.js');


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

const createTestPost = async (body, credentials=null) => {
    if (!credentials) {
        credentials = await getCredentials();
    }
    const response = await supertest(app)
        .post('/api/questions/new')
        .send(body)
        .set('Cookie', credentials)
        .set('Accept', 'application/json')
    return response;
}

const getRandomBody = () => {
    const questionBody = randWords(15).join(' ');
    const title = randWords(4).join(' ');
    const topic = randWords(2).join(' ');
    return { questionBody, title, topic };
}

const createTestAnswer = async (body, questionID) => {
    const credentials = await getCredentials();
    const response = await supertest(app)
        .post(`/api/answers/${questionID}`)
        .send(body)
        .set('Cookie', credentials)
        .set('Accept', 'application/json')
    return response;
}

const generateTestPosts = async () => {
    const credentials = await getCredentials();
    const results = range(5).map(() => createTestPost(getRandomBody(), credentials));
    return Promise.all(results);
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
        test('should get an array of answers the user has submitted', async () => {
            await createTestAnswer({answerBody: 'this is a test answer'}, 1);
            const response = await supertest(app)
                .get('/api/users/tester/answers')
                .set('Accept', 'application/json');
            expect(response.body[0].author).toEqual('tester');
            expect(response.body[0].body).toEqual('this is a test answer');
        })
        test('should not crash when a asked for a user that doesn\'t exist', async () => {
            const response = await supertest(app)
                .get('/api/users/notRealMan/answers')
                .set('Accept', 'application/json');
            expect(response.body).toStrictEqual({message: "this user has no answers or does not exist"})
        })
    });
    describe('test the /:username/bio route (PUT)', () => {
        test('it shouldn\'t edit the bio of a profile when not logged in', async () => {
            const response = await supertest(app)
                .put('/api/users/tester/bio')
                .set('Accept', 'application/json')
                .send({bio: "edited bio"});
            expect(response.body).toStrictEqual({error: 'please sign in to do this'});
        });
        test('it shouldn\'t edit the bio of a profile when requested by a different username than the owner', async () => {
            const result = await signupTest(
                {
                    username: "thisMeetsCriteriaAlso",
                    password: "Va1idP@ssword",
                    bio: "Hi there, I meet the criteria for a new profile.",
                    title: "criteria met"
                },
                {
                    message: "profile created!"
                }
            );
            const credentials = await getCredentials('thisMeetsCriteriaAlso', 'Va1idP@ssword');
            const response = await supertest(app)
                .put('/api/users/tester/bio')
                .send({bio: "edited bio"})
                .set('Cookie', credentials)
                .set('Accept', 'application/json');
            expect(response.body).toStrictEqual({error: 'you do not have permission to alter this information!'})
        }); //28 to go
        test('it should edit the bio when the owner is logged in and requests it', async () => {
            const credentials = await getCredentials();
            const response = await supertest(app)
                .put('/api/users/tester/bio')
                .send({bio: 'edited bio'})
                .set('Cookie', credentials)
                .set('Accept', 'application/json');
            expect(response.body).toStrictEqual({message: 'bio edited successfully'});
        });
        test('it should handle a request made on a user that doesn\'t exist', async () => {
            const credentials = await getCredentials();
            const response = await supertest(app)
                .put('/api/users/testface/bio')
                .send({bio: 'edited bio'})
                .set('Cookie', credentials)
                .set('Accept', 'application/json');
            expect(response.body).toStrictEqual({error: 'you do not have permission to alter this information!'});
        });
    });
    describe('test the /:username/title route (PUT)', () => {
        test('it shouldn\'t edit the title of a profile when not logged in', async () => {
            const response = await supertest(app)
                .put('/api/users/tester/title')
                .set('Accept', 'application/json')
                .send({title: "edited title"});
            expect(response.body).toStrictEqual({error: 'please sign in to do this'});
        });
        test('it shouldn\'t edit the title of a profile when requested by a user other than the owner', async () => {
            const credentials = await getCredentials('thisMeetsCriteriaAlso', 'Va1idP@ssword');
            const response = await supertest(app)
                .put('/api/users/tester/title')
                .set('Accept', 'application/json')
                .set('Cookie', credentials)
                .send({title: "edited title"});
            expect(response.body).toStrictEqual({error: 'you do not have permission to alter this information!'});
        });
        test('it should edit the title when the owner is logged in', async () => {
            const credentials = await getCredentials();
            const response = await supertest(app)
                .put('/api/users/tester/title')
                .set('Accept', 'application/json')
                .set('Cookie', credentials)
                .send({title: "edited title"});
            expect(response.body).toStrictEqual({message: 'title edited successfully'});
        });
    });
});
describe('test all the questions routes', () => {
    describe('test the / questions route', () => {
        test('should retrieve the first page questions', async () => {
            await generateTestPosts();
            const response = await supertest(app)
                .get('/api/questions')
                .set('Accept', 'application/json');
            expect(response.body).toHaveLength(6);
        });
        test('should send a message if the page requested has no contents', async () => {
            const response = await supertest(app)
                .get('/api/questions?page=2')
                .set('Accept', 'application/json');
            expect(response.body).toStrictEqual({error: 'last page reached'})
        });
    });
    describe('test the questions/:id route (GET)', () => {
        test('should get the post object', async () => {
            const response = await supertest(app)
                .get('/api/questions/question/1')
                .set('Accept', 'application/json');
            expect(response.body.question.id).toStrictEqual(1);
        });
        test('should return an error if the requested post does not exist', async () => {
            const response = await supertest(app)
                .get('/api/questions/question/9080')
                .set('Accept', 'application/json');
            expect(response.body).toStrictEqual({error: 'post could not be found!'});
        });
    });
    describe('test the questions/:id route (PUT)', () => {
        test('should not edit the post if not logged in', async () => {
            const response = await supertest(app)
                .put('/api/questions/question/2')
                .set('Accept', 'application/json')
                .send({questionBody: 'ain\'t nice'});
            expect(response.body).toStrictEqual({error: 'please sign in to do this'})
        }); //19 left
        test('should not edit the post if user is logged in but not the author', async () => {
            const credentials = await getCredentials("thisMeetsCriteriaAlso", "Va1idP@ssword");
            const response = await supertest(app)
                .put('/api/questions/question/2')
                .set('Accept', 'application/json')
                .set('Cookie', credentials)
                .send({questionBody: "something is wrong"});
            expect(response.body).toStrictEqual({error: 'you do not have permission to modify this post!'})
        });
        test('should edit the post if the author is logged in and requesting it', async () => {
            const credentials = await getCredentials();
            const response = await supertest(app)
                .put('/api/questions/question/2')
                .set('Accept', 'json/application')
                .set('Cookie', credentials)
                .send({questionBody: "it works"});
            expect(response.body).toStrictEqual({message: 'successful edit!'});
            const question = await supertest(app)
                .get('/api/questions/question/2')
                .set('Accept', 'application/json')
            expect(question.body.question.body).toStrictEqual('it works')
        })
    })
    describe('test the questions/:id route (DELETE)', () => {
        test('should not delete if user is not logged in', async () => {
            const response = await supertest(app)
                .delete('/api/questions/question/2')
                .set('Accept', 'application/json');
            expect(response.body).toStrictEqual({error: 'please sign in to do this'});
        });
        test('should not delete if user is logged in but not author', async () => {
            const credentials = await getCredentials("thisMeetsCriteriaAlso", "Va1idP@ssword");
            const response = await supertest(app)
                .delete('/api/questions/question/2')
                .set('Accept', 'application/json')
                .set('Cookie', credentials);
            expect(response.body).toStrictEqual({error: 'you do not have permission to modify this post!'});
        });
        test('should delete post if author is logged in and requesting it', async () => {
            const credentials = await getCredentials();
            const response = await supertest(app)
                .delete('/api/questions/question/2')
                .set('Accept', 'application/json')
                .set('Cookie', credentials);
            expect(response.body).toStrictEqual({message: "post deleted!"});
        });
    });
    describe('test the /question/new route (POST)', () => {
        test('should not post if the user is not logged in', async () => {
            const post = getRandomBody();
            const response = await supertest(app)
                .post('/api/questions/new')
                .set('Accept', 'application/json')
                .send(post);
            expect(response.body).toStrictEqual({error: 'please sign in to do this'});
        });
        test('should post if user is logged in', async () => {
            console.log('this is already well tested, so pass')
            expect(true).toBe(true);
        }); 
    });
});

describe('test all the answers routes', () => {
    describe('test the /questionId route (POST)', () => {
        test('should not post answer when user is not logged in', async () => {
            const answer = getRandomBody().questionBody;
            const response = await supertest(app)
                .post('/answers/2')
                .set('Accept', 'application/json')
                .send(answer);
            expect(response.body).toStrictEqual({error: 'please sign in to do this'});
        });
        test('should not post answer if question does not exist', async () => {
            const answer = getRandomBody().questionBody;
            const response = await supertest(app)
                .post('/answers/12901')
                .set('Accept', 'application/json')
                .send(answer);
            expect(response.body).toStrictEqual({error: });
        });
        test('should post answer if user logged in and question exists', async () => {

        });
    });
    describe('test the /answer/answerId route (PUT)', () => {
        test('should not edit answer if user not logged in', async () => {

        });
        test('should not edit answer if user logged in but not the author', async () => {

        });
        test('should edit the answer if the user is logged in and the author', async () => {

        });
    });
    describe('test the /answer/answerId route (DELETE)', () => {
        test('should not delete answer if user not logged in', async () => {

        });
        test('should not delete answer if user logged in but not the author', async () => {

        });
        test('should delete the answer if the user is logged in and the author', async () => {

        });
    });
    describe('test the /answer/answerId/POB route (PUT)', () => {
        test('should not ePOB answer if user not logged in', async () => {

        });
        test('should POB the answer if the user is logged in', async () => {

        });
    });
});

