const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./serviceRoutes');

// create service
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

module.exports = {app, setRoutes: routes};