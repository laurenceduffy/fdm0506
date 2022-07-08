import {initStockPrices, getLastTradingTick, getStockPrices as stockPrices} from "./priceGen";

const prices = {};

const getStockPrices = async (symbol) => {
    if(!prices[symbol]) {
        prices[symbol] = await initStockPrices(symbol);
    }

    return prices[symbol];
}

const updateStockPrices = async (symbol) => {
    const latestPrice = prices[symbol].prices.at(-1);
    const latestRequired = getLastTradingTick();
    latestRequired.setMinutes(Math.floor(latestRequired.getMinutes() / 5) * 5); // round down to nearest 5 minutes
    latestRequired.setSeconds(0);
    latestRequired.setMilliseconds(0);

    const latestActual = latestPrice.datetime;
    
    if(latestRequired > latestActual) {
        const [latestPrices,newPrices] = await stockPrices(symbol, latestPrice.value, latestActual, latestRequired)
        prices[symbol].prices = prices[symbol].prices.concat(newPrices.slice(1));
        
        prices[symbol].open = latestPrices.open;
        prices[symbol].high = latestPrices.high;
        prices[symbol].low = latestPrices.low;
        prices[symbol].close = latestPrices.close;
        prices[symbol].gains = latestPrices.gains;
        prices[symbol].volume = latestPrices.volume;
    }
}

export { getStockPrices, updateStockPrices };