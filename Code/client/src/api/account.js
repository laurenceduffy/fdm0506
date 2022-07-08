import axios from 'axios';
import Cache from '../caching/cache';

const brokerAccount = new Cache();
const accountShares = new Cache();

const getBrokerAccount = async(token) => {
    if(brokerAccount.data !== undefined && brokerAccount.alive) {
        return brokerAccount.data;
    } else {
        const requestOptions = {
            url: 'http://localhost:3333/account',
            method: 'get',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    
        return await axios(requestOptions)
            .then(data => {
    
                brokerAccount.data = data.data;
                brokerAccount.age = 0;
                return data.data;
            })
            .catch(err => {
                return brokerAccount.data;
            });
    }
}

const getAccountShares = async(token, symbol) => {
    if(accountShares.data !== undefined && accountShares.alive && accountShares.data[symbol]) {
        return accountShares.data[symbol];
    } else {
        const requestOptions = {
            url: `http://localhost:3333/account/${symbol}`,
            method: 'get',
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    
        return await axios(requestOptions)
            .then(data => {
                if(accountShares.data === undefined) {
                    accountShares.data = {};
                }

                accountShares.data[symbol] = data.data;
                accountShares.age = 0;
                return data.data;
            })
            .catch(err => {
                return accountShares.data;
            });
    }
}

export { brokerAccount, getBrokerAccount, accountShares, getAccountShares };