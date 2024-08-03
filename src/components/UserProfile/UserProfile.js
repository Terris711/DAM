import React, { useEffect, useState } from 'react';
import './UserProfile.css';
import { loginRequest } from "../../AuthConfig";
import { useMsal } from '@azure/msal-react';
import { callMsGraph } from '../../services/Graph';
import avatar from '../../assests/avatar_placeholder.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const { instance, accounts, inProgress } = useMsal();
    const [graphData, setGraphData] = useState(null);

    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchData = async () => {
            if (inProgress === "login") {
                return;
            }

            if (!accounts || accounts.length === 0) {
                await instance.loginPopup(loginRequest);
                return;
            }

            try {
                const response = await instance.acquireTokenSilent({
                    ...loginRequest,
                    account: accounts[0],
                });

                const graphResponse = await callMsGraph(response.accessToken);
                console.log(graphResponse)
                setGraphData(graphResponse);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [instance, accounts, inProgress]);

    const handleLogout = () => {
        instance.logoutPopup({
            postLogoutRedirectUri: "/",
            mainWindowRedirectUri: "/",
        });
    };


    return (
        <div className='dropdown'>
            <img src={avatar} className='login-avatar' />
            <div className='dropdown-content'>
                {!graphData ? <div>Loading...</div> : 
                <div>
                <div>Hello! {graphData.displayName}</div>
                <Link to={`/profile`} state={graphData} >View Profile</Link>
                </div>
                }
                <div onClick={handleLogout}>Sign out</div>
            </div>
        </div>
    );
};

export default UserProfile;
