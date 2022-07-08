import { http } from 'microservice-util';
import { getUserAccount } from '../data/accountData';
import { getAllTransactions, performBuyTransaction, performSellTransaction } from '../data/transactionData';
import { transactionErrors as errors, accountErrors } from './errors';

class TransactionController {
    constructor() {
        console.log('TransactionController initialised');
    }

    get = async(userId) => {
        const transactions = await getAllTransactions(userId);

        return http.ok(transactions);
    }

    buy = async(userId, symbol, amount) => {
        const account = await getUserAccount(userId);

        if(!account) return http.forbidden(accountErrors.accountNotVerified);

        const success = await performBuyTransaction(account, symbol, amount);

        if(!success) return http.forbidden(errors.buyTransactionFailed);

        return http.ok();
    }

    sell = async(userId, symbol, amount) => {
        const account = await getUserAccount(userId);

        if(!account) return http.forbidden(accountErrors.accountNotVerified);

        const success = await performSellTransaction(account, symbol, amount);

        if(!success) return http.forbidden(errors.sellTransactionFailed);

        return http.ok();
    }
}

export default new TransactionController();