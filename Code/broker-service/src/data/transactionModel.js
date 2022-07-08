import { dbConnection } from "microservice-util";
const { Schema } = dbConnection;

const transactionTypes = {
    buy: 0,
    sell: 1
}

const transactionSchema = new Schema({
    userId: String,
    stock: String,
    amount: Number,
    price: Number,
    type: Number,
    timestamp: { type: Date, default: Date.now }
  });

const Transaction = dbConnection.model('Transaction', transactionSchema);

export {Transaction, transactionTypes};