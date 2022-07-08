import { http } from "microservice-util";
import { verifyUserToken, verifyAdminToken } from "../util/jwtUtil";

class TokenController {
    constructor() {
        console.log('TokenController initialised');
    }

    validateToken = async (token) => {
        const user = await verifyUserToken(token)

        if(!user) return http.unauthorized();

        return http.ok({token})
    }

    validateAdmin = async (token) => {
        const user = await verifyAdminToken(token)

        if(!user) return http.unauthorized();

        return http.ok({token})
    }
}

export default new TokenController();