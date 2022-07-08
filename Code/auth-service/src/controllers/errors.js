const authErrors = {
    passwordRequired: 'Password field is required.',
    passwordIncorrect: 'Incorrect password.',
    accountNotFound: 'Account does not exist with provided details.',
    accountNotActive: 'Account not yet activated.',
    accountDeleted: 'This account has been deleted. Please contact a site administrator for any queries.',
    accountReactivated: user => { return `Account de-active until ${user.deactiveUntil} due to "${user.deactivateReason}". Account re-activation has been requested.` },
    accountDeactive: user => { return `Account de-active until ${user.deactiveUntil} due to "${user.deactivateReason}". Please contact a site administrator for any queries.` },
    emailInUse: 'The provided email address is already in use.',
    verificationEmailFailure: 'Could not send verification email.'
}

const validationErrors = {
    username: 'Username must be 3 - 16 characters in length, containing only numbers and letters',
    email: 'Must provide a valid email address.',
    password: 'Password must contain at least one letter, one number, and be at least 7 characters in length.',
    forename: 'Forename is required.',
    surname: 'Surname is required.',
    dob: 'Invalid date of birth.'
}

const activationErrors = {
    noEmail: 'No email provided.',
    noActivationCode: 'No activation code provided.',
    accountNotFound: 'Account not found.',
    activationFailed: 'Activation failed.',
    accountAlreadyActive: 'Account is already active.',
    noRequestsFound: 'No user requests found.'
}

const tokenErrors = {
    invalidToken: 'Invalid token.'
}

export { authErrors, validationErrors, activationErrors, tokenErrors };