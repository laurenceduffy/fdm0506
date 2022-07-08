import { name, version } from './package.json';
import { setRoutes, app, startService } from 'microservice-util';
import dotenv from 'dotenv';
import routes from './src/routes/routes';

const result = dotenv.config()

if (result.error) {
    throw result.error;
}

setRoutes(app, routes);

const config = {
    name,
    version,
    db_conn_string: null,
    service_registry: process.env.SERVICE_REGISTRY
}

startService(app, config);
