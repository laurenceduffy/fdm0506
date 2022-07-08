import { Redirect } from "react-router";

const LogoutPage = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('admin_token');
    
    return <Redirect to="/"/>
}

export default LogoutPage;