import { dbConnection } from 'microservice-util';
import roles from './userRoles';
const { Schema } = dbConnection;

const userSchema = new Schema({
    username: String,
    forename: String,
    surname: String,
    dob: Date,
    email: String,
    newEmail: String,
    password: String,
    activationCode: String,
    isActivated: { type: Boolean, default: false },
    created: { type: Date, default: Date.now },
    role: { type: Number, default: roles.user },
    deactiveUntil: { type: Date, default: Date.now },
    deactivateReason: {type: String, default: ''},
    reactivateRequested: { type: Boolean, default: false },
    deleteRequested: { type: Boolean, default: false }
  });

const User = dbConnection.model('User', userSchema);

export default User;