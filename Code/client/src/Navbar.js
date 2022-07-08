import { Link } from 'react-router-dom';
import { Heading, Navbar, Notification } from 'react-bulma-components';
import { FaBalanceScale, FaUser, FaSignOutAlt, FaCaretDown, FaHistory, FaExclamationTriangle, FaDownload } from 'react-icons/fa';
import { useState, useRef, useEffect } from "react";
import useUser from './auth/useUser';
import { useToken } from './auth/useToken';
import { getBrokerAccount } from './api/account';
import getCurrencyString from './utility/currencyFormatting';
import { useDropdownCloser } from './utility/events';
import { useAdmin } from './auth/useAdmin';
import ReportView from './components/user/userReportView';

const AppNavbar = () => {
    const user = useUser();
    const [token,] = useToken();
    const [adminToken,] = useAdmin();
    
    const [accountMenuState, setAccountMenuState] = useState(false);
    const accountMenuRef = useRef(null);
    useDropdownCloser(accountMenuRef, setAccountMenuState);

    const [portfolioMenuState, setPortfolioMenuState] = useState(false);
    const portfolioMenuRef = useRef(null);
    useDropdownCloser(portfolioMenuRef, setPortfolioMenuState);

    const [burgerMenuState, setBurgerMenuState] = useState(false);
    const [availableFunds, setAvailableFunds] = useState(0);
    const [portfolioValue, setPortfolioValue] = useState(0);
    const accountValue = availableFunds + portfolioValue;

    const [loadingValues, setLoadingValues] = useState(true);

    const [reportModalOpen, setReportModalOpen] = useState(false);

    const setValues = async () => {
        setLoadingValues(true);
        const account = await getBrokerAccount(token);

        if(account){
            setAvailableFunds(account.funds);
            setPortfolioValue(account.portfolio);
        }
        
        setLoadingValues(false);
    }

    useEffect(() => {
        if(token) {
            setValues();
        }
    }, [burgerMenuState, portfolioMenuState, token])

    return (
        <>
            <Navbar color="dark" active={burgerMenuState}>
                <Navbar.Brand>
                    <Navbar.Item to="/" renderAs={Link} >
                        <Heading size="3" weight="light" className="has-text-primary mb-1"><FaBalanceScale className="pt-2"/><span>Simtrade</span></Heading>
                    </Navbar.Item>
                    <Navbar.Burger onClick={e => setBurgerMenuState(!burgerMenuState)} />
                </Navbar.Brand>
                <Navbar.Menu>
                    { user ? (
                        <>
                            <Navbar.Container align="right">
                                {adminToken ?
                                <>
                                    <Navbar.Item to="/accounts" renderAs={Link}>Accounts</Navbar.Item>
                                    <Navbar.Item to="/logout" renderAs={Link}>Logout</Navbar.Item>
                                </>
                                :
                                <>
                                    <Navbar.Item active={portfolioMenuState} domRef={portfolioMenuRef}>
                                        <Navbar.Link onClick={e => setPortfolioMenuState(!portfolioMenuState)} arrowless={true}>
                                            Account Value: <span className="ml-1 mr-2 has-text-weight-bold">{getCurrencyString(accountValue)}</span><FaCaretDown/>
                                        </Navbar.Link>
                                        <Navbar.Dropdown boxed={true}>
                                            <Navbar.Item renderAs="div">
                                                <Heading subtitle={true} size="6">Available Funds</Heading>
                                            </Navbar.Item>
                                            <Navbar.Item renderAs="p" className="pt-0 has-text-weight-bold has-text-success">
                                                {loadingValues ? '-' : getCurrencyString(availableFunds)}
                                            </Navbar.Item>
                                            <Navbar.Item renderAs="div">
                                                <Heading subtitle={true} size="6">Portfolio Value</Heading>
                                            </Navbar.Item>
                                            <Navbar.Item renderAs="p" className="pt-0 has-text-weight-bold has-text-primary">
                                                {loadingValues ? '-' : getCurrencyString(portfolioValue)}
                                            </Navbar.Item>
                                            {portfolioValue > 0 ?
                                                <>
                                                    <Navbar.Divider/>
                                                    <Navbar.Item onClick={() => {setReportModalOpen(true)}}>
                                                        <FaDownload className="mr-2 has-text-primary"/>
                                                        Download User Report
                                                    </Navbar.Item>
                                                </>
                                                :
                                                <></>}
                                        </Navbar.Dropdown>
                                    </Navbar.Item>

                                    <Navbar.Item active={accountMenuState} domRef={accountMenuRef}>
                                        <Navbar.Link onClick={e => setAccountMenuState(!accountMenuState)} arrowless={true}>
                                            Welcome: <span className="ml-1 mr-2 has-text-weight-bold">{user.username}</span><FaCaretDown/>
                                        </Navbar.Link>
                                        <Navbar.Dropdown boxed={true}>
                                            <Navbar.Item to="/account" renderAs={Link}><FaUser className="mr-2 has-text-primary"/>Account Details</Navbar.Item>
                                            <Navbar.Item to="/history" renderAs={Link} >
                                                <FaHistory className="mr-2 has-text-primary"/>
                                                Transaction History
                                            </Navbar.Item>
                                            <Navbar.Divider/>
                                            <Navbar.Item to="/logout" renderAs={Link}><FaSignOutAlt className="mr-2 has-text-danger"/>Logout</Navbar.Item>
                                        </Navbar.Dropdown>
                                    </Navbar.Item>
                                </>
                                }
                            </Navbar.Container>
                        </>
                    ):(
                        <Navbar.Container align="right">
                            <Navbar.Item to="/login" renderAs={Link}>
                                Log In
                            </Navbar.Item>
                            <Navbar.Item to="/register" renderAs={Link}>
                                Register
                            </Navbar.Item>
                        </Navbar.Container>
                    ) }
                </Navbar.Menu>
            </Navbar>
            {adminToken ? <Notification size="small" mb="0" color="warning" radiusless py="1" style={{position:"sticky", top:0, zIndex:1}}><FaExclamationTriangle className="pt-1" /> Admin Mode Enabled</Notification> : <></>}
            
            <ReportView modalOpen={reportModalOpen} setModalOpen={setReportModalOpen} />
        </>
    );
}

export default AppNavbar;