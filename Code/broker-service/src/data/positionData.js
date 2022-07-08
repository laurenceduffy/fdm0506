import Position from "./positionModel";
import { callService } from "microservice-util";


const getPosition = async (userId, symbol, open = true) => {
    return await Position.findOne({userId: userId, stock: symbol, open}).exec();
}

const getOpenPositions = async (userId) => {
    return await Position.find({userId: userId, open: true}).exec();
}

const getPortfolioValue = async (userId) => {
    const positions = await getOpenPositions(userId);

    if(!positions) return 0;

    const value = await Promise.all(positions.map(async(p) => {
        const stock = await callService('stock-service', {url:`stock/${p.stock}`, method: 'get'});
        return p.amount * stock.data.values.close;
    }));

    return value.length > 0 ? value.reduce((a, b) => a + b) : 0;
}

export { getPosition, getOpenPositions, getPortfolioValue }