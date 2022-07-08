import axios from "axios";

const getStockData = async (symbol) => {
    const requestOptions = {
        url: `http://localhost:3333/stock/${symbol}`,
        method: 'get'
    }
    
    let details = null;

    await axios(requestOptions)
        .then(data => {
            if(data.data) {
                details =  data.data;
            } else {
                // body was not returned, maybe try again
                console.log('body not returned');
            }
        })
        .catch(err => {
            // error thrown by server
            console.log('error');
        });
    
        return details;
}

const getAllSymbols = async () => {
    const requestOptions = {
        url: 'http://localhost:3333/companies',
        method: 'get'
    }

    let symbols = [];
    
    await axios(requestOptions)
        .then(data => {
            if(data.data.companies) {
                symbols = data.data.companies;
            } else {
                // body was not returned, maybe try again
                console.log('body not returned');
            }
        })
        .catch(err => {
            // error thrown by server
            console.log('error');
        });
    
    return symbols;
}

const addStock = async (token, symbol, company) => {
    const requestOptions = {
        url: 'http://localhost:3333/companies',
        method: 'post',
        data: {symbol, company},
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    return await axios(requestOptions)
        .then(data => {
            if(data.status === 200) {
                return true;
            } else {
                return {error: 'Something went wrong please try again later.'};
            }
        })
        .catch(err => {
            return {error: err.response.data.error};
        });
}

const editStock = async (token, symbol, company) => {
    const requestOptions = {
        url: 'http://localhost:3333/companies',
        method: 'put',
        data: {symbol, company},
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    return await axios(requestOptions)
        .then(data => {
            if(data.status === 200) {
                return true;
            } else {
                return {error: 'Something went wrong please try again later.'};
            }
        })
        .catch(err => {
            return {error: err.response.data.error};
        });
}

const deleteStock = async (token, symbol) => {
    const requestOptions = {
        url: 'http://localhost:3333/companies',
        method: 'delete',
        data: {symbol},
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    return await axios(requestOptions)
        .then(data => {
            if(data.status === 200) {
                return true;
            } else {
                return {error: 'Something went wrong please try again later.'};
            }
        })
        .catch(err => {
            return {error: err.response.data.error};
        });
}

export {getAllSymbols, getStockData, addStock, editStock, deleteStock};