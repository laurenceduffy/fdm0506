import axios from "axios";
import { useState } from "react";
import { useToken } from "../../auth/useToken";
import { Link, useHistory } from "react-router-dom";
import { Heading, Box, Form, Button } from "react-bulma-components";

const RegisterPage = () => {
    const history = useHistory();
    const [, setToken] = useToken();
    const [isLoading, setIsLoading] = useState(false);
    const [errorValue, setErrorValue] = useState('');
    const [usernameValue, setUsernameValue] = useState('');
    const [emailValue, setEmailValue] = useState('');
    const [forenameValue, setForenameValue] = useState('');
    const [surnameValue, setSurnameValue] = useState('');
    const [dobValue, setDobValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
    
    const register = async () => {
        setErrorValue('');
        setIsLoading(true);

        if(passwordValue !== confirmPasswordValue) {
            setErrorValue('Passwords do not match');
        } else {
            const requestOptions = {
                url: 'http://localhost:3333/register',
                method: 'post',
                data: {email: emailValue, password: passwordValue, username: usernameValue, forename: forenameValue, surname: surnameValue, dob: dobValue}
            }
            
            await axios(requestOptions)
                .then(data => {
                    console.log(data);
                    if(data.data.token) {
                        setToken(data.data.token);

                        history.push('/please-activate');
                    } else {
                        setErrorValue("Something went wrong, please try again later");
                    }
                })
                .catch(err => {
                    console.log(err);
                    const errType = String(err.response.status).charAt(0);
                    const errMsg = errType === "4" ? err.response.data.error : "Something went wrong, please try again later";
                    
                    setErrorValue(errMsg);
                });
        }

        setIsLoading(false);
        setConfirmPasswordValue('');
    }

    return (
        <>
            <Box style={{maxWidth: 600, margin: 'auto'}}>
                <Heading>Register an Account</Heading>
                <Form.Help color="danger">{errorValue}</Form.Help>
                <br/>
                <form>
                    <Form.Field>
                        <Form.Label>Username *</Form.Label>
                        <Form.Control>
                            <Form.Input name="username" type="username" placeholder="Username" value={usernameValue} onChange={e => {setUsernameValue(e.target.value)}} />
                        </Form.Control>
                    </Form.Field>
                    <Form.Field>
                        <Form.Label>Email Address *</Form.Label>
                        <Form.Control>
                            <Form.Input name="email" type="email" placeholder="email@domain.com" value={emailValue} onChange={e => {setEmailValue(e.target.value)}} />
                        </Form.Control>
                    </Form.Field>
                    <Form.Field>
                        <Form.Label>Forename(s) *</Form.Label>
                        <Form.Control>
                            <Form.Input name="forenames" type="forenames" value={forenameValue} placeholder="John" onChange={e => {setForenameValue(e.target.value)}} />
                        </Form.Control>
                    </Form.Field>
                    <Form.Field>
                        <Form.Label>Surname *</Form.Label>
                        <Form.Control>
                            <Form.Input name="surname" type="surname" value={surnameValue} placeholder="Doe" onChange={e => {setSurnameValue(e.target.value)}} />
                        </Form.Control>
                    </Form.Field>
                    <Form.Field>
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control>
                            <Form.Input name="birthdate" type="date" value={dobValue} onChange={e => {setDobValue(e.target.value)}} />
                        </Form.Control>
                    </Form.Field>
                    <Form.Field>
                        <Form.Label>Password *</Form.Label>
                        <Form.Control>
                            <Form.Input name="password" type="password" placeholder="Enter Password" value={passwordValue} onChange={e => {setPasswordValue(e.target.value)}} />
                        </Form.Control>
                    </Form.Field>
                    <Form.Field>
                        <Form.Label>Confirm Password *</Form.Label>
                        <Form.Control>
                            <Form.Input name="confirmPassword" type="password" placeholder="Re-Type Password" value={confirmPasswordValue} onChange={e => {setConfirmPasswordValue(e.target.value)}} />
                        </Form.Control>
                    </Form.Field>
                    <p>* Required Fields</p>
                    <br/>
                    <Button.Group align="left">
                        <Button color="primary" onClick={register} loading={isLoading} disabled={isLoading}>Sign Up</Button>
                        <Button to="/login" renderAs={Link} color="ghost">Already have an account? Log in</Button>
                    </Button.Group>
                </form>

            </Box>
        </>
    );
}

export default RegisterPage;