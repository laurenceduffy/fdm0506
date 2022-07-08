import { http } from 'microservice-util';
import { createCardDetails, editCardDetails, getCardDetails } from '../data/cardData';
import { cardErrors } from './errors';

class VerificationController {
    constructor() {
        console.log('VerificationController initialised');
    }

    updateCardDetails = async(userId, details) => {
        const { name, number, expiry, cvv } = details;

        if(!name) return http.badRequest(cardErrors.invalidName);
        if(!number) return http.badRequest(cardErrors.invalidNumber);
        if(!expiry) return http.badRequest(cardErrors.invalidExpiry);
        if(!cvv) return http.badRequest(cardErrors.invalidSecurityCode);

        const ccDetails = await getCardDetails(userId);
        
        if(!ccDetails) {
            createCardDetails(userId, name, number, expiry, cvv);
        } else {
            editCardDetails(ccDetails, name, number, expiry, cvv);
        }

        return http.ok();
    }

    getCardDetails = async(userId) => {
        const ccDetails = await getCardDetails(userId)
        if(!ccDetails) return http.notFound(cardErrors.ccDetailsNotFound);

        return http.ok({
            name:ccDetails.name,
            number:ccDetails.number,
            expiry:ccDetails.expiry,
            cvv:ccDetails.cvv
        });
    }
}

export default new VerificationController();