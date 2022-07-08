import reportingController from '../controllers/reportingController';
import { removeTmpFile } from '../writers/fileWriter';
import { parseJwt } from 'microservice-util';

const routes = app => {
    app.route('/stocks')
        .post((req, res, next) => {
            const { fileType, order, symbols } = req.body;

            reportingController.getStockReport(fileType, order, symbols)
                .then(({status, body}) => {
                    if(status !== 200) {
                        return res.status(status).json(body);
                    } else {
                        const file = body;
                        res.download(file, err => {
                            if(err) {
                                console.log(err);
                                return;
                            }
                
                            removeTmpFile(file);
                        });
                    }
                })
                .catch(err => { next(err) });
        });

    app.route('/user')
        .post((req, res, next) => {
            const { authorization } = req.headers;
            const userId = parseJwt(authorization).id;
            const { fileType, order } = req.body;

            reportingController.getUserReport(authorization, userId, fileType, order)
                .then(({status, body}) => {
                    if(status !== 200) {
                        return res.status(status).json(body);
                    } else {
                        const file = body;
                        res.download(file, err => {
                            if(err) {
                                console.log(err);
                                return;
                            }
                
                            removeTmpFile(file);
                        });
                    }
                })
                .catch(err => { next(err) });
        });
}

export default routes;