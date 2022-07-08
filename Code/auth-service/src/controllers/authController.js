import Validator from '../data/validation';
import { getAdminToken, getUserToken } from '../util/jwtUtil';
import { http } from 'microservice-util';
import { authErrors as errors, validationErrors } from './errors';
import { verifyPassword, createUser, getUser, sendRegistrationComms } from '../data/userData';

class AuthController {
    constructor() {
        console.log('AuthController initialised');
    }

    login = async(email, password) => {
        if(!password) return http.badRequest(errors.passwordRequired);

        const user = await getUser(email);

        if(!user) {
            return http.unauthorized(errors.accountNotFound);
        } else if (!verifyPassword(user, password)) {
            return http.unauthorized(errors.passwordIncorrect);
        } else if (!user.isActivated) {
            return http.forbidden(errors.accountNotActive);
        } else if (user.deleteRequested) {
            return http.forbidden(errors.accountDeleted);
        } else if (user.deactiveUntil > Date.now()) {
            if(user.reactivateRequested) {
                return http.forbidden(errors.accountReactivated(user));
            }

            return http.forbidden(errors.accountDeactive(user));
        }

        const token = getUserToken(user);
        const admin = getAdminToken(user);

        return http.ok({token, admin});
    }

    register = async(fields) => {
        const username = Validator.validate(fields.username, Validator.types.username);
        const email = Validator.validate(fields.email, Validator.types.email);
        const password = Validator.validate(fields.password, Validator.types.password);
        const { forename, surname } = fields;

        if(!username) return http.badRequest(validationErrors.username);
        if(!email) return http.badRequest(validationErrors.email);
        if(!password) return http.badRequest(validationErrors.password);
        if(!forename) return http.badRequest(validationErrors.forename);
        if(!surname) return http.badRequest(validationErrors.surname);

        const user = await getUser(email);
        
        if(user) {
           return http.forbidden(errors.emailInUse);
        }
        
        const newUser = await createUser(fields);

        if(!(await sendRegistrationComms(newUser))) return http.badGateway(errors.verificationEmailFailure);

        const token = getUserToken(newUser);
        return http.ok({token});
    }
}

export default new AuthController();