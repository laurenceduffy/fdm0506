import CardDetails from "./cardModel";

const getCardDetails = async (userId) => {
    return await CardDetails.findOne({ userId: userId }).exec();
}

const createCardDetails = (userId, name, number, expiry, cvv) => {
    const details = new CardDetails({
        userId,
        name,
        number,
        expiry,
        cvv
    });

    details.save();
}

const editCardDetails = (ccDetails, name, number, expiry, cvv) => {
    ccDetails.name = name;
    ccDetails.number = number;
    ccDetails.expiry = expiry;
    ccDetails.cvv = cvv;

    ccDetails.save();
}

export { getCardDetails, createCardDetails, editCardDetails }