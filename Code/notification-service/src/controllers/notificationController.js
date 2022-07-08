import mail from "@sendgrid/mail";
import { http } from "microservice-util";
import { emailErrors } from "./errors";

const from = process.env.EMAIL_SENDER;

class NotificationController {
    constructor() {
        console.log('NotificationController initialised');
        mail.setApiKey(process.env.SENDGRID_API_KEY);
    }

    sendEmail = async(to, subject, text, html) => {
        if(!to) return http.badRequest(emailErrors.noRecipient);
        if(!subject) return http.badRequest(emailErrors.noSubject);
        if(!text && !html) return http.badRequest(emailErrors.noBody);

        const msg = {to, from, subject, text, html};

        return mail.send(msg)
            .then(() => {
                return http.ok();
            })
            .catch(err => {
                return http.badGateway(err);
            });
    }
}

export default new NotificationController();