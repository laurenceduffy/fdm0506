import { activationErrors as errors, authErrors, tokenErrors } from './errors';
import { getUser, confirmNewEmail, activateUser, deactivateUser, reactivateUser, getAllUserRequests, requestReactivation } from './../data/userData';
import { getUserToken, verifyAdminToken } from './../util/jwtUtil';
import { http } from 'microservice-util';

class ActivationController {
    constructor() {
        console.log('ActivationController initialised');
    }

    activate = async(email, code) => {
        if(!email) return http.badRequest(errors.noEmail);
        if(!code) return http.badRequest(errors.noActivationCode);

        let user = await getUser(email);
        
        if(!user || user.isActivated) {
            user = await confirmNewEmail(email, code);
        } else {
            user = await activateUser(user, code);
        }

        if(!user) return http.forbidden(errors.activationFailed);

        const newToken = getUserToken(user);
        return http.ok({token: newToken});
    }

    deactivateUser = async (token, email, datetime, reason) => {
        const admin = await verifyAdminToken(token);
        if(!admin) return http.forbidden(tokenErrors.invalidToken);

        const user = await getUser(email);
        if(!user) return http.notFound(authErrors.accountNotFound);

        deactivateUser(user, datetime, reason);

        return http.ok();
    }

    reactivateUser = async (token, email) => {
        const admin = await verifyAdminToken(token);
        if(!admin) return http.forbidden(tokenErrors.invalidToken);

        const user = await getUser(email);
        if(!user) return http.notFound(authErrors.accountNotFound);

        reactivateUser(user);

        return http.ok();
    }

    requestReactivation = async (email) => {
        const user = await getUser(email);
        if(!user) return http.notFound(authErrors.accountNotFound);

        const success = requestReactivation(user);
        if(!success) return http.forbidden(errors.accountAlreadyActive);

        return http.ok();
    }

    getUserRequests = async (token) => {
        const admin = await verifyAdminToken(token);
        if(!admin) return http.forbidden(tokenErrors.invalidToken);

        const { reactivateUsers, deleteUsers } = await getAllUserRequests();

        if(reactivateUsers?.length === 0 && deleteUsers?.length === 0) {
            return http.notFound(errors.noRequestsFound);
        }

        return http.ok({reactivateUsers, deleteUsers});
    }
}

export default new ActivationController();