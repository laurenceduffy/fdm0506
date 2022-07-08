import stockController from "./stockController";
import * as stockData from "../data/stockData";
import * as validation from "../data/validation";

//#region : test data

const testStockData = {
    symbol: "AAA",
    company: "Company A"
}

const testPriceData = {
    open: 548.26,
    high: 555.16,
    low: 548.26,
    close: 552.4,
    gains: 0.755,
    volume: 41735879224,
    prices: [
        {
            value: 521.74,
            volume: 842783679,
            gains: -0.131,
            datetime: "2022-01-06T08:00:00.000Z"
        },
        {
            value: 522.74,
            volume: 790183639,
            gains: 0.192,
            datetime: "2022-01-06T08:05:00.000Z"
        },
        {
            value: 523.54,
            volume: 935310135,
            gains: 0.153,
            datetime: "2022-01-06T08:10:00.000Z"
        }
    ]
}

const testCompanySymbols = [
    "AAA",
    "BBB",
    "CCC",
    "DDD"
]

//#endregion

//#region : test setup

beforeAll(() => {
    stockData.getStockData = jest.fn();
    stockData.getPriceData = jest.fn();
    stockData.getCompanySymbols = jest.fn();
    stockData.createStock = jest.fn();
    stockData.editStock = jest.fn();
    stockData.removeStock = jest.fn();

    validation.validateSymbol = jest.fn();
    validation.validateCompany = jest.fn();
});
  
afterAll(() => {
    
});

beforeEach(() => {
    stockData.getStockData.mockImplementation(() => testStockData);
    stockData.getPriceData.mockImplementation(() => testPriceData);
    stockData.getCompanySymbols.mockImplementation(() => testCompanySymbols);
    stockData.createStock.mockImplementation(() => testStockData);
    stockData.editStock.mockImplementation(() => testStockData);
    stockData.removeStock.mockImplementation(() => testStockData);

    validation.validateSymbol.mockImplementation((symbol) => symbol);
    validation.validateCompany.mockImplementation((company) => company);
});

afterEach(() => {
	
});

//#endregion

describe("stock", () => {
    const symbol = testStockData.symbol;

    it("should return status 200 when getStockData and getPriceData succeed", done => {
        stockController.stock(symbol)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
	});

    it("should return body of company details and prices when getStockData and getPriceData succeed", done => {
        stockController.stock(symbol)
            .then(response => {
                const { body } = response;

                expect(body.symbol).toBe(testStockData.symbol);
                expect(body.company).toBe(testStockData.company);
                expect(body.values).toBe(testPriceData);
                done();
            });
	});

    it("should return status 404 when getStockData fails", done => {
        stockData.getStockData.mockImplementation(() => false);

        stockController.stock(symbol)
            .then(response => {
                const { status } = response;

                expect(status).toBe(404);
                done();
            });
	});

    it("should return status 200 when getPriceData fails", done => {
        stockData.getPriceData.mockImplementation(() => false);

        stockController.stock(symbol)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
	});

    it("should return body of company details when getStockData succeeds and getPriceData fails", done => {
        stockData.getPriceData.mockImplementation(() => false);

        stockController.stock(symbol)
            .then(response => {
                const { body } = response;

                expect(body.symbol).toBe(testStockData.symbol);
                expect(body.company).toBe(testStockData.company);
                expect(body.prices).toBeFalsy();
                done();
            });
	});
});

describe("companies", () => {
    it("should return status 200 when getCompanySymbols succeeds", done => {
        stockController.companies()
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
	});

    it("should return body of a list of symbols when getCompanySymbols succeeds", done => {
        stockController.companies()
            .then(response => {
                const { body } = response;

                expect(body.companies).toBe(testCompanySymbols);
                done();
            });
	});

    it("should return status 404 when getCompanySymbols returns null", done => {
        stockData.getCompanySymbols.mockImplementation(() => null);        

        stockController.companies()
            .then(response => {
                const { status } = response;

                expect(status).toBe(404);
                done();
            });
	});

    it("should return status 404 when getCompanySymbols returns empty list", done => {
        stockData.getCompanySymbols.mockImplementation(() => []);

        stockController.companies()
            .then(response => {
                const { status } = response;

                expect(status).toBe(404);
                done();
            });
	});
});

describe("addCompany", () => {
    it("should return status 200 when createStock succeeds", done => {
        stockController.addCompany(testStockData.symbol, testStockData.company)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
	});

    it("should return body of stock model when createStock succeeds", done => {
        stockController.addCompany(testStockData.symbol, testStockData.company)
            .then(response => {
                const { body } = response;

                expect(body).toBe(testStockData);
                done();
            });
	});

    it("should return status 400 when validateSymbol fails", done => {
        validation.validateSymbol.mockImplementation(() => false);

        stockController.addCompany(testStockData.symbol, testStockData.company)
            .then(response => {
                const { status } = response;

                expect(status).toBe(400);
                done();
            });
	});

    it("should return status 400 when validateCompany fails", done => {
        validation.validateCompany.mockImplementation(() => false);

        stockController.addCompany(testStockData.symbol, testStockData.company)
            .then(response => {
                const { status } = response;

                expect(status).toBe(400);
                done();
            });
	});

    it("should return status 409 when createStock fails", done => {
        stockData.createStock.mockImplementation(() => false);

        stockController.addCompany(testStockData.symbol, testStockData.company)
            .then(response => {
                const { status } = response;

                expect(status).toBe(409);
                done();
            });
	});
});

describe("editCompany", () => {
    it("should return status 200 when editStock succeeds", done => {
        stockController.editCompany(testStockData.symbol, testStockData.company)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
	});

    it("should return body of stock model when editStock succeeds", done => {
        stockController.editCompany(testStockData.symbol, testStockData.company)
            .then(response => {
                const { body } = response;

                expect(body).toBe(testStockData);
                done();
            });
	});
    
    it("should return status 400 when validateCompany fails", done => {
        validation.validateCompany.mockImplementation(() => false);

        stockController.editCompany(testStockData.symbol, testStockData.company)
            .then(response => {
                const { status } = response;

                expect(status).toBe(400);
                done();
            });
	});

    it("should return status 404 when editStock fails", done => {
        stockData.editStock.mockImplementation(() => false);

        stockController.editCompany(testStockData.symbol, testStockData.company)
            .then(response => {
                const { status } = response;

                expect(status).toBe(404);
                done();
            });
	});
});

describe("deleteCompany", () => {
    it("should return status 200 when removeStock succeeds", done => {
        stockController.deleteCompany(testStockData.symbol)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
	});

    it("should return body of stock model when removeStock succeeds", done => {
        stockController.deleteCompany(testStockData.symbol)
            .then(response => {
                const { body } = response;

                expect(body).toBe(testStockData);
                done();
            });
	});

    it("should return status 404 when removeStock fails", done => {
        stockData.removeStock.mockImplementation(() => false);

        stockController.deleteCompany(testStockData.symbol)
            .then(response => {
                const { status } = response;

                expect(status).toBe(404);
                done();
            });
	});
});