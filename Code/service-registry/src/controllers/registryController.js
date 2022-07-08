class RegistryController {
    constructor() {
        this.registry = {};
        this.serviceLifetime = 30;

        setInterval(() => {
            this.tidyServices();
        }, this.serviceLifetime * 1000)

        console.log("RegistryController initialised");
    }

    getService(req, res) {
        const serviceKey = req.params.name;
        const service = this.registry[serviceKey];

        if(!service) res.status(404).json({error: 'Service not found'});

        res.status(200).json(service);
    }

    registerService(req, res) {
        const ip = req.connection.remoteAddress.includes('::') ? `[${req.connection.remoteAddress}]` : req.connection.remoteAddress;
        const name = req.params.name;
        const { port } = req.body;

        if(!ip, !port) res.status(400).json({error: 'Bad request'});

        const timestamp = Math.floor(Date.now() / 1000);
        this.registry[name] = { name, ip, port, timestamp };

        res.status(200).send();
    }

    removeService(req, res) {
        const serviceKey = req.params.name;
        const service = this.registry[serviceKey];

        if(!service) res.status(404).json({error: 'Service not found'});

        delete this.registry[serviceKey];
        res.status(200).send();
    }

    tidyServices() {
        for(var service in this.registry) {
            if(this.registry[service].timestamp + this.serviceLifetime < Date.now() / 1000)
                delete this.registry[service];
        }
    }
}

export default new RegistryController();