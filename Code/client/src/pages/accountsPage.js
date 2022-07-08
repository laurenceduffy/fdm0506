import { useState } from 'react';
import { Box, Heading, Form, Button, Columns } from 'react-bulma-components'
import { Link } from 'react-router-dom';
import { useEffect } from 'react/cjs/react.development';
import { getDetails, deactivateUser, reactivateUser, deleteUser, userRequests } from '../api/user';
import { useAdmin } from '../auth/useAdmin';

const AccountsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState(null);
    const [adminToken,] = useAdmin();

    const [datetimeField, setDatetimeField] = useState('');
    const [deactivateReason, setDeactivateReason] = useState('');

    const [toDelete, setToDelete] = useState([]);
    const [toReactivate, setToReactivate] = useState([]);

    const search = async() => {
        if(!searchTerm) return;

        await directSearch(searchTerm);
    }

    const directSearch = async(term) => {
        try {
            if(!term || !adminToken) return;

            const details = await getDetails(adminToken, term);
            setUser(details.data);
            setDeactivateReason('');
            setDatetimeField('');
        } catch {
            setUser(null);
        }
    }

    const deactivate = async() => {
        if(!datetimeField) return;

        await deactivateUser(adminToken, user.email, datetimeField, deactivateReason);
        search();
    }

    const reactivate = async() => {
        await reactivateUser(adminToken, user.email);
        search();
    }

    const deleteAccount = async() => {
        await deleteUser(adminToken, user.email);
    }

    const getRequests = async() => {
        const res = await userRequests(adminToken);

        setToDelete(res.data.deleteUsers);
        setToReactivate(res.data.reactivateUsers);
    }

    const UserList = ({users}) => {
        if(!users || users.length === 0) return (<p>N/A</p>);

        return users.map(data => {
            return (
            <Button key={data.id} value={data.email} color="ghost" onClick={(e) => {
                setSearchTerm(e.target.value);
                directSearch(e.target.value);
            }}>
                {data.email}
            </Button>);
        });
    }

    useEffect(() => {
        getRequests();
    }, [adminToken, user]);

    return (
        <>
            <Box style={{maxWidth:1200, margin:'auto'}}>
                <Heading color="dark" size="4" subtitle={false}>User Accounts</Heading>

                <Columns>
                    <Columns.Column size={6}>
                        <Form.Field kind="addons">
                            <Form.Control>
                                <Form.Input type="search" placeholder="Search" value={searchTerm} onChange={e => { setSearchTerm(e.target.value); }} style={{width:'500px'}} />
                            </Form.Control>
                            <Form.Control>
                                <Button color="primary" onClick={search}>Search</Button>
                            </Form.Control>
                        </Form.Field>
                        
                        <hr/>
                        { user ?
                        <>
                            <Heading size={5}>Details</Heading>
                            <p>User: {user.username}</p>
                            <p>Email: {user.email}</p>
                            <p>Account Created: {user.created}</p>

                            <hr/>

                            <Heading size={5}>Actions</Heading>

                            {user.isActive ?
                            <>
                                <p>Temporarily de-activate user account</p>
                                <br/>
                                <p>Re-activation date:</p>
                                <Form.Field>
                                    <Form.Control>
                                        <Form.Input type="datetime-local" value={datetimeField} onChange={e => {setDatetimeField(e.target.value)}}/>
                                    </Form.Control>
                                </Form.Field>
                                <p>Reason:</p>
                                <Form.Field>
                                    <Form.Control>
                                        <Form.Input type="text" value={deactivateReason} onChange={e => {setDeactivateReason(e.target.value)}}/>
                                    </Form.Control>
                                </Form.Field>

                                <Form.Field>
                                    <Form.Control>
                                        <Button color="danger" onClick={deactivate} style={{width:'200px'}}>De-Activate Account</Button>
                                    </Form.Control>
                                </Form.Field>
                            </>
                            :
                            <>
                                {user.deleteRequested ? 
                                <>
                                    <p className='has-text-danger'>This account has been flagged for removal by the user.</p>
                                    <br/>
                                    <Form.Field horizontal>
                                        <Form.Control>
                                            <Button color="danger" onClick={deleteAccount} style={{width:'200px'}}>Delete Account</Button>
                                        </Form.Control>
                                    </Form.Field>
                                </>
                                :
                                <>
                                    <p className='has-text-danger'>This account has been de-activated.</p>
                                    <p>Reason: "{user.deactivateReason}"</p>
                                    <p>Automatic re-activation on: {user.deactiveUntil}</p>
                                    <br/>
                                </>}

                                <>
                                    <Button color="warning" onClick={reactivate} style={{width:'200px'}}>Re-Activate Account</Button>
                                </>
                            </>
                            }
                        </>
                        :
                        <>
                            <Heading color="dark" size="6" subtitle={true}>Find a user account by searching via their registered <b>email address</b> or <b>username</b>.</Heading>
                        </>}
                    </Columns.Column>
                    <Columns.Column>
                        <Heading size={5}>Re-Activation Requests</Heading>
                        <UserList users={toReactivate} />
                    </Columns.Column>
                    <Columns.Column>
                        <Heading size={5}>Removal Requests</Heading>
                        <UserList users={toDelete} />
                    </Columns.Column>
                </Columns>
                
            </Box>
        </>
    );
}

export default AccountsPage;