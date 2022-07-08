import { dbConnection } from "microservice-util";
const { Schema } = dbConnection;

const startingFunds = 50000.00;

const accountSchema = new Schema({
    userId: String,
    availableFunds: { type: Number, startingFunds }
  });

const Account = dbConnection.model('Account', accountSchema);

export default Account;