import jwt from 'jsonwebtoken';
import { dbConnection } from 'microservice-util';
import roles from '../data/userRoles';

const tokenLifetime = '7d';

const getUserToken = user => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            isActivated: user.isActivated,
            username: user.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn: tokenLifetime
        });
}

const getAdminToken = user => {
    if(user.role === roles.admin) {
        return jwt.sign({
            id: user._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: tokenLifetime
        });
    } else {
        return null;
    }
}

const verifyUserToken = async (token) => {
    token = token.split(' ')[1];

    return jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            console.log(err);
            return null;
        }

        const { id } = decoded;
        const user = await dbConnection.model('User').findOne({ _id: id }).exec();

        if(!user) return null;
        if(user.role === roles.user && user.deactiveUntil < Date.now()) return user;
        return null;
    });
}

const verifyAdminToken = async (token) => {
    token = token.split(' ')[1];

    return jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            console.log(err);
            return null;
        }

        const { id } = decoded;
        const user = await dbConnection.model('User').findOne({ _id: id }).exec();

        if(!user) return null;
        if(user.role === roles.admin) return user;
        return null;
    });
}

export { getUserToken, verifyUserToken, getAdminToken, verifyAdminToken };