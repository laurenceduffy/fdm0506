import { useHistory, useParams } from "react-router";
import axios from "axios";
import {useToken} from "../../auth/useToken";

const ActivatePage = () => {
    const history = useHistory();
    const { email, code } = useParams();
    const [,setToken] = useToken();

    const requestOptions = {
        url: 'http://localhost:3333/activate',
        method: 'post',
        data: { email, code }
    }
    
    axios(requestOptions)
        .then(data => {
            if(data.data.token) {
                setToken(data.data.token);
                history.push('/activation-success');
            } else {
                history.push('/activation-fail');
            }
        })
        .catch(err => {
            history.push('/activation-fail');
        });

    return (
    <>
        <p>Activating...</p>
    </>);
}

export default ActivatePage;