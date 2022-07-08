const getCurrencyString = val => {
    let prefix = '';

    if(val < 0) {
        prefix = '-';
        val = Math.abs(val);
    }
    
    return `${prefix} £${val.toLocaleString('en-GB', {maximumFractionDigits:2, minimumFractionDigits:2})}`; 
}

export default getCurrencyString;