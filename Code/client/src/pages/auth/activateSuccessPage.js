import { useEffect } from "react";
import { Heading } from "react-bulma-components";
import { useHistory } from "react-router";

const ActivateSuccessPage = () => {
    const history = useHistory();

    useEffect(() => {
        setTimeout(() => {
            history.push('/');
        }, 3000);
    }, [history]);  

    return (
        <>
            <Heading>Activation Successful</Heading>
            <p>Your account has been activated. You will now be redirected.</p>
        </>
    );
}

export default ActivateSuccessPage;