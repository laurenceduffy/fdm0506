import axios from 'axios';
import { brokerAccount } from './account';

const get = async (token) => {
    const requestOptions = {
        url: 'http://localhost:3333/transactions',
        method: 'get',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const result = await axios(requestOptions)
        .then(data => {
            const body = data.data;
            return body;
        })
        .catch(err => {
            const errType = String(err.response.status).charAt(0);
            const errMsg = errType === "400" ? err.response.data.error : "";

            console.log(errMsg);
            return [];
        });
    
    return result;
}

const buy = async (token, symbol, amount) => {
    const requestOptions = {
        url: 'http://localhost:3333/buy',
        method: 'post',
        data: {
            symbol,
            amount
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    await axios(requestOptions)
        .then(data => {
            const body = data.data;
            brokerAccount.reset();
        })
        .catch(err => {
            const errType = String(err.response.status).charAt(0);
            const errMsg = errType === "400" ? err.response.data.error : "";

            console.log(errMsg);
        });
}

const sell = async (token, symbol, amount) => {
    const requestOptions = {
        url: 'http://localhost:3333/sell',
        method: 'post',
        data: {
            symbol,
            amount
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    console.log(requestOptions.data)

    await axios(requestOptions)
        .then(data => {
            const body = data.data;
            brokerAccount.reset();
        })
        .catch(err => {
            const errType = String(err.response.status).charAt(0);
            const errMsg = errType === "400" ? err.response.data.error : "";

            console.log(errMsg);
        });
}

export { buy, sell, get }