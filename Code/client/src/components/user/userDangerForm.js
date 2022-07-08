import { Button, Heading } from "react-bulma-components";
import { useHistory } from "react-router-dom";
import { deleteUser } from "../../api/user";
import { useToken } from "../../auth/useToken";
import useUser from "../../auth/useUser";

const UserDangerForm = ({isLoading, setIsLoading}) => {
    const [token,] = useToken();
    const user = useUser();
    const history = useHistory();

    const deleteAccount = () => {
        setIsLoading(true);
        deleteUser(token, user.email);
        setIsLoading(false);
        history.push('/logout');
    }

    return (
        <>
            <Heading size={5}>Danger Area</Heading>

            <Button.Group align="left">
                <Button color="danger" onClick={deleteAccount} loading={isLoading} disabled={isLoading}>Delete Account</Button>
            </Button.Group>
        </>
    )
}

export default UserDangerForm;