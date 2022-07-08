import { http } from "microservice-util";
import { accountErrors as errors } from "./errors";
import { createUserAccount, getUserAccount } from "../data/accountData";
import { getPortfolioValue, getPosition } from "../data/positionData";

class AccountController {
    constructor() {
        console.log('AccountController initialised');
    }

    get = async (userId, authorizationToken) => {
        let account = await getUserAccount(userId);

        if(!account) {
            account = await createUserAccount(userId, authorizationToken)

            if(!account) {
                return http.forbidden(errors.accountNotVerified);
            }
        }

        const portfolioValue = await getPortfolioValue(userId);

        return http.ok({funds: account.availableFunds, portfolio: portfolioValue});
    }

    shares = async(userId, symbol) => {
        const position = await getPosition(userId, symbol);

        if(position) {
            return http.ok({
                amount: position.amount,
                avgPrice: position.avgPrice
            });
        } else {
            return http.ok({
                amount: 0,
                avgPrice: 0
            });
        }
    }
}

export default new AccountController();