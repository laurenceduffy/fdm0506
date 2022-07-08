import { useEffect, useState } from "react/cjs/react.development";
import { saveCard, getCardDetails } from "../../api/verify";
import { Form, Button, Heading, Notification } from "react-bulma-components";
import { useToken } from "../../auth/useToken";

const CardDetailsForm = ({isLoading, setIsLoading}) => {
    const [token,] = useToken();

    const [cardErrorValue, setCardErrorValue] = useState('');
    const [cardSuccessValue, setSuccessValue] = useState('');
    const [cardholderValue, setCardholder] = useState('');
    const [cardNumValue, setCardNumValue] = useState('');
    const [cardExpiryValue, setCardExpiryValue] = useState('');
    const [cardSecurityValue, setCardSecurityValue] = useState('');

    const changeCardholder = e => {
        const r = /^[a-z A-Z]{0,32}$/

        if(!r.test(e.target.value)) {
            return;
        }

        setCardholder(e.target.value);
    }

    const changeCardNum = e => {
        if(cardNumValue.length < e.target.value.length) {
            const r = /^[0-9 ]{0,19}$/

            if(!r.test(e.target.value)) {
                return;
            }

            const last = e.target.value.slice(-1);
            if(last === ' ') return;

            if((e.target.value.length > 4 && e.target.value.charAt(4) !== ' ') ||
            (e.target.value.length > 9 && e.target.value.charAt(9) !== ' ') ||
            (e.target.value.length > 14 && e.target.value.charAt(14) !== ' ')) {
                const val = e.target.value.slice(0, -1);
                e.target.value = val + ' ' + last;
            }
        }

        setCardNumValue(e.target.value);
    }

    const changeCardExpiry = e => {
        const last = e.target.value.slice(-1);

        if(cardExpiryValue.length < e.target.value.length) {
            const r = /^[0-9 /]{0,7}$/

            if(!r.test(e.target.value)) {
                return;
            }

            if(last === ' ') return;

            if(e.target.value.length > 2 && e.target.value.charAt(2) !== ' ') {
                const val = e.target.value.slice(0, -1);
                e.target.value = val + ' / ' + last;
            }
        } else {
            if(last === ' ') {
                const val = e.target.value.split(' ')[0]
                e.target.value = val;
            }
        }
        
        setCardExpiryValue(e.target.value);
    }

    const changeCardSecurity = e => {
        const r = /^[0-9]{0,3}$/

        if(!r.test(e.target.value)) {
            return;
        }

        setCardSecurityValue(e.target.value);
    }

    const save = async(submitEvent) => {
        submitEvent.preventDefault();
        
        setCardErrorValue('');
        setIsLoading(true);

        saveCard(token, cardholderValue, cardNumValue, cardExpiryValue, cardSecurityValue)
            .then(setSuccessValue('Details updated successfully.'))
            .catch(err => {
                const errType = String(err.response.status).charAt(0);
                const errMsg = errType === "4" ? err.response.data.error : "Something went wrong, please try again later";

                setCardErrorValue(errMsg);
            });

        setIsLoading(false);
    }

    useEffect(() => {
        getCardDetails(token)
            .then((data) => {
                setCardholder(data.data.name);
                setCardNumValue(data.data.number);
                setCardExpiryValue(data.data.expiry);
                setCardSecurityValue(data.data.cvv);
            })
            .catch(err => {
                const errType = String(err.response.status).charAt(0);
                const errMsg = errType === "400" ? err.response.data.error : "";

                setCardErrorValue(errMsg);
            });
    }, [token, isLoading]);

    return (
        <>
            <Heading size={5}>Card Details</Heading>
            {cardSuccessValue ? <Notification color="success">{cardSuccessValue}</Notification> : <></>}

            <form>
                <Form.Field>
                    <Form.Label>Cardholder Name</Form.Label>
                    <Form.Control>
                        <Form.Input name="cardName" type="text" inputMode="text" placeholder="John Doe" value={cardholderValue} onChange={changeCardholder} disabled={false} />
                    </Form.Control>
                </Form.Field>

                <Form.Field>
                    <Form.Label>Card Number</Form.Label>
                    <Form.Control>
                        <Form.Input name="cardNum" type="text" inputMode="numeric" placeholder="0000 0000 0000 0000" value={cardNumValue} onChange={changeCardNum} disabled={false} />
                    </Form.Control>
                </Form.Field>

                <Form.Field>
                    <Form.Label>Expiry Date</Form.Label>
                    <Form.Control>
                        <Form.Input name="cardExpiry" type="text" inputMode="numeric" placeholder="MM / YY" value={cardExpiryValue} onChange={changeCardExpiry} disabled={false} />
                    </Form.Control>
                </Form.Field>

                <Form.Field>
                    <Form.Label>Security Code</Form.Label>
                    <Form.Control>
                        <Form.Input name="cardSecurity" type="text" inputMode="numeric" placeholder="CVV" value={cardSecurityValue} onChange={changeCardSecurity} disabled={false} />
                    </Form.Control>
                </Form.Field>
                <p className="has-text-danger">{cardErrorValue}</p>
                <br/>
                <Button.Group align="left">
                    <Button color="primary" onClick={save} loading={isLoading} disabled={isLoading}>Update Card Details</Button>
                </Button.Group>
            </form>
        </>
    );
}

export default CardDetailsForm;