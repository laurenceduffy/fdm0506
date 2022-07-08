import * as serviceData from "../data/serviceData";
import reportingController from "./reportingController";
import * as fileWriter from "../writers/fileWriter";

//#region : test data
const directory = 'directory/';
const filepath = 'filepath';

global.__basedir = directory;

const fileTypeCsv = 'csv';

const testJwt = "test.authtoken.1234";

const testUserId = 1;

const symbols = ['AAA', 'BBB'];

const sortAsc = 'asc';

const stockPriceData = {
    AAA: {
        company: 'Company A',
        values: {
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
                    datetime: "2021-11-06T08:00:00.000Z"
                },
                {
                    value: 522.74,
                    volume: 790183639,
                    gains: 0.192,
                    datetime: "2021-11-06T08:05:00.000Z"
                },
                {
                    value: 523.54,
                    volume: 935310135,
                    gains: 0.153,
                    datetime: "2021-11-06T08:10:00.000Z"
                }
            ]
        }
    },
    BBB: {
        company: 'Company B',
        values: {
            open: 600.26,
            high: 500.16,
            low: 650.26,
            close: 650.4,
            gains: 0.755,
            volume: 31835879224,
            prices: [
                {
                    value: 521.74,
                    volume: 842783679,
                    gains: -0.131,
                    datetime: "2021-11-06T08:00:00.000Z"
                },
                {
                    value: 522.74,
                    volume: 790183639,
                    gains: 0.192,
                    datetime: "2021-11-06T08:05:00.000Z"
                },
                {
                    value: 523.54,
                    volume: 935310135,
                    gains: 0.153,
                    datetime: "2021-11-06T08:10:00.000Z"
                }
            ]
        }
    }
}

const testBrokerAccount = {
    AAA: {
        amount: 1
    },
    BBB : {
        amount: 2
    }
}

//#endregion

//#region : test setup

beforeAll(() => {
    serviceData.getCompanySymbols = jest.fn();
    serviceData.getCompanySymbols.mockImplementation(async() => symbols);

    serviceData.getStockPriceData = jest.fn();
    serviceData.getStockPriceData.mockImplementation(async(symbol) => stockPriceData[symbol]);

    fileWriter.write = jest.fn();
    fileWriter.write.mockImplementation(() => filepath);
});
  
afterAll(() => {
    
});

beforeEach(() => {
    serviceData.getBrokerAccountPosition = jest.fn();
    serviceData.getBrokerAccountPosition.mockImplementation(async(token, symbol) => {
        if(token === testJwt) {
            return testBrokerAccount[symbol];
        } else {
            return null;
        }
    });
});

afterEach(() => {
	
});

//#endregion

describe('getStockReport', () => {
    it('should return status 400 when provided with an empty list of symbols', done => {
        reportingController.getStockReport(fileTypeCsv, sortAsc, [])
            .then(response => {
                const { status } = response

                expect(status).toBe(400);
                done();
            });
    });

    it('should call getCompanySymbols when no symbols are given', done => {
        serviceData.getCompanySymbols.mockImplementationOnce(async() => []);
        
        reportingController.getStockReport(fileTypeCsv, sortAsc)
            .then(response => {
                expect(serviceData.getCompanySymbols).toHaveBeenCalled();
                done();
            });
    });

    it('should return status 502 when getCompanySymbols returns an empty list of symbols', done => {
        serviceData.getCompanySymbols.mockImplementationOnce(async() => []);

        reportingController.getStockReport(fileTypeCsv, sortAsc)
            .then(response => {
                const { status } = response

                expect(status).toBe(502);
                done();
            });
    });

    it('should return status 502 when getCompanySymbols returns null', done => {
        serviceData.getCompanySymbols.mockImplementationOnce(async() => null);

        reportingController.getStockReport(fileTypeCsv, sortAsc)
            .then(response => {
                const { status } = response

                expect(status).toBe(502);
                done();
            });
    });

    it('should return status 400 when given file type is not xml or csv', done => {
        reportingController.getStockReport('txt', sortAsc, symbols)
            .then(response => {
                const { status } = response

                expect(status).toBe(400);
                done();
            });
    });

    it('should return status 400 when given sort order is not asc or dsc', done => {
        reportingController.getStockReport(fileTypeCsv, 'low to high', symbols)
            .then(response => {
                const { status } = response

                expect(status).toBe(400);
                done();
            });
    });

    it('should return status 502 when getStockPriceData returns null', done => {
        serviceData.getStockPriceData.mockImplementationOnce(async() => null);

        reportingController.getStockReport(fileTypeCsv, sortAsc, symbols)
            .then(response => {
                const { status } = response

                expect(status).toBe(502);
                done();
            });
    });

    it('should call write when getStockPriceData calls are successful', done => {
        reportingController.getStockReport(fileTypeCsv, sortAsc, symbols)
            .then(response => {
                expect(fileWriter.write).toHaveBeenCalled();
                done();
            });
    });

    it('should return status 200 when write returns a filepath', done => {
        reportingController.getStockReport(fileTypeCsv, sortAsc, symbols)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
    });

    it('should return body containing the full filepath when write returns a filepath', done => {
        reportingController.getStockReport(fileTypeCsv, sortAsc, symbols)
            .then(response => {
                const { body } = response;

                expect(body).toBe(`${directory}${filepath}`);
                done();
            });
    });

    it('should return status 500 when write returns null', done => {
        fileWriter.write.mockImplementationOnce(() => null);

        reportingController.getStockReport(fileTypeCsv, sortAsc, symbols)
            .then(response => {
                const { status } = response;

                expect(status).toBe(500);
                done();
            });
    });
});

