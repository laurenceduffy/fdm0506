import bodyParser from 'body-parser';
import express from 'express';
import {name, version} from './package.json';
import routes from './src/routes/registryRoutes';

const config = {
    name,
    version
}

const app = express();
const PORT = 3555;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

routes(app);

app.listen(PORT, () => {
    console.log('\x1b[36m%s\x1b[0m', `\nServer: [${config.name}, v${config.version}] listening on port ${PORT}\n`);
}) 