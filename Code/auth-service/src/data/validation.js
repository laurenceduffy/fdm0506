const validationTypes = {
    email: /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*/,
    password: /^((?=.*?[a-zA-Z])(?=.*?[0-9])).{7,}$/,
    username: /^(?=.*?[a-zA-Z0-9]).{2,15}$/ 
}

class Validator {
    static get types() {
        return validationTypes;
    }

    static validate = (field, regex) => {
        if(!field) return null;
    
        return regex.test(field) ? field : null;
    }
}

export default Validator;