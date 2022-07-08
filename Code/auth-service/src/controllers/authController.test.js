import * as userData from './../data/userData';
import * as jwt from './../util/jwtUtil';
import authController from './authController';
import dotenv from 'dotenv';
import roles from '../data/userRoles';

dotenv.config() // get .env vars for JWT secret key

//#region : test data

const testEmail = 'test@domain.com';
const testPassword = 'MyPassword1234';

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

const testDeletedUser = {
    id: 3,
    username: 'test3',
    forename: 'firstname3',
    surname: 'lastname3',
    email: 'test3@example.com',
    isActivated: true,
    deleteRequested: true
};

const testDeactivatedUser = {
    id: 4,
    username: 'test4',
    forename: 'firstname4',
    surname: 'lastname4',
    email: 'test4@example.com',
    isActivated: true,
    deactiveUntil: new Date(8640000000000000)
};

const testReactivationUser = {
    id: 5,
    username: 'test5',
    forename: 'firstname5',
    surname: 'lastname5',
    email: 'test5@example.com',
    isActivated: true,
    deactiveUntil: new Date(8640000000000000),
    reactivateRequested: true
};

const testAdmin = {
    id: 6,
    username: 'test6',
    forename: 'firstname6',
    surname: 'lastname6',
    email: 'test6@example.com',
    isActivated: true,
    role: roles.admin
};

const testRegisterFields = {
    valid: {
        username: 'username01',
        email: testEmail,
        password: testPassword,
        forename: 'Forename',
        surname: 'Surname'
    },
    invalidUsername: {
        username: 'u',
        email: testEmail,
        password: testPassword,
        forename: 'Forename',
        surname: 'Surname'
    },
    invalidEmail: {
        username: 'username01',
        email: 'email',
        password: testPassword,
        forename: 'Forename',
        surname: 'Surname'
    },
    invalidPassword: {
        username: 'username01',
        email: testEmail,
        password: 'pass',
        forename: 'Forename',
        surname: 'Surname'
    },
    invalidNoForename: {
        username: 'username01',
        email: testEmail,
        password: testPassword,
        surname: 'Surname'
    },
    invalidNoSurname: {
        username: 'username01',
        email: testEmail,
        password: testPassword,
        forename: 'Forename'
    }
}

//#endregion

//#region : test setup

beforeAll(() => {
    userData.verifyPassword = jest.fn();
    userData.createUser = jest.fn();
    userData.getUser = jest.fn();
    userData.sendRegistrationComms = jest.fn();
});
  
afterAll(() => {
    
});

beforeEach(() => {

});

afterEach(() => {
	
});

//#endregion

describe('login', () => {
    it('should return status 200 when getUser returns an active user and verifyPassword returns true', done => {
        userData.getUser.mockImplementation(() => testActivatedUser);
        userData.verifyPassword.mockImplementation(() => true);

        authController.login(testEmail, testPassword)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            })
    })

    it('should return body containing correct JWT when getUser returns an active user and verifyPassword returns true', done => {
        userData.getUser.mockImplementation(() => testActivatedUser);
        userData.verifyPassword.mockImplementation(() => true);

        const expectedJwt = jwt.getUserToken(testActivatedUser);

        authController.login(testEmail, testPassword)
            .then(response => {
                const { body } = response;

                expect(body.token).toBe(expectedJwt);
                expect(body.admin).toBeFalsy();
                done();
            })
    })

    it('should return status 200 when getUser returns an active admin and verifyPassword returns true', done => {
        userData.getUser.mockImplementation(() => testAdmin);
        userData.verifyPassword.mockImplementation(() => true);

        authController.login(testEmail, testPassword)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            })
    })

    it('should return body containing correct JWT when getUser returns an active admin and verifyPassword returns true', done => {
        userData.getUser.mockImplementation(() => testAdmin);
        userData.verifyPassword.mockImplementation(() => true);

        const expectedJwt = jwt.getUserToken(testAdmin);
        const expectedAdminJwt = jwt.getAdminToken(testAdmin);

        authController.login(testEmail, testPassword)
            .then(response => {
                const { body } = response;

                expect(body.token).toBe(expectedJwt);
                expect(body.admin).toBe(expectedAdminJwt);
                done();
            })
    })

    it('should return status 403 when getUser returns a user awaiting re-activation and verifyPassword returns true', done => {
        userData.getUser.mockImplementation(() => testReactivationUser);
        userData.verifyPassword.mockImplementation(() => true);

        authController.login(testEmail, testPassword)
            .then(response => {
                const { status } = response;

                expect(status).toBe(403);
                done();
            })
    })

    it('should return status 403 when getUser returns a de-activated user and verifyPassword returns true', done => {
        userData.getUser.mockImplementation(() => testDeactivatedUser);
        userData.verifyPassword.mockImplementation(() => true);

        authController.login(testEmail, testPassword)
            .then(response => {
                const { status } = response;

                expect(status).toBe(403);
                done();
            })
    })

    it('should return status 403 when getUser returns a user awaiting deletion and verifyPassword returns true', done => {
        userData.getUser.mockImplementation(() => testDeletedUser);
        userData.verifyPassword.mockImplementation(() => true);

        authController.login(testEmail, testPassword)
            .then(response => {
                const { status } = response;

                expect(status).toBe(403);
                done();
            })
    })

    it('should return status 403 when getUser returns a non-activated user and verifyPassword returns true', done => {
        userData.getUser.mockImplementation(() => testNonActivatedUser);
        userData.verifyPassword.mockImplementation(() => true);

        authController.login(testEmail, testPassword)
            .then(response => {
                const { status } = response;

                expect(status).toBe(403);
                done();
            })
    })

    it('should return status 401 when getUser returns a user and verifyPassword returns false', done => {
        userData.getUser.mockImplementation(() => testActivatedUser);
        userData.verifyPassword.mockImplementation(() => false);

        authController.login(testEmail, testPassword)
            .then(response => {
                const { status } = response;

                expect(status).toBe(401);
                done();
            })
    })

    it('should return status 401 when getUser returns null', done => {
        userData.getUser.mockImplementation(() => null);

        authController.login(testEmail, testPassword)
            .then(response => {
                const { status } = response;

                expect(status).toBe(401);
                done();
            })
    })

    it('should return status 400 when password is not provided', done => {
        authController.login(testEmail, null)
            .then(response => {
                const { status } = response;

                expect(status).toBe(400);
                done();
            })
    })
})

