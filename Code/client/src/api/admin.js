import axios from "axios";

const verifyAdmin = async (token) => {
    const requestOptions = {
        url: 'http://localhost:3333/admin',
        method: 'get',
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    return await axios(requestOptions)
        .then(data => {
            return data.status === 200;
        })
        .catch(err => {
            return false;
        });
}

export { verifyAdmin };