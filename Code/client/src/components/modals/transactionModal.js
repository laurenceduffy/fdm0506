import { useState, useEffect } from "react";
import { Heading, Form } from "react-bulma-components";
import Slider from "../input/slider";
import getCurrencyString from "../../utility/currencyFormatting";
import { useToken } from "../../auth/useToken";
import ConfirmCancelModal from "./confirmCancelModal";

const TransactionModal = ({open, setOpen, stock, onStateChange, maxShares, transaction, transactionType}) => {
    const [shareAmount, setShareAmount] = useState(0);
    const [token,] = useToken();

    useEffect(() => {
        onStateChange(open)
        setShareAmount(0);
    }, [open]);

    const changeShareAmount = e => {
        const val = e.target.value;

        if(val < 0) {
            setShareAmount(0);
        } else {
            setShareAmount(val);
        }
    }

    const textColor = () => {
        if(shareAmount > maxShares) {
            return "has-text-danger";
        }

        return "has-text-primary";
    }

    const validTransaction = () => {
        return !(shareAmount < 1 || shareAmount > maxShares);
    }

    const performTransaction = async () => {
        if(validTransaction() && token) {
            const result = await transaction(token, shareAmount);
            setOpen(false);

            // TODO: Provide feedback for success / fails
        }
    }

    const content = (
        <div className="has-text-centered">
            <Heading size={6} subtitle={true} className="my-1">NUMBER OF SHARES</Heading>
            <Heading size={5} className="my-2">0 <Slider value={shareAmount} setValue={setShareAmount} step={1} min={0} max={maxShares} /> {maxShares}</Heading>
            
            <Form.Control>
                <Form.Input min={0} max={maxShares} type="number" value={shareAmount} onChange={changeShareAmount} className={`${textColor()} has-text-centered has-text-weight-bold`} />
            </Form.Control>

            <hr/>
            <Heading size={6} subtitle={true}>TOTAL</Heading>
            <Heading size={4} className={`${textColor()} mb-3`}>{getCurrencyString(stock.price * shareAmount)}</Heading>
        </div>
    );

    return (
        <>
            <ConfirmCancelModal open={open} setOpen={setOpen} title={`${transactionType} ${stock.name}`} content={content} disableConfirm={!validTransaction()} onConfirm={performTransaction} />
        </>
    );
}

export default TransactionModal;