import { useState } from "react";
import getTokenPayload from "../utility/parseJwt";

const useAdmin = () => {
    const [adminToken, setAdminTokenInternal] = useState(() => {
        const storedToken = localStorage.getItem('admin_token');
        const now = Date.now();
        
        if(storedToken && getTokenPayload(storedToken).exp < (now / 1000)) {
            localStorage.removeItem('admin_token');
        }

        return storedToken;
    });

    const setAdminToken = newToken => {
        localStorage.setItem('admin_token', newToken);
        setAdminTokenInternal(newToken);
    }

    return [adminToken, setAdminToken];
}

export { useAdmin };