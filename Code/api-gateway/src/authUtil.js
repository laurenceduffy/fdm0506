import { callService } from 'microservice-util';

const authService = 'auth-service'; 

const validateToken = async(token) => {   
    const response = await callService(authService, {url: `validate`, method: 'get', headers: { authorization: token }})
        .then(data => {
            return (String(data.status).charAt(0) === "2");
        })
        .catch(err => {
            console.log(err);
            return false;
        });
    
    return response;
}

const validateAdmin = async(token) => {
    const response = await callService(authService, {url: `admin`, method: 'get', headers: { authorization: token }})
    .then(data => {
        return (String(data.status).charAt(0) === "2");
    })
    .catch(err => {
        console.log(err);
        return false;
    });

    return response;
}

const authoriseRoutes = [
    'POST/verify',
    'GET/verify',
    'POST/buy',
    'POST/sell',
    'GET/account',
    'GET/transactions',
    'DELETE/user',
    'GET/user',
    'PUT/user',
    'POST/report/user'
]

const adminRoutes = [
    'POST/companies',
    'PUT/companies',
    'DELETE/companies',
    'POST/user',
    'DELETE/user',
    'PUT/deactivate',
    'PUT/reactivate',
    'GET/requests'
]

export { validateToken, authoriseRoutes, validateAdmin, adminRoutes };