import React, { useEffect, useState } from 'react'
import './Navbar.css'
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { graphConfig, loginRequest } from '../../AuthConfig';
import { callMsGraph } from '../../services/Graph';
import FileUpload from '../FileUpload/FileUpload';
import NavbarDesktop from './NavbarDesktop';
import NavBarMobile from './NavBarMobile';
import Modal from '../Modal/Modal';


const Navbar = ({ children,chosenTabPrev, searchAccuracy, setSearchAccuracy }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);       
  const [profilePic, setProfilePic] = useState(null);
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    if (graphData && !profilePic) {
      setProfilePic(generateDefaultProfilePicture(graphData.displayName));
    }
  }, [graphData]);
   const { instance, accounts, inProgress } = useMsal();

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


        // //TODO: to be verified
        // const profilePhoto = await callMsGraph(response.accessToken, graphConfig.graphPhotoEndpoint); // to be further tested
        // if (!profilePhoto.error) {
        //   setProfilePic(profilePhoto.toDataURL());
        // }
        setGraphData(graphResponse);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: "/",
      mainWindowRedirectUri: "/",
    });
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <>
    {isMobile ? <NavBarMobile  graphData={graphData} profilePic={profilePic} openModal={openModal} handleLogout={handleLogout} /> 
    :
    <NavbarDesktop handleLogout={handleLogout} chosenTabPrev={chosenTabPrev} graphData={graphData} profilePic={profilePic} searchAccuracy={searchAccuracy} setSearchAccuracy={setSearchAccuracy} openModal={openModal} />}
      <div className='main-content-navbar'> 
        {children}
      </div>
      <Modal  isOpen={isModalOpen} onClose={closeModal}>
                <FileUpload
                author = {graphData && graphData.mail}
                    imageUrl={[]}
                    uploadedFiles={[]}
                    closeModal={closeModal}
                />
            </Modal>
    </>
  )
}

export default Navbar


function generateDefaultProfilePicture(name, size = 200, backgroundColor = '#DCDCDC', textColor = '#000000') {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');

  // Fill background
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, size, size);

  // Draw text (initials)
  context.font = `${size / 3}px Arial`;
  context.fillStyle = textColor;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  const split = name.split(' ');
  const initials = split[0][0] + split[1][0];
  context.fillText(initials, size / 2, size / 2 + 10);

  return canvas.toDataURL();
}