describe('getUserReport', () => {
    it('should return status 401 when no userId is passed', done => {
        reportingController.getUserReport(testJwt, null, fileTypeCsv, sortAsc)
            .then(response => {
                const { status } = response;

                expect(status).toBe(401);
                done();
            });
    });

    it('should return status 400 when file type is not xml or csv', done => {
        reportingController.getUserReport(testJwt, testUserId, 'txt', sortAsc)
            .then(response => {
                const { status } = response;

                expect(status).toBe(400);
                done();
            });
    });

    it('should return status 400 when sort order is not asc or dsc', done => {
        reportingController.getUserReport(testJwt, testUserId, fileTypeCsv, 'high to low')
            .then(response => {
                const { status } = response;

                expect(status).toBe(400);
                done();
            });
    });

    it('should return status 502 when getCompanySymbols returns an empty list', done => {
        serviceData.getCompanySymbols.mockImplementationOnce(async() => []);
        
        reportingController.getUserReport(testJwt, testUserId, fileTypeCsv, sortAsc)
            .then(response => {
                const { status } = response;

                expect(status).toBe(502);
                done();
            });
    });

    it('should return status 502 when getCompanySymbols returns null', done => {
        serviceData.getCompanySymbols.mockImplementationOnce(async() => null);

        reportingController.getUserReport(testJwt, testUserId, fileTypeCsv, sortAsc)
            .then(response => {
                const { status } = response;

                expect(status).toBe(502);
                done();
            });
    });

    it('should return status 502 when getStockPriceData returns null', done => {
        serviceData.getStockPriceData.mockImplementationOnce(async () => null);

        reportingController.getUserReport(testJwt, testUserId, fileTypeCsv, sortAsc)
            .then(response => {
                const { status } = response;

                expect(status).toBe(502);
                done();
            });
    });

    it('should return status 404 when getBrokerAccountPosition returns null', done => {
        serviceData.getBrokerAccountPosition.mockImplementation(async () => null);

        reportingController.getUserReport(testJwt, testUserId, fileTypeCsv, sortAsc)
            .then(response => {
                const { status } = response;

                expect(status).toBe(404);
                done();
            });
    });

    it('should return status 200 when write returns a filepath', done => {
        reportingController.getUserReport(testJwt, testUserId, fileTypeCsv, sortAsc)
            .then(response => {
                const { status } = response;

                expect(status).toBe(200);
                done();
            });
    });

    it('should return body containing the full filepath when write returns a filepath', done => {
        reportingController.getUserReport(testJwt, testUserId, fileTypeCsv, sortAsc)
            .then(response => {
                const { body } = response;

                expect(body).toBe(`${directory}${filepath}`);
                done();
            });
    });

    it('should return status 500 when write returns null', done => {
        fileWriter.write.mockImplementationOnce(() => null);

        reportingController.getUserReport(testJwt, testUserId, fileTypeCsv, sortAsc)
            .then(response => {
                const { status } = response;

                expect(status).toBe(500);
                done();
            });
    });
});