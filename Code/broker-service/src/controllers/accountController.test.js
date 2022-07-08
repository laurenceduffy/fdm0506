import accountController from "./accountController";
import * as accountData from "../data/accountData";
import * as positionData from "../data/positionData";

//#region : test data

const testUserAccount = {
    userId: 1,
    availableFunds: 500.00
}

const testAuthToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dnZWRJbkFzIjoiYWRtaW4iLCJpYXQiOjE0MjI3Nzk2Mzh9.gzSraSYS8EXBxLN_oWnFSRgCzcmJmMjLiuyu5CSpyHI";

const testPortfolioValue = 1000.00;

const testPosition = {
    userId: testUserAccount.userId,
    stock: "AAA",
    amount: 2,
    totalCost: 20.50,
    avgPrice: 20.50,
    open: true,
    timestamp: Date.now
  }

//#endregion

//#region : test setup

beforeAll(() => {
    accountData.getUserAccount = jest.fn();
    accountData.createUserAccount = jest.fn();
    
    positionData.getPortfolioValue = jest.fn();
    positionData.getPosition = jest.fn();
});
  
afterAll(() => {
    
});

beforeEach(() => {
    accountData.getUserAccount.mockImplementation(() => testUserAccount);
    accountData.createUserAccount.mockImplementation(() => testUserAccount);
    
    positionData.getPortfolioValue.mockImplementation(() => testPortfolioValue);
    positionData.getPosition.mockImplementation(() => testPosition);
});

afterEach(() => {
	
});

//#endregion

describe("get", () => {
    it("should return status 200 when getUserAccount and getPortfolioValue succeed", done => {
        accountController.get(testUserAccount.userId, testAuthToken)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
	});

    it("should return body containing funds and portfolio value when getUserAccount and getPortfolioValue succeed", done => {
        accountController.get(testUserAccount.userId, testAuthToken)
            .then(response => {
                const { body } = response;

                expect(body.funds).toBe(testUserAccount.availableFunds);
                expect(body.portfolio).toBe(testPortfolioValue);
                done();
            });
	});

    it("should return status 200 when getUserAccount succeeds and portfolioValue fails", done => {
        positionData.getPortfolioValue.mockImplementation(() => false);

        accountController.get(testUserAccount.userId, testAuthToken)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
	});

    it("should return body containing only funds when getUserAccount succeeds and portfolioValue fails", done => {
        positionData.getPortfolioValue.mockImplementation(() => false);

        accountController.get(testUserAccount.userId, testAuthToken)
            .then(response => {
                const { body } = response;

                expect(body.funds).toBe(testUserAccount.availableFunds);
                expect(body.portfolio).toBeFalsy();
                done();
            });
	});

    it("should call createUserAccount when getUserAccountFails", done => {
        accountData.getUserAccount.mockImplementation(() => false);

        accountController.get(testUserAccount.userId, testAuthToken)
            .then(response => {
                expect(accountData.createUserAccount).toHaveBeenCalled();
                done();
            });
	});

    it("should return status 200 when createUserAccount and getPortfolioValue succeed", done => {
        accountData.getUserAccount.mockImplementation(() => false);

        accountController.get(testUserAccount.userId, testAuthToken)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
	});

    it("should return body containing funds and portfolio value when createUserAccount and getPortfolioValue succeed", done => {
        accountData.getUserAccount.mockImplementation(() => false);

        accountController.get(testUserAccount.userId, testAuthToken)
            .then(response => {
                const { body } = response;

                expect(body.funds).toBe(testUserAccount.availableFunds);
                expect(body.portfolio).toBe(testPortfolioValue);
                done();
            });
	});

    it("should return status 200 when createUserAccount succeeds and getPortfolioValue fails", done => {
        accountData.getUserAccount.mockImplementation(() => false);
        positionData.getPortfolioValue.mockImplementation(() => false);

        accountController.get(testUserAccount.userId, testAuthToken)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
	});

    it("should return body containing only funds when createUserAccount succeeds and portfolioValue fails", done => {
        accountData.getUserAccount.mockImplementation(() => false);
        positionData.getPortfolioValue.mockImplementation(() => false);

        accountController.get(testUserAccount.userId, testAuthToken)
            .then(response => {
                const { body } = response;

                expect(body.funds).toBe(testUserAccount.availableFunds);
                expect(body.portfolio).toBeFalsy();
                done();
            });
	});

    it("should return status 403 when getUserAccount and createUserAccount fail", done => {
        accountData.getUserAccount.mockImplementation(() => false);
        accountData.createUserAccount.mockImplementation(() => false);
        positionData.getPortfolioValue.mockImplementation(() => false);

        accountController.get(testUserAccount.userId, testAuthToken)
            .then(response => {
                const { status } = response;

                expect(status).toBe(403);
                done();
            });
	});
});

describe("shares", () => {
    it("should return status 200 when getPosition returns an open position", done => {
        accountController.shares(testUserAccount.userId, testPosition.symbol)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
    });

    it("should return body containing amount and avgPrice when getPosition returns an open position", done => {
        accountController.shares(testUserAccount.userId, testPosition.symbol)
            .then(response => {
                const { body } = response;

                expect(body.amount).toBe(testPosition.amount);
                expect(body.avgPrice).toBe(testPosition.avgPrice);
                done();
            });
    });

    it("should return status 200 when getPosition returns no position", done => {
        positionData.getPosition.mockImplementation(() => null);

        accountController.shares(testUserAccount.userId, testPosition.symbol)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
    });

    it("should return body containing 0 for amount and avgPrice when getPosition returns no position", done => {
        positionData.getPosition.mockImplementation(() => null);

        accountController.shares(testUserAccount.userId, testPosition.symbol)
            .then(response => {
                const { body } = response;

                expect(body.amount).toBe(0);
                expect(body.avgPrice).toBe(0);
                done();
            });
    });
});