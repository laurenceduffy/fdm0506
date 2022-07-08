import { useState, useEffect } from "react";
import { useToken } from "./useToken";
import getTokenPayload from "../utility/parseJwt";

const useUser = () => {
    const [token] = useToken();

    const [user, setUser] = useState(() => {
        if(!token) return null;
        return getTokenPayload(token);
    });

    useEffect(() => {
        if(!token) {
            setUser(null);
        } else {
            setUser(getTokenPayload(token));
        }
    }, [token]);

    return user;
}

export default useUser;