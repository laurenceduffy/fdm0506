import { useState } from "react";
import getTokenPayload from "../utility/parseJwt";

const useToken = () => {
    const [token, setTokenInternal] = useState(() => {
        const storedToken = localStorage.getItem('auth_token');
        const now = Date.now();
        
        if(storedToken && getTokenPayload(storedToken).exp < (now / 1000)) {
            localStorage.removeItem('auth_token');
        }

        return storedToken;
    });

    const setToken = newToken => {
        localStorage.setItem('auth_token', newToken);
        setTokenInternal(newToken);
    }

    return [token, setToken];
}

export { useToken };