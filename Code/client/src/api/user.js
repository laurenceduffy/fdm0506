import axios from "axios";

const getDetails = async(token, user) => {
    const requestOptions = {
        url: 'http://localhost:3333/user',
        method: 'post',
        data: { user },
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    return await axios(requestOptions);
}

const getDetailsFromToken = async(token) => {
    const requestOptions = {
        url: 'http://localhost:3333/user',
        method: 'get',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    return await axios(requestOptions);
}

const updateUserDetails = async(token, body) => {
    const requestOptions = {
        url: 'http://localhost:3333/user',
        method: 'put',
        data: body,
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    return await axios(requestOptions);
}

const deactivateUser = async(token, email, datetime, reason) => {
    const requestOptions = {
        url: 'http://localhost:3333/deactivate',
        method: 'put',
        data: { email, datetime, reason },
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    return await axios(requestOptions);
}

const reactivateUser = async(token, email) => {
    const requestOptions = {
        url: 'http://localhost:3333/reactivate',
        method: 'put',
        data: { email },
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    return await axios(requestOptions);
}

const requestReactivateUser = async(email) => {
    const requestOptions = {
        url: 'http://localhost:3333/reactivate',
        method: 'post',
        data: { email }
    }

    return await axios(requestOptions);
}

const userRequests = async(token) => {
    const requestOptions = {
        url: 'http://localhost:3333/requests',
        method: 'get',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    return await axios(requestOptions);
}

const deleteUser = async(token, email) => {
    const requestOptions = {
        url: 'http://localhost:3333/user',
        method: 'delete',
        data: { email },
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    return await axios(requestOptions);
}



export {getDetails, getDetailsFromToken, updateUserDetails, deactivateUser, reactivateUser, requestReactivateUser, userRequests, deleteUser}