import authController from "../controllers/authController";
import activationController from "../controllers/activationController";
import tokenController from "../controllers/tokenController";
import userController from "../controllers/userController";

const routes = app => {
    app.route('/login')
        .post((req, res, next) => {
            const { email, password } = req.body;

            authController.login(email, password)
                .then(({status, body}) => {
                    return res.status(status).json(body);
                })
                .catch(err => { next(err) });
        });
    
    app.route('/register')
        .post((req, res, next) => {
            const { username, email, password, forename, surname, dob } = req.body;

            authController.register({ username, email, password, forename, surname, dob })
                .then(({status, body}) => {
                    return res.status(status).json(body);
                })
                .catch(err => { next(err) });
        });

    app.route('/validate')
        .get((req, res, next) => {
            const { authorization } = req.headers;

            tokenController.validateToken(authorization)
                .then(({status, body}) => {
                    return res.status(status).json(body);
                })
                .catch(err => { next(err) });
        });
    
    app.route('/admin')
        .get((req, res, next) => {
            const { authorization } = req.headers;

            tokenController.validateAdmin(authorization)
                .then(({status, body}) => {
                    return res.status(status).json(body);
                })
                .catch(err => { next(err) });
        });
    
    app.route('/user')
        .get((req, res, next) => {
            const { authorization } = req.headers;

            userController.getUserDetails(authorization)
                .then(({status, body}) => {
                    return res.status(status).json(body);
                })
                .catch(err => { next(err) });
        })
        .put((req, res, next) => {
            const { authorization } = req.headers;
            const { email, password, dob } = req.body;

            userController.updateUserDetails(authorization, email, password, dob)
                .then(({status, body}) => {
                    return res.status(status).json(body);
                })
                .catch(err => { next(err) });
        })
        .post((req, res, next) => {
            const { authorization } = req.headers;
            const { user } = req.body;

            userController.getUserDetails(authorization, user)
                .then(({status, body}) => {
                    return res.status(status).json(body);
                })
                .catch(err => { next(err) });
        })
        .delete((req, res, next) => {
            const { authorization } = req.headers;
            const { email } = req.body;

            userController.deleteUser(authorization, email)
                .then(({status, body}) => {
                    return res.status(status).json(body);
                })
                .catch(err => { next(err) });
        });

    app.route('/activate')
        .post((req, res, next) => {
            const { email, code } = req.body;

            activationController.activate(email, code)
                .then(({status, body}) => {
                    return res.status(status).json(body);
                })
                .catch(err => { next(err) });
        });

    app.route('/deactivate')
        .put((req, res, next) => {
            const { authorization } = req.headers;
            const { email, datetime, reason } = req.body;

            activationController.deactivateUser(authorization, email, datetime, reason)
                .then(({status, body}) => {
                    return res.status(status).json(body);
                })
                .catch(err => { next(err) });
        });
    
    app.route('/reactivate')
        .put((req, res, next) => {
            const { authorization } = req.headers;
            const { email } = req.body;

            activationController.reactivateUser(authorization, email)
                .then(({status, body}) => {
                    return res.status(status).json(body);
                })
                .catch(err => { next(err) });
        })
        .post((req, res, next) => {
            const { email } = req.body;

            activationController.requestReactivation(email)
                .then(({status, body}) => {
                    return res.status(status).json(body);
                })
                .catch(err => { next(err) });
        });
    
    app.route('/requests')
        .get((req, res, next) => {
            const { authorization } = req.headers;

            activationController.getUserRequests(authorization)
                .then(({status, body}) => {
                    return res.status(status).json(body);
                })
                .catch(err => { next(err) });
        })
}

export default routes;