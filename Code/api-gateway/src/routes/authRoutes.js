import { callService } from 'microservice-util';

const authService = 'auth-service'; 

const authRoutes = app => {
    app.route('/register')
        .post(async (req, res) => {
            const response = await callService(authService, {url:`register`, method: 'post', data: req.body});
            return res.status(response.status).json(response.data);
        });

    app.route('/login')
        .post(async (req, res) => {
            const response = await callService(authService, {url:`login`, method: 'post', data: req.body});
            return res.status(response.status).json(response.data);
        });
    
    app.route('/activate')
        .post(async (req, res) => {
            const response = await callService(authService, {url:`activate`, method: 'post', data: req.body});
            return res.status(response.status).json(response.data);
        });
    
    app.route('/admin')
        .get(async(req, res) => {
            const { authorization } = req.headers;

            const response = await callService(authService, {url:`admin`, method: 'get', headers: { authorization }, data: req.body});
            return res.status(response.status).json(response.data);
        })
    
    app.route('/user')
        .get(async(req, res) => {
            const { authorization } = req.headers;

            const response = await callService(authService, {url:`user`, method: 'get', headers: { authorization }});
            return res.status(response.status).json(response.data);
        })
        .post(async(req, res) => {
            const { authorization } = req.headers;

            const response = await callService(authService, {url:`user`, method: 'post', headers: { authorization }, data: req.body});
            return res.status(response.status).json(response.data);
        })
        .put(async(req, res) => {
            const { authorization } = req.headers;

            const response = await callService(authService, {url:`user`, method: 'put', headers: { authorization }, data: req.body});
            return res.status(response.status).json(response.data);
        })
        .delete(async(req, res) => {
            const { authorization } = req.headers;

            const response = await callService(authService, {url:`user`, method: 'delete', headers: { authorization }, data: req.body});
            return res.status(response.status).json(response.data);
        })
    
    app.route('/deactivate')
        .put(async(req, res) => {
            const { authorization } = req.headers;

            const response = await callService(authService, {url:`deactivate`, method: 'put', headers: { authorization }, data: req.body});
            return res.status(response.status).json(response.data);
        })
    
    app.route('/reactivate')
        .put(async(req, res) => {
            const { authorization } = req.headers;

            const response = await callService(authService, {url:`reactivate`, method: 'put', headers: { authorization }, data: req.body});
            return res.status(response.status).json(response.data);
        })
        .post(async(req, res) => {
            const response = await callService(authService, {url:`reactivate`, method: 'post', data: req.body});
            return res.status(response.status).json(response.data);
        })
    
    app.route('/requests')
        .get(async(req, res) => {
            const { authorization } = req.headers;

            const response = await callService(authService, {url:`requests`, method: 'get', headers: { authorization }});
            return res.status(response.status).json(response.data);
        })
}

export default authRoutes;