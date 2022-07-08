import Stock from './src/models/stockModel';
import dotenv from 'dotenv';

const result = dotenv.config()

if (result.error) {
    throw result.error;
}

const createMockData = () => {
    var stock = new Stock({ symbol:'AAA', company:'Company A'});
    stock.save();
};

const resetDatabase = async () => {
    await Stock.deleteMany({});
}

export { createMockData, resetDatabase };