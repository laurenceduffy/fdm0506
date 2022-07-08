const noAuthHeaderResponse = res => {
    return errorResponse(res, 401, 'Authorization header not provided');
}

const errorResponse = (res, status, msg) => {
    return res.status(status).json({error: msg});
}

export { noAuthHeaderResponse }