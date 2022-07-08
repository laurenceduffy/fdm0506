import { callService, parseJwt } from "microservice-util";

const getCompanySymbols = async () => {
    return (await callService('stock-service', {url:`companies`, method: 'get'})).data.companies;
}

const getStockPriceData = async (symbol) => {
    return (await callService('stock-service', {url:`stock/${symbol}`, method: 'get'})).data
}

const getBrokerAccountPosition = async (token, symbol) => {
    return (await callService('broker-service', {url:`account/${symbol}`, method: 'get', headers: { authorization: token }})).data;
}

export { getCompanySymbols, getStockPriceData, getBrokerAccountPosition };