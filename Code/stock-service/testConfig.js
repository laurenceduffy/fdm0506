import Stock from './src/data/stockModel';
import dotenv from 'dotenv';

const result = dotenv.config()

if (result.error) {
    throw result.error;
}

const createMockData = async () => {
    const testStocks = [
        {symbol: 'AAA', company: 'Company A'},
        {symbol: 'BBB', company: 'Company B'},
        {symbol: 'CCC', company: 'Company C'},
        {symbol: 'DDD', company: 'Company D'}
    ];

    testStocks.forEach(async (stock) => {
        const stockModel = new Stock(stock);
        await stockModel.save();
    });

    return testStocks;
};

const resetDatabase = async () => {
    await Stock.deleteMany({});
}

export { createMockData, resetDatabase };