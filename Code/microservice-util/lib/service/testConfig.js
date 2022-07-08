const { TextEncoder, TextDecoder } = require('util')
const app = require('./app');
const { connect, disconnect } = require("./database");

const setUp = async (mock_conn_string) => {
    global.TextEncoder = TextEncoder;
    global.TextDecoder = TextDecoder;

    jest.setTimeout(30000);
    
    await connect(mock_conn_string);
    return app.app;
};
  
const tearDown = () => {
    disconnect({silent: true});
};

module.exports = { setUp, tearDown };