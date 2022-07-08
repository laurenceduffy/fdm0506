const axios = require('axios');
const dotenv = require('dotenv');
const { connect } = require('./database');

const config = {
    name: null,
    version: 0,
    db_conn_string: null,
    service_registry: null,
    refresh: 20,
    port: 0
}

let serviceRegistryStatus = false;

const setConfig = appConfig => {
    const { name, version, db_conn_string, service_registry } = appConfig;

    config.name = name;
    config.version = version;
    config.db_conn_string = db_conn_string;
    config.service_registry = service_registry;
}

const registerSelf = async () => {
    const url = `${config.service_registry}/service/${config.name}`.toString();

    await axios.post(url, { port: config.port })
        .then(() => {
            if(!serviceRegistryStatus) {
                console.log(`Service registry connected!\nRegistry connection will periodically refresh.`);
                serviceRegistryStatus = true;
            }
        })
        .catch(err => {
            if(serviceRegistryStatus) {
                console.log(`Service registry disconnected!\nCAUGHT ERR: ${err.message}\Server will periodically reattempt connection.`);
                serviceRegistryStatus = false;
            } else {
                console.log(`Cannot connect to service registry!\nCAUGHT ERR: ${err.message}\nRetrying service registry connection ...`);
            }
        });
}

const connectMongoInstance = async () => {
    if(config.db_conn_string) {
        connect(config.db_conn_string);
    }
}

const initServer = async () => {
    const result = dotenv.config()

    if (result.error) {
        throw result.error;
    }

    console.log(`Connecting to Mongo DB: ${config.db_conn_string} ...`);
    connectMongoInstance(config.db_conn_string);

    console.log(`Connecting to service registry at: ${config.service_registry} ...`);
    registerSelf();
}

const refreshConnections = async () => {
    connectMongoInstance(config.db_conn_string);
    registerSelf();
}

const startService = (app, appConfig) => {
    setConfig(appConfig);

    const listener = app.listen(config.port, async() => {
        console.log('\x1b[36m%s\x1b[0m', `\nMicroservice Instance: [${config.name}, v${config.version}] listening on port ${listener.address().port}\n`);
        config.port = listener.address().port;
    
        await initServer(appConfig).then(() => {
            setInterval(() => {
                refreshConnections();
            }, config.refresh * 1000);
        });
    });

    return listener;
}

module.exports = { startService };