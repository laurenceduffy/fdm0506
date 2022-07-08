import useUser from "../../auth/useUser";
import { Heading, Button, Form, Notification } from "react-bulma-components";
import { useEffect, useState } from "react";
import { updateUserDetails } from "../../api/user";
import { useToken } from "../../auth/useToken";

const UserDetailsForm = ({isLoading, setIsLoading}) => {
    const user = useUser();
    const [token,] = useToken();

    const [successMsg, setSuccessMsg] = useState('');

    const [lockEmail, setLockEmail] = useState(true);
    const [emailErrorValue, setEmailErrorValue] = useState('');
    const [emailValue, setEmailValue] = useState(user.email);

    const [lockPassword, setLockPassword] = useState(true);
    const [passwordErrorValue, setPasswordErrorValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [confirmPasswordValue, setConfirmPasswordValue] = useState('');

    useEffect(() => {
        setPasswordErrorValue('');
        setPasswordValue('');
        setConfirmPasswordValue('');
    }, [lockPassword]);

    useEffect(() => {
        setEmailErrorValue('');
        setEmailValue(user.email);
    }, [lockEmail]);

    const cancel = e => {
        e.preventDefault();
        setLockPassword(true);
        setLockEmail(true);
        setEmailValue(user.email);
    }

    const unlockEmail = e => {
        e.preventDefault();
        setLockPassword(true);
        setLockEmail(false);
    }

    const changeEmailConfirm = e => {
        e.preventDefault();
        setIsLoading(true);

        updateUserDetails(token, {email: emailValue})
            .then(() => {
                const email = emailValue;
                setSuccessMsg(`A confirmation email has been sent to ${email}. You will need to follow the activation process before you can log in with the new email address.`);
                setLockEmail(true);
            })
            .catch(err => {
                const errType = String(err.response.status).charAt(0);
                const errMsg = errType === "4" ? err.response.data.error : "Something went wrong, please try again later";

                setEmailErrorValue(errMsg);
            });

        setIsLoading(false);
    }

    const changeEmailField = e => {
        setEmailValue(e.target.value);
    }

    const unlockPassword = e => {
        e.preventDefault();
        setLockEmail(true);
        setLockPassword(false);
    }

    const changePasswordConfirm = e => {
        e.preventDefault();
        setIsLoading(true);

        if(passwordValue !== confirmPasswordValue) {
            setPasswordErrorValue('Passwords do not match.');
        } else {
            updateUserDetails(token, {password: passwordValue})
                .then(() => {
                    setSuccessMsg(`Password changed successfully.`);
                    setLockPassword(true);
                })
                .catch(err => {
                    const errType = String(err.response.status).charAt(0);
                    const errMsg = errType === "4" ? err.response.data.error : "Something went wrong, please try again later";

                    setPasswordErrorValue(errMsg);
                });
        }

        setIsLoading(false);
    }

    const changePasswordField = e => {
        setPasswordValue(e.target.value);
    }

    const changeConfirmPasswordField = e => {
        setConfirmPasswordValue(e.target.value);
    }

    return (
        <>
            <Heading size={5}>User Details</Heading>
            {successMsg ? <Notification color="success">{successMsg}</Notification> : <></>}
        
            <form>
                <Form.Field>
                    <Form.Label>
                        Username
                    </Form.Label>
                    <Form.Control>
                        <Form.Input name="username" type="username" placeholder="Username" value={user.username} disabled={true} />
                    </Form.Control>
                </Form.Field>

                <Form.Field>
                    <Form.Label>
                        Email Address
                        { lockEmail ?
                            (<Button color="ghost" size="small" onClick={unlockEmail}>Edit</Button>)
                            :
                            (<Button size="small" onClick={cancel} color="ghost" className="has-text-danger">Cancel</Button>)
                        }
                        </Form.Label>
                    <Form.Control>
                        <Form.Input name="email" type="email" placeholder="email@domain.com" value={emailValue} onChange={changeEmailField} disabled={lockEmail} />
                    </Form.Control>
                </Form.Field>

                {lockEmail ? <></> : 
                <>
                    <p className="has-text-danger">{emailErrorValue}</p>
                    <br/>

                    <Button.Group align="left">
                        <Button color="primary" onClick={changeEmailConfirm} loading={isLoading} disabled={isLoading}>Save Email</Button>
                    </Button.Group>
                </>
                }

                <Form.Field>
                    <Form.Label>
                        Password
                        { lockPassword ?
                            (<Button color="ghost" size="small" onClick={unlockPassword}>Edit</Button>)
                            :
                            (<Button size="small" onClick={cancel} color="ghost" className="has-text-danger">Cancel</Button>)
                        }
                    </Form.Label>
                    <Form.Control>
                        <Form.Input name="password" type="password" placeholder="********" value={passwordValue} onChange={changePasswordField} disabled={lockPassword} />
                    </Form.Control>
                </Form.Field>

                {lockPassword ? <></> : 
                <>
                    <Form.Field>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control>
                            <Form.Input name="confirm" type="password" placeholder="********" value={confirmPasswordValue} onChange={changeConfirmPasswordField} />
                        </Form.Control>
                    </Form.Field>

                    <p className="has-text-danger">{passwordErrorValue}</p>
                    <br/>

                    <Button.Group align="left">
                        <Button color="primary" onClick={changePasswordConfirm} loading={isLoading} disabled={isLoading}>Save New Password</Button>
                    </Button.Group>
                </>
                }
            </form>
        </>
    );
}

export default UserDetailsForm;