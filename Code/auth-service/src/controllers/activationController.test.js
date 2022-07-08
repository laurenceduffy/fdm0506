import * as userData from './../data/userData';
import activationController from './activationController';
import * as jwt from './../util/jwtUtil';
import dotenv from 'dotenv';
import roles from '../data/userRoles';

dotenv.config() // get .env vars for JWT secret key

//#region : test data

const testEmail = "email@domain.com";

const testActivationCode = "b58db787-23b7-4a73-9e01-865915fd4938";

const testActivatedUser = {
    id: 1,
    username: 'test',
    forename: 'firstname',
    surname: 'lastname',
    email: 'test@example.com',
    isActivated: true
};

const testNonActivatedUser = {
    id: 2,
    username: 'test2',
    forename: 'firstname2',
    surname: 'lastname2',
    email: 'test2@example.com',
    isActivated: false
};

const testAdminUser = {
    id: 3,
    username: 'admin',
    forename: 'firstname3',
    surname: 'lastname3',
    email: 'admin@example.com',
    isActivated: true,
    role: roles.admin
};

const testAdminToken = jwt.getAdminToken(testAdminUser);

const testReactivateUsers = [ testNonActivatedUser ];

const testDeleteUsers = [ testActivatedUser ];

const testUserRequests = { reactivateUsers: testReactivateUsers, deleteUsers: testDeleteUsers  };

//#endregion

//#region : test setup

beforeAll(() => {
    userData.getUser = jest.fn();
    userData.confirmNewEmail = jest.fn();
    userData.activateUser = jest.fn();
    userData.deactivateUser = jest.fn();
    userData.reactivateUser = jest.fn();
    userData.getAllUserRequests = jest.fn();
    userData.requestReactivation = jest.fn();

    jwt.verifyUserToken = jest.fn();
    jwt.verifyAdminToken = jest.fn();
});
  
afterAll(() => {
    
});

beforeEach(() => {

});

afterEach(() => {
	
});

//#endregion

describe('activate', () => {
    it('should return status 200 when getUser returns a non-activated user and activateUser returns a user', done => {
        userData.getUser.mockImplementation(() => testNonActivatedUser);
        userData.activateUser.mockImplementation(() => testNonActivatedUser);

        activationController.activate(testEmail, testActivationCode)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
    })

    it('should return body containing a valid JWT when getUser returns a non-activated user and activateUser returns a user', done => {
        userData.getUser.mockImplementation(() => testNonActivatedUser);
        userData.activateUser.mockImplementation(() => testNonActivatedUser);

        activationController.activate(testEmail, testActivationCode)
            .then(response => {
                const { body } = response;
                const expectedToken = jwt.getUserToken(testNonActivatedUser);
                
                expect(body.token).toBe(expectedToken);
                done();
            });
    })

    it('should return status 200 when getUser returns null and confirmNewEmail returns a user', done => {
        userData.getUser.mockImplementation(() => null);
        userData.confirmNewEmail.mockImplementation(() => testActivatedUser);

        activationController.activate(testEmail, testActivationCode)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
    })

    it('should return body containing a valid JWT when getUser returns null and confirmNewEmail returns a user', done => {
        userData.getUser.mockImplementation(() => null);
        userData.confirmNewEmail.mockImplementation(() => testActivatedUser);
        
        activationController.activate(testEmail, testActivationCode)
            .then(response => {
                const { body } = response;
                const expectedToken = jwt.getUserToken(testActivatedUser);
                
                expect(body.token).toBe(expectedToken);
                done();
            });
    })

    it('should return status 200 when getUser returns an activated user and confirmNewEmail returns a user', done => {
        userData.getUser.mockImplementation(() => testActivatedUser);
        userData.confirmNewEmail.mockImplementation(() => testActivatedUser);

        activationController.activate(testEmail, testActivationCode)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
    })

    it('should return body containing a valid JWT when getUser returns an activated user and confirmNewEmail returns a user', done => {
        userData.getUser.mockImplementation(() => testActivatedUser);
        userData.confirmNewEmail.mockImplementation(() => testActivatedUser);

        activationController.activate(testEmail, testActivationCode)
            .then(response => {
                const { body } = response;
                const expectedToken = jwt.getUserToken(testActivatedUser);
                
                expect(body.token).toBe(expectedToken);
                done();
            });
    })

    it('should return status 403 when getUser returns a non-activated user and activateUser returns false', done => {
        userData.getUser.mockImplementation(() => testNonActivatedUser);
        userData.activateUser.mockImplementation(() => false);

        activationController.activate(testEmail, testActivationCode)
            .then(response => {
                const { status } = response;

                expect(status).toBe(403);
                done();
            });
    })

    it('should return status 403 when getUser returns an activated user confirmNewEmail returns false', done => {
        userData.getUser.mockImplementation(() => testActivatedUser);
        userData.confirmNewEmail.mockImplementation(() => false);

        activationController.activate(testEmail, testActivationCode)
            .then(response => {
                const { status } = response;

                expect(status).toBe(403);
                done();
            });
    })

    it('should return status 403 when getUser returns null confirmNewEmail returns false', done => {
        userData.getUser.mockImplementation(() => null);
        userData.confirmNewEmail.mockImplementation(() => false);

        activationController.activate(testEmail, testActivationCode)
            .then(response => {
                const { status } = response;

                expect(status).toBe(403);
                done();
            });
    })

    it('should return status 400 when the email parameter is null', done => {
        activationController.activate(null, testActivationCode)
            .then(response => {
                const { status } = response;

                expect(status).toBe(400);
                done();
            });
    })

    it('should return status 400 when the code parameter is null', done => {
        activationController.activate(testEmail, null)
            .then(response => {
                const { status } = response;

                expect(status).toBe(400);
                done();
            });
    })
});

