import { dbConnection } from "microservice-util";
const { Schema } = dbConnection;

const stockSchema = new Schema({
    company: String,
    symbol: String
  });

const Stock = dbConnection.model('Stock', stockSchema);

export default Stock;