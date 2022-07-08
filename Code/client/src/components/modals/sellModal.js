import { sell } from "../../api/transactions";
import TransactionModal from "./transactionModal";

const SellModal = ({open, setOpen, stock, sharesOwned, onSubmit}) => {
    const onStateChange = async (val) => {
        //
    }

    const sellShares = async(token, amount) => {
        await sell(token, stock.name, amount);
        onSubmit();
    }

    return (
        <>
            <TransactionModal open={open} setOpen={setOpen} stock={stock} onStateChange={onStateChange} transaction={sellShares} transactionType="Sell" maxShares={sharesOwned} />
        </>
    );
}

export default SellModal;