describe('deactivateUser', () => {
    const testDatetime = new Date();
    const testReason = "test reason";

    it('should return status 200 when verifyAdminToken and getUser both return a user', done => {
        jwt.verifyAdminToken.mockImplementation(() => testAdminUser);
        userData.getUser.mockImplementation(() => testActivatedUser);

        activationController.deactivateUser(testAdminToken, testEmail, testDatetime, testReason)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
    })

    it('should call getUser when verifyAdminToken returns a user', done => {
        activationController.deactivateUser(testAdminToken, testEmail, testDatetime, testReason)
            .then(response => {
                expect(userData.getUser).toHaveBeenCalled();
                done();
            });
    })

    it('should call deactivateUser when verifyAdminToken and getUser both return a user', done => {
        jwt.verifyAdminToken.mockImplementation(() => testAdminUser);
        userData.getUser.mockImplementation(() => testActivatedUser);

        activationController.deactivateUser(testAdminToken, testEmail, testDatetime, testReason)
            .then(response => {
                expect(userData.deactivateUser).toHaveBeenCalled();
                done();
            });
    })

    it('should return status 403 when verifyAdminToken returns false', done => {
        jwt.verifyAdminToken.mockImplementation(() => false);

        activationController.deactivateUser(testAdminToken, testEmail, testDatetime, testReason)
            .then(response => {
                const { status } = response;

                expect(status).toBe(403);
                done();
            });
    })

    it('should return status 404 when verifyAdminToken returns a user and getUser returns null', done => {
        jwt.verifyAdminToken.mockImplementation(() => testAdminUser);
        userData.getUser.mockImplementation(() => null);

        activationController.deactivateUser(testAdminToken, testEmail, testDatetime, testReason)
            .then(response => {
                const { status } = response;

                expect(status).toBe(404);
                done();
            });
    })
})

describe('reactivateUser', () => {
    it('should return status 200 when verifyAdminToken and getUser both return a user', done => {
        jwt.verifyAdminToken.mockImplementation(() => testAdminUser);
        userData.getUser.mockImplementation(() => testActivatedUser);

        activationController.reactivateUser(testAdminToken, testEmail)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
    })

    it('should call getUser when verifyAdminToken returns a user', done => {
        activationController.reactivateUser(testAdminToken, testEmail)
            .then(response => {
                expect(userData.getUser).toHaveBeenCalled();
                done();
            });
    })

    it('should call reactivateUser when verifyAdminToken and getUser both return a user', done => {
        jwt.verifyAdminToken.mockImplementation(() => testAdminUser);
        userData.getUser.mockImplementation(() => testActivatedUser);

        activationController.reactivateUser(testAdminToken, testEmail)
            .then(response => {
                expect(userData.reactivateUser).toHaveBeenCalled();
                done();
            });
    })

    it('should return status 403 when verifyAdminToken returns false', done => {
        jwt.verifyAdminToken.mockImplementation(() => false);

        activationController.reactivateUser(testAdminToken, testEmail)
            .then(response => {
                const { status } = response;

                expect(status).toBe(403);
                done();
            });
    })

    it('should return status 404 when verifyAdminToken returns a user and getUser returns null', done => {
        jwt.verifyAdminToken.mockImplementation(() => testAdminUser);
        userData.getUser.mockImplementation(() => null);

        activationController.reactivateUser(testAdminToken, testEmail)
            .then(response => {
                const { status } = response;

                expect(status).toBe(404);
                done();
            });
    })
})

