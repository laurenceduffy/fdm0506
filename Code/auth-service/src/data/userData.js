import User from "./userModel";
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { sendActivationEmail, sendNewUserNotificationEmail } from '../util/emailUtil';
import roles from '../data/userRoles';

const MAX_DATE = new Date(8640000000000000);

const getUser = async (username) => {
    const user = await User.findOne({ $or:[ {username: username}, {email: username} ]}).exec()
    //const user = await User.findOne({ email: emailAddress }).exec();

    return user;
}

const createUser = async (fields) => {
    const { username, email, password, forename, surname, dob } = fields;

    const hashPassword = await createPasswordHash(password);

    const activationCode = uuid();

    const user = new User({
        username: username.toLowerCase(),
        email: email,
        forename: forename,
        surname: surname,
        password: hashPassword,
        activationCode
    });

    if(dob) {
        user.dob = new Date(dob);
    }

    user.save();

    return user;
}

const verifyPassword = async (user, password) => {
    return await bcrypt.compare(password, user.password);
}

const createPasswordHash = async (password) => {
    return await bcrypt.hash(password, 10);
}

const emailInUse = async (email) => {
    return await User.findOne({ email: email }).exec() || await User.findOne({ newEmail: email }).exec();
}

const sendRegistrationComms = async (user) => {
    const emailResult = await sendActivationEmail(user.email, user.activationCode);
    if(!emailResult) return false;

    const admins = await User.find({role: roles.admin});
    admins.forEach(admin => {
        sendNewUserNotificationEmail(admin.email, email);
    });

    return true;
}

const confirmNewEmail = async (email, code) => {
    const user = await User.findOne({ newEmail: email }).exec();

    if(!user || user.activationCode !== code) return false;

    user.email = email;
    user.save();

    return user;
}

const deleteUser = async(email) =>{
    const user = await User.deleteOne({ email: email, deleteRequested: true }).exec();
    
    if(user.deletedCount < 1) return false;

    return true;
}

const activateUser = async (user, code) => {
    if(user.activationCode !== code) return false;

    user.isActivated = true;
    await user.save();

    return user;
}

const deactivateUser = async (user, datetime, reason) => {
    user.deactiveUntil = new Date(datetime);
    user.deactivateReason = reason ? reason : "N/A";
    user.save();
}

const reactivateUser = async (user) => {
    user.deleteRequested = false;
    user.reactivateRequested = false;
    user.deactivateReason = '';
    user.deactiveUntil = Date.now();
    user.save();
}

const requestReactivation = async (user) => {
    if (user.deactiveUntil < Date.now()) return false;

    user.reactivateRequested = true;
    user.save();

    return true;
}

const requestDeletion = async (user) => {
    user.deleteRequested = true;
    user.deactiveUntil = MAX_DATE;
    user.save();
}

const getAllUserRequests = async () => {
    const reactivateUsers = await User.find({ reactivateRequested: true }).exec();
    const deleteUsers = await User.find({ deleteRequested: true }).exec();

    return { reactivateUsers, deleteUsers };
}

export { getUser, createUser, verifyPassword, createPasswordHash, emailInUse, sendRegistrationComms, confirmNewEmail, activateUser, deactivateUser, reactivateUser, requestReactivation, getAllUserRequests, deleteUser, requestDeletion };