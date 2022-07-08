import { callService } from 'microservice-util';

const verifyService = 'verification-service'; 

const verifyRoutes = app => {
    app.route('/verify')
        .post(async (req, res) => {
            const { authorization } = req.headers;
            
            const response = await callService(verifyService, {url:`verify`, method: 'post', data: req.body, headers: { authorization }});
            return res.status(response.status).json(response.data);
        })
        .get(async (req, res) => {
            const { authorization } = req.headers;

            const response = await callService(verifyService, {url:`verify`, method: 'get', headers: { authorization }});
            return res.status(response.status).json(response.data);
        });
}

export default verifyRoutes;