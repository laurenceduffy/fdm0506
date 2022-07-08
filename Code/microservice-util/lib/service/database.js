const mongoose = require('mongoose');

const connect = async (connString) => {
    if(mongoose.connection.readyState === 0) {
        await mongoose.connect(connString, {useNewUrlParser: true, useUnifiedTopology: true})
            .then(() => {
                console.log(`Established connection to Mongo DB!`);
            }).catch(err => {
                console.log(`Cannot connect to Mongo DB [${connString}]\nCAUGHT ERR: ${err.message}\nRetrying database connection...`);
            });
    }
}

const disconnect = async (options) => {
    if(!options) options = {};

    await mongoose.disconnect();

    if(!options.silent)
        console.log(`Mongo DB disconnected successfully.`);
}

module.exports = { connect, disconnect, connection: mongoose };