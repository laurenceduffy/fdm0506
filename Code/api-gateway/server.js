import bodyParser from 'body-parser';
import express from 'express';
import {name, version} from './package.json';
import routes from './src/routes/gatewayRoutes';
import cors from 'cors';

const config = {
    name,
    version
}

const app = express();
const PORT = 3333;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const corsOptions = {origin: 'http://localhost:3000'}; // use client domain here
app.use(cors(corsOptions));

routes(app);

app.listen(PORT, () => {
    console.log('\x1b[36m%s\x1b[0m', `\nServer: [${config.name}, v${config.version}] listening on port ${PORT}\n`);
}) 