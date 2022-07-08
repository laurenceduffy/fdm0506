import { Transaction, transactionTypes } from './transactionModel';
import { getPosition } from './positionData';
import Position from './positionModel';
import { callService } from 'microservice-util';

const stockService = 'stock-service';

const getAllTransactions = async (userId) => {
    const transactionData = await Transaction.find({userId: userId}).exec();

    const transactions = transactionData.map((t) => {
        const { stock, amount, price, type, timestamp } = t;
        return {
            stock, amount, price, type, timestamp
        };
    });

    return transactions.reverse();
};

const performBuyTransaction = async (account, symbol, amount) => {
    const stockResponse = await callService(stockService, { url: `stock/${symbol}`, method: 'get' })

    if(stockResponse.status !== 200) return false;

    const transactionPrice = stockResponse.data.values.close;

    const transaction = new Transaction({
        userId: account.userId,
        stock: symbol,
        amount,
        price: transactionPrice,
        type: transactionTypes.buy
    });

    transaction.save();

    account.availableFunds -= transactionPrice * amount;
    account.save();

    let position = await getPosition(account.userId, symbol, false);
    
    if(!position) {
        position = new Position({
            userId: account.userId,
            stock: symbol,
            amount,
            totalCost: transaction.price * amount,
            avgPrice: transaction.price,
            open: true
        });
    } else if(position.open) {
        position.amount += amount;
        position.totalCost += transaction.price * amount;
        position.avgPrice = position.totalCost / position.amount;
    } else {
        position.amount = amount;
        position.totalCost = transaction.price * amount;
        position.avgPrice = transaction.price;
        position.open = true;
    }

    position.save();

    return true;
}

const performSellTransaction = async (account, symbol, amount) => {
    let position = await getPosition(account.userId, symbol);
        
    if(!position) return false;

    const stockResponse = await callService(stockService, { url: `stock/${symbol}`, method: 'get' })

    if(stockResponse.status !== 200) return false;

    const transactionPrice = stockResponse.data.values.close;

    position.amount -= amount;
    position.totalCost -= amount * transactionPrice;
    
    if(position.amount <= 0) {
        position.open = false
    }

    position.save();

    const transaction = new Transaction({
        userId: account.userId,
        stock: symbol,
        amount,
        price: transactionPrice,
        type: transactionTypes.sell
    });
    
    transaction.save();

    account.availableFunds += transactionPrice * amount;
    account.save();

    return true;
}

export { getAllTransactions, performBuyTransaction, performSellTransaction };