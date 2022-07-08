const getTokenPayload = token => {
    const encodedPayload = token.split('.')[1];
    return JSON.parse(Buffer.from(encodedPayload, 'base64'));
}

export default getTokenPayload;