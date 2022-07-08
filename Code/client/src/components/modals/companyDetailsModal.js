import ConfirmCancelModal from "./confirmCancelModal";
import { Form } from "react-bulma-components";
import { useEffect, useState } from "react";
import { addStock, editStock } from "../../api/stocks";
import { useAdmin } from "../../auth/useAdmin";

const CompanyDetailsModal = ({open, setOpen, editMode, stock}) => {
    const [adminToken,] = useAdmin();
    const [symbol, setSymbol] = useState('');
    const [company, setCompany] = useState('');
    const [globalErrorValue, setGlobalErrorValue] = useState('');

    useEffect(() => {
        if(stock) {
            setSymbol(stock.symbol);
            setCompany(stock.company);
        } else {
            setSymbol('');
            setCompany('');
        }

        setGlobalErrorValue('');
    }, [open])

    const changeSymbol = e => {
        setSymbol(e.target.value.toUpperCase());
    }

    const changeCompany = e => {
        setCompany(e.target.value);
    }

    const content = (
        <>
            <Form.Field>
                <Form.Label>
                    <p>Symbol</p>
                </Form.Label>
                <Form.Control>
                    <Form.Input type="text" value={symbol} onChange={changeSymbol} disabled={editMode} />
                </Form.Control>
            </Form.Field>

            <Form.Field>
                <Form.Label>
                    <p>Company Name</p>
                </Form.Label>
                <Form.Control>
                    <Form.Input type="text" value={company} onChange={changeCompany} />
                </Form.Control>
            </Form.Field>
            
            <p className="has-text-danger">{globalErrorValue}</p>
        </>
    );

    const addCompany = async() => {
        const result = editMode ? await editStock(adminToken, symbol, company) : await addStock(adminToken, symbol, company);

        if(result.error) {
            setGlobalErrorValue(result.error);
        } else {
            setGlobalErrorValue('');
            setOpen(false);
        }
    }

    const validCompany = () => {
        // TODO: Validate company and symbol
        return (symbol && company);
    }

    return (
        <ConfirmCancelModal open={open} setOpen={setOpen} title={editMode ? `Edit Company: ${symbol}` : `Add Company`} content={content} disableConfirm={!validCompany()} onConfirm={addCompany} />
    );
}

export default CompanyDetailsModal;