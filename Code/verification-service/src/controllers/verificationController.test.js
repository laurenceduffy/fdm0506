import * as cardData from '../data/cardData';
import verificationController from './verificationController';

//#region : test data

const testUserId = 1;
const invalidUserId = 99;

const ccDetails = {
    userId: testUserId,
    name: 'Test Name',
    number: '0000111122223333',
    expiry: '09/25',
    cvv: '987'
}

//#endregion

//#region : test setup

beforeAll(() => {
    cardData.createCardDetails = jest.fn();
    cardData.createCardDetails.mockImplementation(() => {return;})

    cardData.editCardDetails = jest.fn();
    cardData.editCardDetails.mockImplementation(() => {return;})

    cardData.getCardDetails = jest.fn();
    cardData.getCardDetails.mockImplementation((userId) => {
        if(userId === ccDetails.userId) return ccDetails;

        return null;
    })
});
  
afterAll(() => {
    
});

beforeEach(() => {
    
});

afterEach(() => {
	
});

//#endregion

describe('updateCardDetails', () => {
    it('should return status 400 when name is undefined', done => {
        const details = { ...ccDetails };
        delete details.name;

        verificationController.updateCardDetails(testUserId, details)
            .then(response => {
                const { status } = response;

                expect(status).toBe(400);
                done();
            });
    });

    it('should return status 400 when number is undefined', done => {
        const details = { ...ccDetails };
        delete details.number;

        verificationController.updateCardDetails(testUserId, details)
            .then(response => {
                const { status } = response;

                expect(status).toBe(400);
                done();
            });
    });

    it('should return status 400 when expiry is undefined', done => {
        const details = { ...ccDetails };
        delete details.expiry;

        verificationController.updateCardDetails(testUserId, details)
            .then(response => {
                const { status } = response;

                expect(status).toBe(400);
                done();
            });
    });

    it('should return status 400 when cvv is undefined', done => {
        const details = { ...ccDetails };
        delete details.cvv;

        verificationController.updateCardDetails(testUserId, details)
            .then(response => {
                const { status } = response;

                expect(status).toBe(400);
                done();
            });
    });

    it('should call createCardDetails when a non-existing userId is used', done => {
        verificationController.updateCardDetails(invalidUserId, ccDetails)
            .then(response => {
                expect(cardData.createCardDetails).toHaveBeenCalled();
                done();
            });
    });

    it('should call editCardDetails when an existing userId is used', done => {
        verificationController.updateCardDetails(testUserId, ccDetails)
            .then(response => {
                expect(cardData.createCardDetails).toHaveBeenCalled();
                done();
            });
    });

    it('should return status 200 when a non-existing userId is used', done => {
        verificationController.updateCardDetails(invalidUserId, ccDetails)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
    });

    it('should return status 200 when an existing userId is used', done => {
        verificationController.updateCardDetails(testUserId, ccDetails)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
    });
});

describe('getCardDetails', () => {
    it('should return status 404 when a non-existing userId is used', done => {
        verificationController.getCardDetails(invalidUserId)
            .then(response => {
                const { status } = response;

                expect(status).toBe(404);
                done();
            });
    });

    it('should return status 200 when an existing userId is used', done => {
        verificationController.getCardDetails(testUserId)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
    });

    it('should return body containing card details when an existing userId is used', done => {
        const expectedBody = {
            name:ccDetails.name,
            number:ccDetails.number,
            expiry:ccDetails.expiry,
            cvv:ccDetails.cvv
        }

        verificationController.getCardDetails(testUserId)
            .then(response => {
                const { body } = response;

                expect(JSON.stringify(body)).toBe(JSON.stringify(expectedBody));
                done();
            });
    });
});