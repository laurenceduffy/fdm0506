import { Box, Heading } from "react-bulma-components";
import { useHistory } from "react-router";
import useUser from "../../auth/useUser";

const PleaseActivatePage = () => {
    const user = useUser();
    const history = useHistory();

    if(user && user.isActivated) {
        history.push('/');
    }

    return (
        <>
            <Box style={{maxWidth: 800, margin: 'auto'}}>
                <Heading>Activate your Account</Heading>
                <p>An email has been sent to <span>{user.email}</span>.</p>
                <p>Please follow the given instructions in the email to activate your account.</p>
            </Box>
        </>
    );
}

export default PleaseActivatePage;