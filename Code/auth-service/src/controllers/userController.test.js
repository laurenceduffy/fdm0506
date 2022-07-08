import * as userData from './../data/userData';
import * as jwt from './../util/jwtUtil';
import dotenv from 'dotenv';
import userController from './userController';
import roles from '../data/userRoles';
import * as emailUtil from './../util/emailUtil';

dotenv.config() // get .env vars for JWT secret key

//#region : test data

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
const testUserToken = jwt.getUserToken(testActivatedUser);
const testAdminToken = jwt.getAdminToken(testAdmin);

//#endregion

//#region : test setup

beforeAll(() => {
    userData.getUser = jest.fn();
    userData.emailInUse = jest.fn();
    userData.deleteUser = jest.fn();

    jwt.verifyUserToken = jest.fn();
    jwt.verifyAdminToken = jest.fn();

    emailUtil.sendConfirmEmail = jest.fn();

    jwt.verifyAdminToken.mockImplementation((token) => {
        if(token === testAdminToken) return testAdmin;

        return null;
    });

    jwt.verifyUserToken.mockImplementation((token) => {
        if(token === testAdminToken) return testAdmin;
        if(token === testUserToken) return testActivatedUser;

        return null;
    });

    testActivatedUser.save = jest.fn();
    testActivatedUser.save.mockImplementation(() => { return; } );
});
  
afterAll(() => {
    
});

beforeEach(() => {

});

afterEach(() => {
	
});

//#endregion

describe('getUserDetails', () => {
    it('should return status 403 when an invalid token is used', done => {
        userController.getUserDetails('fake-token', testActivatedUser.username)
            .then(response => {
                const { status } = response;

                expect(status).toBe(403);
                done();
            });
    });

    it('should call getUser with the username parameter when a valid admin token is used', done => {
        const usernameParam = testActivatedUser.username;

        userController.getUserDetails(testAdminToken, usernameParam)
            .then(response => {
                expect(userData.getUser).toHaveBeenCalledWith(usernameParam);
                done();
            });
    });

    it('should call getUser with the user\'s email when a valid user token is used', done => {
        const emailParam = testActivatedUser.email;

        userController.getUserDetails(testUserToken)
            .then(response => {
                expect(userData.getUser).toHaveBeenCalledWith(emailParam);
                done();
            });
    });

    it('should return status 404 when getUser returns null', done => {
        userData.getUser.mockImplementation(() => null);

        userController.getUserDetails(testUserToken)
            .then(response => {
                const { status } = response;

                expect(status).toBe(404);
                done();
            });
    });

    it('should return status 200 when a valid user token is used and getUser returns a valid user', done => {
        userData.getUser.mockImplementation(() => testActivatedUser);

        userController.getUserDetails(testUserToken)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
    });

    it('should return status 200 when a valid admin token is used and getUser returns a valid user', done => {
        userData.getUser.mockImplementation(() => testActivatedUser);

        userController.getUserDetails(testAdminToken)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
    });

    it('should return body containing the retrieved user when a valid user token is used and getUser returns a valid user', done => {
        const retrievedUser = testActivatedUser;
        userData.getUser.mockImplementation(() => retrievedUser);

        userController.getUserDetails(testUserToken)
            .then(response => {
                const { body } = response;

                expect(body).toBe(retrievedUser);
                done();
            });
    });

    it('should return body containing selected user information when a valid admin token is used and getUser returns a valid user', done => {
        const userInfo = {
            username: testActivatedUser.username,
            email: testActivatedUser.email,
            created: testActivatedUser.created,
            isActive: testActivatedUser.deactiveUntil < Date.now(),
            deleteRequested: testActivatedUser.deleteRequested,
            deactiveUntil: testActivatedUser.deactiveUntil,
            deactivateReason: testActivatedUser.deactivateReason
        }

        userData.getUser.mockImplementation(() => testActivatedUser);

        userController.getUserDetails(testAdminToken)
            .then(response => {
                const { body } = response;

                expect(JSON.stringify(body)).toBe(JSON.stringify(userInfo));
                done();
            });
    });
});


