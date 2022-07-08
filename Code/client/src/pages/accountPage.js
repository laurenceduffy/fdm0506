import { useState } from "react";
import { Box, Heading } from "react-bulma-components";
import CardDetailsForm from "../components/user/cardDetailsForm";
import UserDetailsForm from "../components/user/userDetailsForm";
import UserDangerForm from "../components/user/userDangerForm";
import PersonalDetailsForm from "../components/user/personalDetailsForm";

const AccountPage = () => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <>
            <Box style={{maxWidth:1200, margin:'auto'}}>
                <Heading color="dark" size="4" subtitle={false}>My Account</Heading>
                <hr/>
                <UserDetailsForm isLoading={isLoading} setIsLoading={setIsLoading} />
                <hr/>
                <PersonalDetailsForm isLoading={isLoading} setIsLoading={setIsLoading} />
                <hr/>
                <CardDetailsForm isLoading={isLoading} setIsLoading={setIsLoading} />
                <hr/>
                <UserDangerForm isLoading={isLoading} setIsLoading={setIsLoading} />
            </Box>
        </>
    );
};

export default AccountPage;