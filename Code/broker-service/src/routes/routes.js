import { parseJwt } from "microservice-util";
import accountController from "../controllers/accountController";
import transactionController from "../controllers/transactionController";

const routes = app => {
    app.route('/account')
        .get((req, res, next) => {
            const { authorization } = req.headers;
            const userId = parseJwt(authorization).id;

            accountController.get(userId, authorization)
                .then(({status, body}) => {
                    return res.status(status).json(body);
                })
                .catch(err => { next(err) });
        });
    
    app.route('/account/:symbol')
        .get((req, res, next) => {
            const { authorization } = req.headers;
            const userId = parseJwt(authorization).id;

            const { symbol } = req.params;

            accountController.shares(userId, symbol)
                .then(({status, body}) => {
                    return res.status(status).json(body);
                })
                .catch(err => { next(err) });
        });
    
    app.route('/transactions')
        .get((req, res, next) => {
            const { authorization } = req.headers;
            const userId = parseJwt(authorization).id;

            transactionController.get(userId)
                .then(({status, body}) => {
                    return res.status(status).json(body);
                })
                .catch(err => { next(err) });
        });

    app.route('/buy')
        .post((req, res, next) => {
            const userId = parseJwt(req.headers.authorization).id;
            const { symbol } = req.body;
            const amount = parseInt(req.body.amount);

            transactionController.buy(userId, symbol, amount)
                .then(({status, body}) => {
                    return res.status(status).json(body);
                })
                .catch(err => { next(err) });
        });
    
    app.route('/sell')
        .post((req, res, next) => {
            const userId = parseJwt(req.headers.authorization).id;
            const { symbol } = req.body;
            const amount = parseInt(req.body.amount);
            
            transactionController.sell(userId, symbol, amount)
                .then(({status, body}) => {
                    return res.status(status).json(body);
                })
                .catch(err => { next(err) });
        });
}

export default routes;