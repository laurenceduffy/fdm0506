import Account from "./accountModel";
import { callService } from "microservice-util";

const getUserAccount = async (userId) => {
    return userId ? (await Account.findOne({ userId: userId }).exec()) : null;
}

const isUserVerified = async (authorizationToken) => {
    const serviceResponse = await callService('verification-service', {url:`verify`, method: 'get', headers: { authorization: authorizationToken }});
    
    return serviceResponse.status !== 200 ? true : false;
}

const createUserAccount = async (userId, authorizationToken) => {
    if(!(await getUserAccount(userId)) && (await isUserVerified(authorizationToken))) {
        const account = new Account({
            userId
        });
    
        await account.save();
        return await getUserAccount(userId);
    } else {
        return null;
    }
}

export { getUserAccount, createUserAccount, isUserVerified }