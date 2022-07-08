import axios from "axios";

const getCardDetails = async(token) => {
    const requestOptions = {
        url: 'http://localhost:3333/verify',
        method: 'get',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    return await axios(requestOptions);
}

const saveCard = async(token, name, number, expiry, cvv) => {

    const requestOptions = {
        url: 'http://localhost:3333/verify',
        method: 'post',
        data: {name, number, expiry, cvv},
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    
    return await axios(requestOptions);
}

export {getCardDetails, saveCard};