describe('register', () => {
    it('should return status 400 when username is invalid', done => {
        authController.register(testRegisterFields.invalidUsername)
            .then(response => {
                const { status } = response;

                expect(status).toBe(400);
                done();
            })
    })

    it('should return status 400 when email address is invalid', done => {
        authController.register(testRegisterFields.invalidEmail)
            .then(response => {
                const { status } = response;

                expect(status).toBe(400);
                done();
            })
    })

    it('should return status 400 when password is invalid', done => {
        authController.register(testRegisterFields.invalidPassword)
            .then(response => {
                const { status } = response;

                expect(status).toBe(400);
                done();
            })
    })

    it('should return status 400 when forename is omitted', done => {
        authController.register(testRegisterFields.invalidNoForename)
            .then(response => {
                const { status } = response;

                expect(status).toBe(400);
                done();
            })
    })

    it('should return status 400 when surname is omitted', done => {
        authController.register(testRegisterFields.invalidNoSurname)
            .then(response => {
                const { status } = response;

                expect(status).toBe(400);
                done();
            })
    })

    it('should return status 403 when getUser returns a user', done => {
        userData.getUser.mockImplementation(() => testActivatedUser);

        authController.register(testRegisterFields.valid)
            .then(response => {
                const { status } = response;

                expect(status).toBe(403);
                done();
            })
    })

    it('should return status 502 when createUser returns a user and sendRegistrationComms returns false', done => {
        userData.getUser.mockImplementation(() => null);
        userData.createUser.mockImplementation(() => testNonActivatedUser);
        userData.sendRegistrationComms.mockImplementation(() => false);

        authController.register(testRegisterFields.valid)
            .then(response => {
                const { status } = response;

                expect(status).toBe(502);
                done();
            })
    })

    it('should return status 200 when createUser returns a user and sendRegistrationComms returns true', done => {
        userData.getUser.mockImplementation(() => null);
        userData.createUser.mockImplementation(() => testNonActivatedUser);
        userData.sendRegistrationComms.mockImplementation(() => true);

        authController.register(testRegisterFields.valid)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            })
    })

    it('should return body containing a valid JWT when createUser returns a user and sendRegistrationComms returns true', done => {
        userData.getUser.mockImplementation(() => null);
        userData.createUser.mockImplementation(() => testNonActivatedUser);
        userData.sendRegistrationComms.mockImplementation(() => true);

        const expectedJwt = jwt.getUserToken(testNonActivatedUser);

        authController.register(testRegisterFields.valid)
            .then(response => {
                const { body } = response;

                expect(body.token).toBe(expectedJwt);
                done();
            })
    })
})