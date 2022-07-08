import priceController from '../controllers/priceController';

const routes = app => {
    app.route('/prices/:symbol')
        .get((req, res, next) => {
            priceController.getPrices(req, res).catch(err => { next(err) });;
        });
}

export default routes;