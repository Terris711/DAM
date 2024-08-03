import React, { useEffect, useState } from 'react'
import logo from '../../assests/cbh_logo.png';
import './NavBarMobile.css'
import { Link } from 'react-router-dom';
const NavBarMobile = ({ graphData, profilePic, openModal, handleLogout }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 100) { // Adjust the scroll distance as needed
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={`navbar-mobile ${scrolled ? "navbar-mobile-scrolled" : ""}`}>
            <Link to='/' > <img src={logo} className='navbar-logo-mobile' /></Link>
            <div className='options-navbar-mobile'>
                <div onClick={openModal} className='option-navbar-mobile'>Upload</div>
                <div onClick={handleLogout} className='option-navbar-mobile'>Log out</div>
                <Link to={`/profile`}
                    state={{ graphData, chosenTab: "profile", profilePic }}><img className='profile-navbar-mobile' src={profilePic} /></Link>
            </div>
        </div>
    )
}

export default NavBarMobile