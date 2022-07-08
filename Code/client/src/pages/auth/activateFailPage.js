import { Heading } from "react-bulma-components";
import { useHistory } from "react-router";
import useUser from "../../auth/useUser";

const ActivateFailPage = () => {
    const user = useUser();
    const history = useHistory();

    if(user.isActivated) history.push('/activation-success');

    return (
        <>
            <Heading>Activation Unsuccessful</Heading>
            <p>Your account has not been activated. Try again later.</p>
        </>
    );
}

export default ActivateFailPage;