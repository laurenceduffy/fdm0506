import { verifyAdmin } from './api/admin';
import { Redirect, Route } from 'react-router-dom';
import { useAdmin } from './auth/useAdmin';

const AdminRoute = props => {
    const [admin,] = useAdmin();

    if(admin) {
        const verify = verifyAdmin(admin);

        if(verify) return <Route {...props} />
    }
    
    return <Redirect to={`/`} />
}

export default AdminRoute;