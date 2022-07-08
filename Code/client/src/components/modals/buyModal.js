import { buy } from "../../api/transactions";
import TransactionModal from "./transactionModal";
import { useState } from "react";
import { useToken } from "../../auth/useToken";
import { getBrokerAccount } from "../../api/account";

const BuyModal = ({open, setOpen, stock, onSubmit}) => {
    const [maximumShares, setMaximumShares] = useState(0);
    const [token,] = useToken();

    const onStateChange = async (val) => {
        if(token && val === true) {
            setMaximumShares(0);
            const account = await getBrokerAccount(token);
            setMaximumShares(Math.floor(account.funds / stock.price));
            setOpen(true);
        }
    }

    const buyShares = async(token, amount) => {
        await buy(token, stock.name, amount);
        onSubmit();
    }

    return (
        <>
            <TransactionModal open={open} setOpen={setOpen} stock={stock} onStateChange={onStateChange} transaction={buyShares} transactionType="Buy" maxShares={maximumShares} />
        </>
    );
}

export default BuyModal;