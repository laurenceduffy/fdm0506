import transactionController from './transactionController';
import * as accountData from '../data/accountData';
import * as transactionData from '../data/transactionData';

//#region : test data

const testUserAccount = {
    userId: 1,
    availableFunds: 500.00
};

const testTransactions = [
    {
        userId: 1,
        stock: "AAA",
        amount: 10,
        price: 20,
        type: 0,
        timestamp: Date.now()
    },
    {
        userId: 1,
        stock: "BBB",
        amount: 10,
        price: 25,
        type: 0,
        timestamp: Date.now()
    }
];

//#endregion

//#region : test setup

beforeAll(() => {
    accountData.getUserAccount = jest.fn();
    
    transactionData.getAllTransactions = jest.fn();
    transactionData.performBuyTransaction = jest.fn();
    transactionData.performSellTransaction = jest.fn();
});
  
afterAll(() => {
    
});

beforeEach(() => {
    accountData.getUserAccount.mockImplementation(() => testUserAccount);

    transactionData.getAllTransactions.mockImplementation(() => testTransactions);
    transactionData.performBuyTransaction.mockImplementation(() => true);
    transactionData.performSellTransaction.mockImplementation(() => true);
});

afterEach(() => {
	
});

//#endregion

describe("get", () => {
    it("should return status 200 when getAllTransactions returns a list of transactions", done => {
        transactionController.get(testUserAccount.userId)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
    })

    it("should return body containing a list of transactions when getAllTransactions returns a list of transactions", done => {
        transactionController.get(testUserAccount.userId)
            .then(response => {
                const { body } = response;

                expect(body).toBe(testTransactions);
                done();
            });
    })

    it("should return status 200 when getAllTransactions returns an empty list", done => {
        transactionData.getAllTransactions.mockImplementation(() => []);

        transactionController.get(testUserAccount.userId)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
    })

    it("should return body containing an empty list when getAllTransactions returns an empty list", done => {
        transactionData.getAllTransactions.mockImplementation(() => []);
        
        transactionController.get(testUserAccount.userId)
            .then(response => {
                const { body } = response;

                expect(body).toHaveLength(0);
                done();
            });
    })
});


describe("buy", () => {
    it("should return status 200 when performBuyTransaction and getUserAccount succeed", done => {
        transactionController.buy(testUserAccount.userId, "AAA", 10)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
    })

    it("should return status 403 when performBuyTransaction fails", done => {
        transactionData.performBuyTransaction.mockImplementation(() => false);

        transactionController.buy(testUserAccount.userId, "AAA", 10)
            .then(response => {
                const { status } = response;

                expect(status).toBe(403);
                done();
            });
    })

    it("should return status 403 when getUserAccount fails", done => {
        accountData.getUserAccount.mockImplementation(() => null);

        transactionController.buy(testUserAccount.userId, "AAA", 10)
            .then(response => {
                const { status } = response;

                expect(status).toBe(403);
                done();
            });
    })
});

describe("sell", () => {
    it("should return status 200 when performSellTransaction and getUserAccount succeed", done => {
        transactionController.sell(testUserAccount.userId, "AAA", 10)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
    })

    it("should return status 403 when performSellTransaction fails", done => {
        transactionData.performSellTransaction.mockImplementation(() => false);

        transactionController.sell(testUserAccount.userId, "AAA", 10)
            .then(response => {
                const { status } = response;

                expect(status).toBe(403);
                done();
            });
    })

    it("should return status 403 when getUserAccount fails", done => {
        accountData.getUserAccount.mockImplementation(() => null);

        transactionController.sell(testUserAccount.userId, "AAA", 10)
            .then(response => {
                const { status } = response;

                expect(status).toBe(403);
                done();
            });
    })
});