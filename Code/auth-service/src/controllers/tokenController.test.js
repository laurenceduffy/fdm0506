import * as jwt from './../util/jwtUtil';
import dotenv from 'dotenv';
import roles from '../data/userRoles';
import tokenController from './tokenController';

dotenv.config() // get .env vars for JWT secret key

//#region : test data

const testUser = {
    id: 1,
    username: 'test',
    forename: 'firstname',
    surname: 'lastname',
    email: 'test@example.com',
    isActivated: true
};

const testAdmin = {
    id: 3,
    username: 'admin',
    forename: 'firstname3',
    surname: 'lastname3',
    email: 'admin@example.com',
    isActivated: true,
    role: roles.admin
};

const testAdminToken = jwt.getAdminToken(testAdmin);

const testUserToken = jwt.getAdminToken(testUser);

//#endregion

//#region : test setup

beforeAll(() => {
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

describe('validateToken', () => {
    it('should return status 200 when verifyUserToken returns a user', done => {
        jwt.verifyUserToken.mockImplementation(() => testUser);

        tokenController.validateToken(testUserToken)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
    })

    it('should return body containing token when verifyUserToken returns a user', done => {
        jwt.verifyUserToken.mockImplementation(() => testUser);

        tokenController.validateToken(testUserToken)
            .then(response => {
                const { body } = response;

                expect(body.token).toBe(testUserToken);
                done();
            });
    })

    it('should return status 401 when verifyUserToken returns null', done => {
        jwt.verifyUserToken.mockImplementation(() => null);

        tokenController.validateToken(testUserToken)
            .then(response => {
                const { status } = response;

                expect(status).toBe(401);
                done();
            });
    })
})

describe('validateAdmin', () => {
    it('should return status 200 when verifyAdminToken returns a user', done => {
        jwt.verifyAdminToken.mockImplementation(() => testAdmin);

        tokenController.validateAdmin(testAdminToken)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
    })

    it('should return body containing token when verifyAdminToken returns a user', done => {
        jwt.verifyAdminToken.mockImplementation(() => testAdmin);

        tokenController.validateAdmin(testAdminToken)
            .then(response => {
                const { body } = response;

                expect(body.token).toBe(testAdminToken);
                done();
            });
    })

    it('should return status 401 when verifyAdminToken returns null', done => {
        jwt.verifyAdminToken.mockImplementation(() => null);

        tokenController.validateAdmin(testAdminToken)
            .then(response => {
                const { status } = response;

                expect(status).toBe(401);
                done();
            });
    })
})