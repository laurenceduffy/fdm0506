const routes = (app, appRoutes) => {
    app.use('/', async (req, res, next) => {
        console.log(`${req.method} ${req.url}`)
        next();
    }); // Middleware to execute for all endpoints

    // Additional routes here
    if(appRoutes) {
        appRoutes(app);
    } else {
        console.warn("No app routes provided");
    }
    
    app.all('*', (req, res) => {
        return res.status(404).json({error: `No route found for ${req.url}`});
    }); // 404 capturing

    app.use((err, req, res, next) => {
        console.error(`CAUGHT ERR: '${err.message}' at route '${req.url}'`);
        return res.status(500).json({error: err.message});
    }); // 500 status responder
}

module.exports = routes;