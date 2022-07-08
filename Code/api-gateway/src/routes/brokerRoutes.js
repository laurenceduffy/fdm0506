import { callService } from 'microservice-util';

const brokerService = 'broker-service';

const brokerRoutes = app => {
    app.route('/account')
        .get(async (req, res) => {
            const { authorization } = req.headers;

            const response = await callService(brokerService, {url:`account`, method: 'get', headers: { authorization }});
            return res.status(response.status).json(response.data);
        });
    
    app.route('/account/:symbol')
        .get(async (req, res) => {
            const { authorization } = req.headers;
            const { symbol } = req.params;

            const response = await callService(brokerService, {url:`account/${symbol}`, method: 'get', headers: { authorization }});
            return res.status(response.status).json(response.data);
        });
    
    app.route('/buy')
        .post(async (req, res) => {
            const { authorization } = req.headers;

            const response = await callService(brokerService, {url:`buy`, method: 'post', headers: { authorization }, data: req.body});
            return res.status(response.status).json(response.data);
        });
    
    app.route('/sell')
        .post(async (req, res) => {
            const { authorization } = req.headers;

            const response = await callService(brokerService, {url:`sell`, method: 'post', headers: { authorization }, data: req.body});
            return res.status(response.status).json(response.data);
        });
    
    app.route('/transactions')
        .get(async (req, res) => {
            const { authorization } = req.headers;

            const response = await callService(brokerService, {url:`transactions`, method: 'get', headers: { authorization }});
            return res.status(response.status).json(response.data);
        });
    
}

export default brokerRoutes;