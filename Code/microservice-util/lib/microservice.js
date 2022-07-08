const app = require('./service/app');
const startService = require('./service/startup').startService;
const testConfig = require('./service/testConfig');
const db = require('./service/database');
const callService = require('./service/services');
const parseJwt = require('./service/jwt');
const httpResponses = require('./service/httpResponses')

module.exports = {
    app: app.app,
    setRoutes: app.setRoutes,
    startService,
    testConfig,
    dbConnection: db.connection,
    callService,
    parseJwt,
    http: httpResponses
};