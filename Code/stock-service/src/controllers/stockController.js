import { validateCompany, validateSymbol } from "../data/validation";
import { editStock, getCompanySymbols, getStockData, removeStock, getPriceData, createStock } from "../data/stockData";
import { http } from "microservice-util";
import { stockErrors as errors } from "./errors";

class StockController {
    constructor() {
        console.log('StockController initialised');
    }

    stock = async(symbol) => {
        const details = await getStockData(symbol);
        if(!details) return http.notFound(errors.stockNotFound);

        const prices = await getPriceData(symbol);

        return http.ok({
            symbol: details.symbol,
            company: details.company,
            values: prices ? prices : null
        });
    };

    companies = async() => {
        const companies = await getCompanySymbols();
        if(!companies || companies.length === 0) return http.notFound(errors.stockNotFound);

        return http.ok({companies});
    };

    addCompany = async(symbol, company) => {
        symbol = validateSymbol(symbol);
        company = validateCompany(company);

        if(!symbol) return http.badRequest(errors.invalidSymbol);
        if(!company) return http.badRequest(errors.invalidCompany);

        const createdStock = await createStock(symbol, company);

        if(!createdStock) {
            return http.conflict(errors.stockExists);
        } else {
            return http.ok(createdStock);
        }
    }

    editCompany = async(symbol, company) => {
        symbol = validateSymbol(symbol);
        company = validateCompany(company);

        if(!company) return http.badRequest(errors.invalidCompany);

        const stock = await editStock(symbol, {company})

        if(!stock) {
            return http.notFound(errors.stockNotFound);
        } else {
            return http.ok(stock);
        }
    }

    deleteCompany = async(symbol) => {
        symbol = validateSymbol(symbol);

        const stock = await removeStock(symbol);

        if(!stock) {
            return http.notFound(errors.stockNotFound);
        } else {
            return http.ok(stock);
        }
    }
}

export default new StockController();