describe('requestReactivation', () => {
    it('should return status 200 when getUser returns a user and requestReactivation returns true', done => {
        userData.getUser.mockImplementation(() => testNonActivatedUser);
        userData.requestReactivation.mockImplementation(() => true);

        activationController.requestReactivation(testAdminToken, testEmail)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
    })

    it('should return status 404 when getUser returns null', done => {
        userData.getUser.mockImplementation(() => null);

        activationController.requestReactivation(testAdminToken, testEmail)
            .then(response => {
                const { status } = response;

                expect(status).toBe(404);
                done();
            });
    })

    it('should return status 403 when getUser returns a user and requestReactivation returns false', done => {
        userData.getUser.mockImplementation(() => testNonActivatedUser);
        userData.requestReactivation.mockImplementation(() => false);

        activationController.requestReactivation(testAdminToken, testEmail)
            .then(response => {
                const { status } = response;

                expect(status).toBe(403);
                done();
            });
    })
})

describe('getUserRequests', () => {
    it('should call getAllUserRequests when verifyAdminToken returns a user', done => {
        userData.getAllUserRequests.mockImplementation(() => testUserRequests);

        activationController.getUserRequests(testAdminToken)
            .then(response => {
                expect(userData.getAllUserRequests).toHaveBeenCalled();
                done();
            })
    })

    it('should return status 200 when getAllUserRequests returns a list of users to reactivate and delete', done => {
        const expected = testUserRequests;
        userData.getAllUserRequests.mockImplementation(() => expected);

        activationController.getUserRequests(testAdminToken)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            })
    })

    it('should return body containing all requests when getAllUserRequests returns a list of users to reactivate and delete', done => {
        const expected = testUserRequests;
        userData.getAllUserRequests.mockImplementation(() => expected);

        activationController.getUserRequests(testAdminToken)
            .then(response => {
                const { body } = response;

                expect(body.reactivateUsers).toBe(expected.reactivateUsers);
                expect(body.deleteUsers).toBe(expected.deleteUsers);
                done();
            })
    })

    it('should return status 200 when getAllUserRequests returns only a list of users to reactivate', done => {
        const expected = { reactivateUsers: testReactivateUsers };
        userData.getAllUserRequests.mockImplementation(() => expected);
 
        activationController.getUserRequests(testAdminToken)
            .then(response => {
                const { status } = response;
 
                expect(status).toBe(200);
                done();
            })
    })

    it('should return body containing reactivation requests when getAllUserRequests returns only a list of users to reactivate', done => {
        const expected = { reactivateUsers: testReactivateUsers };
        userData.getAllUserRequests.mockImplementation(() => expected);
 
        activationController.getUserRequests(testAdminToken)
            .then(response => {
                const { body } = response;

                expect(body.reactivateUsers).toBe(expected.reactivateUsers);
                expect(body.deleteUsers).toBeFalsy();
                done();
            })
    })

    it('should return status 200 when getAllUserRequests returns only a list of users to reactivate', done => {
        const expected = { deleteUsers: testDeleteUsers };
        userData.getAllUserRequests.mockImplementation(() => expected);
 
        activationController.getUserRequests(testAdminToken)
            .then(response => {
                const { status } = response;
 
                expect(status).toBe(200);
                done();
            })
    })

    it('should return body containing delete requests when getAllUserRequests returns only a list of users to reactivate', done => {
        const expected = { deleteUsers: testDeleteUsers };
        userData.getAllUserRequests.mockImplementation(() => expected);
 
        activationController.getUserRequests(testAdminToken)
            .then(response => {
                const { body } = response;

                expect(body.reactivateUsers).toBeFalsy();
                expect(body.deleteUsers).toBe(expected.deleteUsers);
                done();
            })
    })

    it('should return status 404 when getAllUserRequests returns no user requests', done => {
        const expected = { };
        userData.getAllUserRequests.mockImplementation(() => expected);
 
        activationController.getUserRequests(testAdminToken)
            .then(response => {
                const { status } = response;
 
                expect(status).toBe(200);
                done();
            })
    })
})