import { callService } from 'microservice-util';

const stockService = 'stock-service'; 

const stockRoutes = app => {
    app.route('/stock/:symbol')
        .get(async (req, res) => {
            const { symbol } = req.params;
            const response = await callService(stockService, {url:`stock/${symbol}`, method: 'get'});
            return res.status(response.status).json(response.data);
        });
    
    app.route('/companies')
        .get(async (req, res) => {
            const response = await callService(stockService, {url:`companies`, method: 'get'});
            return res.status(response.status).json(response.data);
        })
        .post(async (req, res) => {
            const { authorization } = req.headers;

            const response = await callService(stockService, {url:`companies`, method: 'post', headers: { authorization }, data: req.body});
            return res.status(response.status).json(response.data);
        })
        .put(async (req, res) => {
            const { authorization } = req.headers;

            const response = await callService(stockService, {url:`companies`, method: 'put', headers: { authorization }, data: req.body});
            return res.status(response.status).json(response.data);
        })
        .delete(async (req, res) => {
            const { authorization } = req.headers;

            const response = await callService(stockService, {url:`companies`, method: 'delete', headers: { authorization }, data: req.body});
            return res.status(response.status).json(response.data);
        });
}

export default stockRoutes;