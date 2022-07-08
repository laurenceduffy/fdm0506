import verificationController from "../controllers/verificationController";
import { parseJwt } from "microservice-util";

const routes = app => {
    app.route('/verify')
        .get((req, res, next) => {
            const userId = parseJwt(req.headers.authorization).id;

            verificationController.getCardDetails(userId)
                .then(({status, body}) => {
                    return res.status(status).json(body);
                })
                .catch(err => { next(err) });
        })
        .post((req, res, next) => {
            const userId = parseJwt(req.headers.authorization).id;

            verificationController.updateCardDetails(userId, req.body)
                .then(({status, body}) => {
                    return res.status(status).json(body);
                })
                .catch(err => { next(err) });
        });
}

export default routes;