const jsonResponse = (status, body) => {
    return {
        status,
        body
    } 
}

const errorResponse = (status, errMsg) => {
    return jsonResponse(status, {error: errMsg});
}

const httpResponses = {
    // missing codes to be added as neccessary
    // 200 codes
    ok: (body) => {
        return jsonResponse(200, body);
    },
    // 400 codes
    badRequest: (errMsg) => {
        return errorResponse(400, errMsg);
    },
    unauthorized: (errMsg) => {
        return errorResponse(401, errMsg);
    },
    forbidden: (errMsg) => {
        return errorResponse(403, errMsg);
    },
    notFound: (errMsg) => {
        return errorResponse(404, errMsg);
    },
    conflict: (errMsg) => {
        return errorResponse(409, errMsg);
    },
    // 500 codes
    internalServerError: (errMsg) => {
        return errorResponse(500, errMsg);
    },
    notImplemented: (errMsg) => {
        return errorResponse(501, errMsg);
    },
    badGateway: (errMsg) => {
        return errorResponse(502, errMsg);
    },
    serviceUnavailable: (errMsg) => {
        return errorResponse(503, errMsg);
    },
    gatewayTimeout: (errMsg) => {
        return errorResponse(504, errMsg);
    }
};

module.exports = httpResponses;