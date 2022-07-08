import useUser from './auth/useUser';
import { Redirect, Route } from 'react-router-dom';

const AnonymousRoute = props => {
    const user = useUser();

    if(user) return <Redirect to="/" />

    return <Route {...props} />
}

export default AnonymousRoute;