import { http } from "microservice-util";
import { createPasswordHash, getUser, emailInUse, requestDeletion, deleteUser } from "../data/userData";
import { verifyUserToken, verifyAdminToken, getUserToken } from "../util/jwtUtil";
import { activationErrors, authErrors, tokenErrors, validationErrors } from "./errors";
import { sendConfirmEmail } from "../util/emailUtil";
import Validator from './../data/validation';

class UserController {
    constructor() {
        console.log('UserController initialised');
    }

    getUserDetails = async(token, username) => {
        const admin = await verifyAdminToken(token);
        const verifiedUser = await verifyUserToken(token);
        if(!admin && !verifiedUser) return http.forbidden(tokenErrors.invalidToken);

        const user = admin ? await getUser(username) : await getUser(verifiedUser.email);
        if(!user) return http.notFound(authErrors.accountNotFound);

        const isActive = user.deactiveUntil < Date.now();

        if(admin) {
            return http.ok({
                username: user.username,
                email: user.email,
                created: user.created,
                isActive,
                deleteRequested: user.deleteRequested,
                deactiveUntil: user.deactiveUntil,
                deactivateReason: user.deactivateReason
            });
        } else {
            return http.ok(user);
        }
    }

    updateUserDetails = async(token, email, password, dob) => {
        const user = await verifyUserToken(token);
        if(!user) return http.forbidden(tokenErrors.invalidToken);

        if(email) {
            return this.changeEmail(user, email);
        } else if (password) {
            return this.changePassword(user, password);
        } else {
            if(!dob) return http.badRequest(validationErrors.dob);

            user.dob = new Date(dob);
            await user.save();

            const newToken = getUserToken(user);
            return http.ok({token: newToken});
        }
    }

    changePassword = async(user, password) => {
        password = Validator.validate(password, Validator.types.password);
        if(!password) return http.badRequest(validationErrors.password);

        user.password = await createPasswordHash(password);
        await user.save();

        const newToken = getUserToken(user);
        return http.ok({token: newToken});
    }

    changeEmail = async(user, email) => {
        email = Validator.validate(email, Validator.types.email);
        if(!email) return http.badRequest();

        if(await emailInUse(email)) return http.forbidden(authErrors.emailInUse);

        user.newEmail = email;

        const emailResult = await sendConfirmEmail(email, user.activationCode);
        if(!emailResult) return http.badGateway(authErrors.verificationEmailFailure);

        await user.save();

        const newToken = getUserToken(user);
        return http.ok({token: newToken});
    }

    deleteUser = async (token, email) => {
        const admin = await verifyAdminToken(token);
        const user = await verifyUserToken(token);

        if(admin) {
            const deleted = await deleteUser(email);

            if(!deleted) return http.notFound(activationErrors.noRequestsFound);
        } else if (user && user.email === email) {
            requestDeletion(user);
        } else {
            return http.forbidden(tokenErrors.invalidToken)
        }
        
        return http.ok();
    }
}

export default new UserController();