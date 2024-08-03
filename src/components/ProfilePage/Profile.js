import React from 'react'
import UserDetail from './UserDetail/UserDetail'
import SearchBar from '../SearchBar/SearchBar'
import { useLocation } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import ViewSelfImage from './ViewSelfImage/ViewSelfImage'

const ProfilePage = (props) => {
    const location = useLocation();
    const {graphData, chosenTab, profilePic, author} = location.state;
    console.log("chosen:" +chosenTab);
    console.log(graphData);
    return (
        <div>
            <Navbar chosenTabPrev={chosenTab}>
            <UserDetail graphData={graphData} profilePic={profilePic} />
            </Navbar>
        </div>
    )
}

export default ProfilePage