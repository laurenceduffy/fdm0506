import { callService } from "microservice-util";

const templateMsg = {
    to: null,
    subject: null,
    html: null
}

const clientAddr = 'http://localhost:3000'
const notificationService = 'notification-service';

const sendActivationEmail = async(email, activationCode) => {
    templateMsg.to = email;
    if(!email) return false;

    templateMsg.subject = 'Activate Account';
    templateMsg.html = `
        <h2>Activate Your Account</h2>
        <p>Click on the following link to activate your email address:
        <a href="${clientAddr}/activate/${email}/${activationCode}">Activate</a>
        </p>
    `;

    await callService(notificationService, {url:`email`, method: 'post', data: templateMsg});

    return true;
}

const sendConfirmEmail = async(email, activationCode) => {
    templateMsg.to = email;
    if(!email) return false;

    templateMsg.subject = 'Confirm Email Address';
    templateMsg.html = `
        <h2>Confirm Your New Email</h2>
        <p>Click on the following link to confirm your email address change:
        <a href="${clientAddr}/activate/${email}/${activationCode}">Confirm</a>
        </p>
    `;

    await callService(notificationService, {url:`email`, method: 'post', data: templateMsg});

    return true;
}

const sendPasswordResetEmail = async(email) => {
    return;
}

const sendNewUserNotificationEmail = async(adminEmail, userEmail) => {
    templateMsg.to = adminEmail;
    if(!adminEmail || !userEmail) return false;

    templateMsg.subject = `Account Registered: ${userEmail}`;
    templateMsg.html = `
        <h2>New Account Registered</h2>
        <p>A user has registered with the email address: ${userEmail}</p>
    `;

    await callService(notificationService, {url:`email`, method: 'post', data: templateMsg});

    return true;
}

export { sendActivationEmail, sendPasswordResetEmail, sendConfirmEmail, sendNewUserNotificationEmail };