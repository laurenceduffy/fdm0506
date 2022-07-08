import { http } from 'microservice-util';
import { getBrokerAccountPosition, getCompanySymbols, getStockPriceData } from '../data/serviceData';
import { write } from '../writers/fileWriter';
import { reportingErrors as errors } from './errors';

class ReportingController {
    constructor() {
        console.log('ReportingController initialised');
    }

    getStockReport = async (fileType, order, symbols) => {
        if(!symbols) {
            symbols = await getCompanySymbols();

            if(!symbols || symbols.length === 0) return http.badGateway(errors.cannotRetrieveSymbols);
        } else if(symbols?.length === 0) {
            return http.badRequest(errors.noSymbols);
        } 

        fileType = fileType.toLowerCase();
        if(fileType !== 'csv' && fileType !== 'xml') return http.badRequest(errors.noFileType);

        order = order.toLowerCase();
        if(order !== 'asc' && order !== 'dsc') return http.badRequest(errors.noSortOrder);

        const reportData = [];
        let serviceFailure = false;

        for (let i = 0; i < symbols.length; i++) {
            const symbol = symbols[i];
            const stockData = await getStockPriceData(symbol);

            if(!stockData) {
                serviceFailure = true;
                break;
            }

            const name = stockData.company;
            const value = stockData.values.close;
            const volume = stockData.values.volume;
            const gains = stockData.values.gains;

            reportData.push({
                symbol,
                name,
                value,
                volume,
                gains
            });
        }

        if(serviceFailure) return http.badGateway(errors.serviceFailure);

        reportData.sort((a,b) => {
            if(order === 'asc') {
                if(a.symbol < b.symbol) {
                    return -1;
                }
    
                return 1;
            } else {
                if(a.symbol < b.symbol) {
                    return 1;
                }
    
                return -1;
            }
        });

        const filename = write(reportData, fileType);
        
        if(!filename) {
            return http.internalServerError(errors.writeToFileFailure);
        }

        const file = __basedir.replaceAll('\\', '/') + filename;

        return http.ok(file);
    }

    getUserReport = async (token, userId, fileType, order) => {
        if(!userId) return http.unauthorized(errors.invalidToken);

        fileType = fileType.toLowerCase();
        if(fileType !== 'csv' && fileType !== 'xml') return http.badRequest(errors.noFileType);

        order = order.toLowerCase();
        if(order !== 'asc' && order !== 'dsc') return http.badRequest(errors.noSortOrder);
        
        const symbols = await getCompanySymbols();
        if(!symbols || symbols.length === 0) return http.badGateway(errors.cannotRetrieveSymbols);

        const reportData = [];
        let serviceFailure = false;

        for (let i = 0; i < symbols.length; i++) {
            const symbol = symbols[i];
            
            const accountData = await getBrokerAccountPosition(token, symbol);
            
            if(!accountData || !accountData.amount || accountData.amount === 0) {
                continue;
            }

            const stockData = await getStockPriceData(symbol);
        
            if(!stockData) {
                serviceFailure = true;
                break;
            }

            const name = stockData.company;
            const value = stockData.values.close;
            const volume = stockData.values.volume;
            const gains = stockData.values.gains;

            reportData.push({
                symbol,
                name,
                value,
                volume,
                gains
            });
        }

        if(serviceFailure) return http.badGateway(errors.serviceFailure);
        if(reportData.length === 0) return http.notFound(errors.noPositionFound);

        reportData.sort((a,b) => {
            if(order === 'asc') {
                if(a.value < b.value) {
                    return -1;
                }
    
                return 1;
            } else {
                if(a.value < b.value) {
                    return 1;
                }
    
                return -1;
            }
        });

        const filename = write(reportData, fileType);
        
        if(!filename) {
            return http.internalServerError(errors.writeToFileFailure);
        }

        const file = __basedir.replaceAll('\\', '/') + filename;

        return http.ok(file);
    }
}

export default new ReportingController();