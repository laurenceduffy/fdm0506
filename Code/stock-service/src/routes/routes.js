import stockController from '../controllers/stockController';

const routes = app => {
    app.route('/stock/:symbol')
        .get((req, res, next) => {
            const { symbol } = req.params;

            stockController.stock(symbol)
                .then(({status, body}) => {
                    return res.status(status).json(body);
                })
                .catch(err => { next(err) });
        });
    
    app.route('/companies')
        .get(async (req, res, next) => {
            stockController.companies()
                .then(({status, body}) => {
                    return res.status(status).json(body);
                })
                .catch(err => { next(err) });
        })
        .post((req, res, next) => {
            const { symbol, company } = req.body;

            stockController.addCompany(symbol, company)
                .then(({status, body}) => {
                    return res.status(status).json(body);
                })
                .catch(err => { next(err) });
        })
        .put((req, res, next) => {
            const { symbol, company } = req.body;
            
            stockController.editCompany(symbol, company)
                .then(({status, body}) => {
                    return res.status(status).json(body);
                })
                .catch(err => { next(err) });
        })
        .delete((req, res, next) => {
            const { symbol } = req.body;
            
            stockController.deleteCompany(symbol)
                .then(({status, body}) => {
                    return res.status(status).json(body);
                })
                .catch(err => { next(err) });
        });
}

export default routes;