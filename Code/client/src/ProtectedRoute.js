import useUser from './auth/useUser';
import { Redirect, Route } from 'react-router-dom';

const ProtectedRoute = props => {
    const user = useUser();

    if(!user) return <Redirect to={`/login?redirect=account`} />

    return <Route {...props} />
}

export default ProtectedRoute;