import Dashboard from "./dashboardPage";
import { Heading } from "react-bulma-components";
import useUser from "../auth/useUser";

const HomePage = () => {
    const user = useUser();
    
    const home = (
        <>
            <Heading>Home</Heading>
        </>
    );

    return (
        <>
            {user ? <Dashboard/> : home}
        </>
    );
}

export default HomePage;