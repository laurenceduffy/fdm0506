import random from "random";
import seedrandom from "seedrandom";
import moment from "moment";
import { updateStockPrices } from "./priceData";

const startDate = new Date('2022-03-06');
let allDates = [];

const maxValue = 550;
const minValue = 5;
const maxVolume = 1000000000;
const minVolume = 2000000;

const tradingHours = {
    open: {
        hours: 8,
        mins: 0
    },
    close: {
        hours: 16,
        mins: 30
    }
}

function roundTo(n, digits) {
    if (digits === undefined) {
        digits = 0;
    }

    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    var test =(Math.round(n) / multiplicator);
    return +(test.toFixed(digits));
}

const initStockPrices = async (symbol) => {
    const now = new Date();

    random.use(seedrandom(symbol + startDate));
    const rng = random.clone();

    const initialValue = roundTo(rng.float(minValue, maxValue), 2);

    const [latest, prices] = await getStockPrices(symbol, initialValue, startDate, now);

    const latestTime = prices.at(-1).datetime;
    
    const refreshInterval = 300000 // 5 mins
    const msToNextTick = refreshInterval - (now - latestTime);

    setTimeout(() => {
        updateStockPrices(symbol);

        setInterval(() => {
            updateStockPrices(symbol);
        }, refreshInterval)
    }, msToNextTick);

    return {
        open: latest.open,
        high: latest.high,
        low: latest.low,
        close: latest.close,
        gains: latest.gains,
        volume: latest.volume,
        prices
    };
}

const getStockPrices = async (symbol, initialValue, fromDate, toDate) => {
    const history = await getPriceHistory(symbol, initialValue, fromDate, toDate);

    const latest = history[allDates.at(-1)];

    const pricesArray = allDates.map(date => {
        return history[date].prices;
    })

    var prices = [].concat(...pricesArray)

    return [latest, prices];
}

const getPriceHistory = async (symbol, initialValue, fromDate, toDate) => {
    allDates = [];
    let dateCursor = fromDate;
    
    let history = {};

    let previousClose = initialValue;

    while(dateCursor <= toDate) {
        if(dateCursor.getHours() < tradingHours.open.hours) dateCursor.setHours(tradingHours.open.hours);

        if(dateCursor.getDay() === 0 || dateCursor.getDay() === 6) {
            dateCursor = moment(dateCursor).add(1, 'd').toDate();
            continue;
        }

        const key = dateCursor.toISOString().split('T')[0];
        history[key] = await getDaysPrices(symbol, dateCursor, previousClose, toDate);
        previousClose = history[key].close;

        if(!allDates.includes(key)) allDates.push(key);

        dateCursor = moment(dateCursor).add(1, 'd').toDate();
    }

    return history;
}

const getDaysPrices = async (symbol, dateCursor, previousClose, toDate) => {
    let timeCursor = new Date(dateCursor);
    let closeTime = new Date(timeCursor);

    if(isToday(dateCursor) && isWithinTradingHours(toDate)) {
        closeTime.setHours(toDate.getHours())
        closeTime.setMinutes(toDate.getMinutes())
    } else {
        closeTime.setHours(tradingHours.close.hours);
        closeTime.setMinutes(tradingHours.close.mins);
    }

    let day = {
        open: previousClose,
        high: previousClose,
        low: previousClose,
        close: previousClose,
        gains: 0,
        volume: 0,
        prices: []
    }

    while(timeCursor <= closeTime) {
        let priceDetails = await tick(
            symbol,
            previousClose,
            timeCursor,
            timeCursor.getHours() === tradingHours.open.hours && timeCursor.getMinutes() === tradingHours.open.mins);

        day.volume += priceDetails.volume;
        day.prices.push(priceDetails);

        previousClose = priceDetails.value;

        if(previousClose > day.high) {
            day.high = previousClose;
        }
        
        if(previousClose < day.low) {
            day.low = previousClose;
        }

        timeCursor = moment(timeCursor).add(5, 'm').toDate();
    }

    day.close = previousClose;
    const gainsValue = day.close - day.open;
    day.gains = roundTo(gainsValue / day.open * 100, 3);
    return day;
}

const tick = async (symbol, lastValue, datetime, staticTick) => {
    random.use(seedrandom(symbol + datetime));
    const localrng = random.clone();

    random.use(seedrandom(symbol));
    const volatilityRng = random.clone();
    const volatility = volatilityRng.float(0,1);

    const volumeRange = maxVolume - minVolume;
    const volume = Math.round(minVolume + Math.abs(Math.sin(datetime) * volumeRange * 0.5) + (0.5 * volumeRange * localrng.float(0.5,1)));
    const volumeModifier = (volume / maxVolume) * 10;

    const gains = roundTo(localrng.float(-volatility, volatility) * volumeModifier,  3);
    const gainsValue = staticTick ? 0 : lastValue * gains / 100;

    const value = roundTo(lastValue + gainsValue, 2);

    const priceDetails = {
        value,
        volume,
        gains,
        datetime
    };

    return priceDetails;
}

const isToday = (date) => {
    const today = new Date();
    return  date.getDate() == today.getDate() &&
            date.getMonth() == today.getMonth() &&
            date.getFullYear() == today.getFullYear()
}

const isWithinTradingHours = date => {
    const hours = date.getHours() < tradingHours.close.hours + 1;
    const mins = date.getHours() === tradingHours.close.hours ? date.getMinutes() <= tradingHours.close.mins : true;

    return hours && mins;
}

const getLastTradingTick = () => {
    let dateCursor = new Date();

    if(dateCursor.getDay() === 0 || dateCursor.getDay() === 6) {
        const removeDays = dateCursor.getDay() === 0 ? -2 : -1;

        dateCursor = moment(dateCursor).add(removeDays, 'd').toDate();
    } else {
        if(isWithinTradingHours(dateCursor)) {
            return dateCursor;
        }
    }

    dateCursor.setHours(tradingHours.close.hours);
    dateCursor.setMinutes(tradingHours.close.mins);
    dateCursor.setSeconds(0);
    dateCursor.setMilliseconds(0);
    
    return dateCursor;
}

export { initStockPrices, getLastTradingTick, getStockPrices } ;