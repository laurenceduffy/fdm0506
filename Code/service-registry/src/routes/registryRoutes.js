import registryController from "../controllers/registryController";

const routes = app => {
    app.use('/', async (req, res, next) => {
        console.log(`${req.method} ${req.url}`)
        next();
    });

    app.route('/service/:name')
        .get((req, res) => {
            registryController.getService(req, res);
        })

        .post((req, res) => {
            registryController.registerService(req, res);
        })

        .delete((req, res) => {
            registryController.removeService(req, res);
        });

    app.all('*', (req, res) => {
        res.status(404).json({error: `No route found for ${req.url}`});
    })

    app.use((err, req, res, next) => {
        console.error(`CAUGHT ERR: '${err.message}' at route '${req.url}'`);
        res.status(500).json({error: err.message});
    })
}

export default routes;