const validateSymbol = symbol => {
    if(!symbol) return false;

    symbol = symbol.trim();

    const re = /^[a-zA-Z]{1,5}$/
    return re.test(symbol) ? symbol : null;
};

const validateCompany = company => {
    if(!company) return false;

    company = company.trim();

    const re = /^[a-zA-Z ]{2,32}$/
    return re.test(company) ? company : null;
};

export { validateSymbol, validateCompany };