import React, { useState } from "react";
import { useToken } from "../../auth/useToken";
import { useHistory } from "react-router";
import axios from 'axios';
import { Heading, Box, Form, Button } from "react-bulma-components";
import { Link } from "react-router-dom";
import useQuery from "../../utility/useQuery";
import { useAdmin } from "../../auth/useAdmin";

const LoginPage = (props) => {
    const history = useHistory();
    const query = useQuery();
    const redirect = query.get("redirect");

    const [, setToken] = useToken();
    const [, setAdminToken] = useAdmin();
    const [isLoading, setIsLoading] = useState(false);
    const [errorValue, setErrorValue] = useState('');
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');

    const changeEmailField = e => {
        setEmailValue(e.target.value);
    }
    
    const changePasswordField = e => {
        setPasswordValue(e.target.value);
    }
    
    const login = async (submitEvent) => {
        submitEvent.preventDefault();

        setErrorValue('');
        setIsLoading(true);

        const requestOptions = {
            url: 'http://localhost:3333/login',
            method: 'post',
            data: {email: emailValue, password: passwordValue}
        }
        
        await axios(requestOptions)
            .then(data => {
                if(data.data.token) {
                    setToken(data.data.token);
                    
                    if(data.data.admin) {
                        setAdminToken(data.data.admin);
                    }

                    if(redirect) {
                        history.push(`/${redirect}`);
                    } else {
                        history.push('/');
                    }
                } else {
                    throw new Error('Something went wrong, please try again later.')
                }
            })
            .catch(err => {
                let errMsg;

                if(err.response){
                    const errType = String(err.response.status).charAt(0);
                    errMsg = errType === "4" ? err.response.data.error : "Something went wrong, please try again later";
                } else {
                    errMsg = err.message;
                }

                setErrorValue(errMsg);
                setIsLoading(false);
                setPasswordValue('');
            });
    }

    return (
        <>
            <Box style={{maxWidth: 600, margin: 'auto'}}>
                <Heading>Log In</Heading>
                <Form.Help color="danger">{errorValue}</Form.Help>
                <br/>
                <form>
                    <Form.Field>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control>
                            <Form.Input name="email" type="email" placeholder="email@domain.com" value={emailValue} onChange={changeEmailField} />
                        </Form.Control>
                    </Form.Field>
                    <Form.Field>
                        <Form.Label>Password</Form.Label>
                        <Form.Control>
                            <Form.Input name="password" type="password" placeholder="********" value={passwordValue} onChange={changePasswordField} />
                        </Form.Control>
                    </Form.Field>
                    <br/>
                    <Button.Group align="left">
                        <Button color="primary" onClick={login} loading={isLoading} disabled={isLoading}>Log In</Button>
                        <Button to="/login-help" renderAs={Link} color="ghost">Trouble signing in?</Button>
                        <Button to="/register" renderAs={Link} color="ghost">Don't have an account? Sign up</Button>
                    </Button.Group>
                </form>

            </Box>
        </>
    );
}

export default LoginPage;