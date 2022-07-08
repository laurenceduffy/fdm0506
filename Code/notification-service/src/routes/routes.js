import notificationController from "../controllers/notificationController";

const routes = app => {
    app.route('/email')
        .post((req, res, next) => {
            const { to, subject, text, html } = req.body;

            notificationController.sendEmail(to, subject, text, html)
                .then(({status, body}) => {
                    return res.status(status).json(body);
                })
                .catch(err => { next(err) });
        });
}

export default routes;