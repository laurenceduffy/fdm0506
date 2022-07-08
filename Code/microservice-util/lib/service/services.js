const axios = require('axios');

const serviceRegistry = "http://localhost:3555";

const getService = async (name) => {
    let details;
    await axios.get(`${serviceRegistry}/service/${name}`)
        .then(data => {
            details = data.data;
        })
        .catch(err => {
            if(err.response) {
                details = err.response.data;
            } else {
                details = { error: err.code }
            }

            details.service = name;
        });
        
    return details;
}

const callService = async (service, requestOptions) => {
    const serviceDetails = await getService(service);
    if(serviceDetails.error) return { status: 502, data: serviceDetails };

    console.log(`Calling service: ${service}`);

    requestOptions.url = `http://${serviceDetails.ip}:${serviceDetails.port}/${requestOptions.url}`;

    try {
        return await axios(requestOptions)
            .then(data => {
                return { status: data.status, data: data.data, headers: data.headers };
            })
            .catch(err => {
                console.log(`${service} received err response`, err);
                if(err.response.status === 500) throw new Error();

                return { status: err.response.status, data: err.response.data };
            });
    } catch (err) {
        return { status: 502, data: { error: `Call to ${service} failed` }};
    }
}

module.exports = callService;