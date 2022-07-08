import { Heading, Button, Form, Notification } from "react-bulma-components";
import { useEffect, useState } from "react";
import { useToken } from "../../auth/useToken";
import { getDetailsFromToken, updateUserDetails } from "../../api/user";

const PersonalDetailsForm = ({isLoading, setIsLoading}) => {
    const [token,] = useToken();

    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [nameValue, setNameValue] = useState('');
    const [initialDobValue, setInitialDobValue] = useState('');
    const [dobValue, setDobValue] = useState('');

    const dobConfirm = async(e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        setIsLoading(true);

        await updateUserDetails(token, {dob: dobValue})
            .then(() => {
                setSuccessMsg(`Details updated successfully.`);
            })
            .catch(err => {
                const errType = String(err.response.status).charAt(0);
                const errMsg = errType === "4" ? err.response.data.error : "Something went wrong, please try again later";

                setErrorMsg(errMsg);
            });

        setIsLoading(false);
    }

    const getUserDetails = async() => {
        if(token) {
            const res = await getDetailsFromToken(token);

            setNameValue(res.data.forename + ' ' + res.data.surname);

            if(res.data.dob) {
                setDobValue(res.data.dob.split('T')[0]);
                setInitialDobValue(res.data.dob.split('T')[0]);
            }
        }
    }

    useEffect(() => {
        getUserDetails();
    }, [token]);

    return (
        <>
            <Heading size={5}>Personal Details</Heading>
            {successMsg ? <Notification color="success">{successMsg}</Notification> : <></>}
        
            <form>
            <Form.Field>
                    <Form.Label>
                        Name
                    </Form.Label>
                    <Form.Control>
                        <Form.Input name="name" type="name" placeholder="Name" value={nameValue} disabled={true} />
                    </Form.Control>
                </Form.Field>

                <Form.Field>
                    <Form.Label>
                        Date of Birth
                    </Form.Label>
                    <Form.Control>
                        <Form.Input name="dob" type="date" value={dobValue} disabled={initialDobValue} onChange={e => setDobValue(e.target.value)} />
                    </Form.Control>
                </Form.Field>

                <p className="has-text-danger">{errorMsg}</p>

                {
                    dobValue === initialDobValue || successMsg ? <></> :
                    <>
                        <br/>
                        <Button.Group align="left">
                            <Button color="primary" onClick={dobConfirm} loading={isLoading} disabled={isLoading}>Confirm Changes</Button>
                        </Button.Group>
                    </>
                }
            </form>
        </>
    );
}

export default PersonalDetailsForm;