import React, { useState } from "react";
import { Heading, Box, Form, Button } from "react-bulma-components";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import { requestReactivateUser } from "../../api/user";

const LoginHelpPage = () => {
    const [reactivateEmail, setReactivateEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const submitReactivate = async() => {
        setErrorMsg('');
        setSuccessMsg('');
        setIsLoading(true);

        try {
            await requestReactivateUser(reactivateEmail);
            setSuccessMsg('Request sent successfully');
        } catch {
            setErrorMsg('Something went wrong. Please try again later.')
        }

        setIsLoading(false);
    }

    return (
        <>
            <Box style={{maxWidth: 600, margin: 'auto'}}>
                <Heading>Trouble Signing In?</Heading>
                <p className="has-text-success">{successMsg}</p>
                <p className="has-text-danger">{errorMsg}</p>
                <br/>

                <Heading size={5}>De-Activated Account?</Heading>
                <p>If you cannot sign into your account due to de-activation, enter your email address below to request re-activation of your account:</p>
                <br/>
                <Form.Field kind="addons">
                    <Form.Control style={{width:'500px'}}>
                        <Form.Input name="email" type="email" placeholder="email@domain.com" value={reactivateEmail} onChange={(e) => {setReactivateEmail(e.target.value)}}/>
                    </Form.Control>
                    <Form.Control>
                    <Button color="primary" loading={isLoading} disabled={isLoading} onClick={submitReactivate}>Request Re-Activation</Button>
                    </Form.Control>
                </Form.Field>

                <br/>
                <Button to="/login" renderAs={Link} color="ghost">Back to Login</Button>
            </Box>
        </>
    );
}

export default LoginHelpPage;