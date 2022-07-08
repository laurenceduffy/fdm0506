import { callService } from 'microservice-util';

const reportingService = 'reporting-service'; 

const reportingRoutes = app => {
    app.route('/report/stocks')
        .post(async (req, res) => {
            const response = await callService(reportingService, {url:`stocks`, method: 'post', data: req.body});

            try {
                res.set('Content-Disposition', response.headers['content-disposition']);
                res.set('Content-Type', response.headers['content-type']);

                return res.send(response.data);
            } catch {
                return res.status(response.status).json(response.data);
            }
        });

    app.route('/report/user')
        .post(async (req, res) => {
            const { authorization } = req.headers;

            const response = await callService(reportingService, {url:`user`, method: 'post', data: req.body, headers: { authorization }});
            
            try {
                res.set('Content-Disposition', response.headers['content-disposition']);
                res.set('Content-Type', response.headers['content-type']);

                return res.send(response.data);
            } catch {
                return res.status(response.status).json(response.data);
            }
        });
}

export default reportingRoutes;