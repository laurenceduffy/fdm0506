import { dbConnection } from "microservice-util";
const { Schema } = dbConnection;

const positionSchema = new Schema({
    userId: String,
    stock: String,
    amount: Number,
    totalCost: Number,
    avgPrice: Number,
    open: Boolean,
    timestamp: { type: Date, default: Date.now }
  });

const Position = dbConnection.model('Position', positionSchema);

export default Position;