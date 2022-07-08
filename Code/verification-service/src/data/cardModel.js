import { dbConnection } from "microservice-util";
const { Schema } = dbConnection;

const cardSchema = new Schema({
    userId: String,
    name: String,
    number: String,
    expiry: String,
    cvv: String
  });

const CardDetails = dbConnection.model('CardDetails', cardSchema);

export default CardDetails;