import Stock from './stockModel';
import { callService } from 'microservice-util';

const getStockData = async (symbol) => {
    const stock = await Stock.findOne({ symbol: symbol }).exec();

    return stock;
}

const getPriceData = async (symbol) => {
    const prices = await callService('pricing-service', { url: `prices/${symbol}`, method: 'get' });

    return prices.data;
}

const stockExists = async (symbol, company) => {
    const stocks = await Stock.find( { $or:[ {symbol: symbol}, {company: company} ]}, (err,docs) => {
            if(!err) return docs;
        }).exec();

    return stocks.length > 0;
}

const removeStock = async (symbol) => {
    return await Stock.findOneAndDelete({symbol: symbol}).exec();
}

const createStock = async (symbol, company) => {
    if(await stockExists(symbol, company)) return false;

    const stock = new Stock({
        symbol,
        company
    });

    await stock.save();

    return stock;
}

const editStock = async (symbol, fields) => {
    const stock = await getStockData(symbol);
    let edited = false;

    if(!stock || !fields) return false;

    if(fields.company) {
        stock.company = fields.company;
        edited = true;
    }

    if(edited) {
        await stock.save();
        return stock;
    } else {
        return false;
    }
}

const getCompanySymbols = async () => {
    const all = await Stock.find({});

    return all.map(x => x.symbol);
}

export { getStockData, getCompanySymbols, removeStock, createStock, editStock, getPriceData };