describe('updateUserDetails', () => {
    it('should call changeEmail when email parameter is passed', done => {
        const changeEmailFunc = jest.spyOn(userController, 'changeEmail');

        userController.updateUserDetails(testUserToken, 'email')
            .then(response => {
                expect(changeEmailFunc).toHaveBeenCalled()
                done();
            });
    });

    it('should call changePassword when password parameter is passed and email parameter is null', done => {
        const changePasswordFunc = jest.spyOn(userController, 'changePassword');

        userController.updateUserDetails(testUserToken, null, 'newPass')
            .then(response => {
                expect(changePasswordFunc).toHaveBeenCalled()
                done();
            });
    });

    it('should return status 400 when all input parameters are null', done => {
        userController.updateUserDetails(testUserToken, null, null, null)
            .then(response => {
                const { status } = response;

                expect(status).toBe(400);
                done();
            });
    });

    it('should return status 200 when a date of birth is given', done => {
        userController.updateUserDetails(testUserToken, null, null, '2000-01-02')
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
    });
});

describe('changePassword', () => {
    const validPassword = 'ValidPassword123';

    it('should return status 400 when provided with an invalid password', done => {
        const invalidPassword = 'NoNumerics';

        userController.changePassword(testActivatedUser, invalidPassword)
            .then(response => {
                const { status } = response;

                expect(status).toBe(400);
                done();
            });
    });

    it('should return status 200 when provided with a valid password', done => {
        userController.changePassword(testActivatedUser, validPassword)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
    });
});

describe('changeEmail', () => {
    const validEmail = 'email@domain.com';

    it('should return status 400 when provided with an invalid email', done => {
        const invalidEmail = 'EmailAddress';

        userController.changeEmail(testActivatedUser, invalidEmail)
            .then(response => {
                const { status } = response;

                expect(status).toBe(400);
                done();
            });
    });

    it('should return status 403 when emailInUse returns true', done => {
        userData.emailInUse.mockImplementation(() => true);

        userController.changeEmail(testActivatedUser, validEmail)
            .then(response => {
                const { status } = response;

                expect(status).toBe(403);
                done();
            });
    });

    it('should return status 502 when emailInUse and sendConfirmEmail return false', done => {
        userData.emailInUse.mockImplementation(() => false);
        emailUtil.sendConfirmEmail.mockImplementation(() => false);

        userController.changeEmail(testActivatedUser, validEmail)
            .then(response => {
                const { status } = response;

                expect(status).toBe(502);
                done();
            });
    });

    it('should return status 200 when emailInUse returns false sendConfirmEmail returns true', done => {
        userData.emailInUse.mockImplementation(() => false);
        emailUtil.sendConfirmEmail.mockImplementation(() => true);

        userController.changeEmail(testActivatedUser, validEmail)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
    });
});

describe('deleteUser', () => {
    it('should return status 404 when passed a valid admin token and deleteUser returns false', done => {
        userData.deleteUser.mockImplementation(() => false);

        userController.deleteUser(testAdminToken, testActivatedUser)
            .then(response => {
                const { status } = response;

                expect(status).toBe(404);
                done();
            });
    });

    it('should return status 200 when passed a valid admin token and deleteUser returns true', done => {
        userData.deleteUser.mockImplementation(() => true);

        userController.deleteUser(testAdminToken, testActivatedUser)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
    });

    it('should return status 200 when passed a valid user token with a corresponding matching email', done => {
        userController.deleteUser(testUserToken, testActivatedUser.email)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
    });

    it('should call requestDeletion with the correct user when passed a valid user token with a corresponding matching email', done => {
        const requestFunc = jest.spyOn(userData, 'requestDeletion');

        userController.deleteUser(testUserToken, testActivatedUser.email)
            .then(response => {
                expect(requestFunc).toHaveBeenCalledWith(testActivatedUser);
                done();
            });
    });

    it('should return status 403 when passed a valid user token with a non-matching email', done => {
        userController.deleteUser(testUserToken, testDeactivatedUser.email)
            .then(response => {
                const { status } = response;

                expect(status).toBe(403);
                done();
            });
    });

    it('should return status 403 when passed a non-valid user token', done => {
        userController.deleteUser('fake-token', testActivatedUser.email)
            .then(response => {
                const { status } = response;

                expect(status).toBe(403);
                done();
            });
    });
});