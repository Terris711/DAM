import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { loginRequest, msalConfig } from './AuthConfig';
import ProfilePage from './components/ProfilePage/Profile';
import Modal from 'react-modal';  // Import react-modal library

// Set the app element for react-modal
Modal.setAppElement('#root');
const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
    },
    {
        path: "/profile",
        element: <ProfilePage />   
    }
]);


const msalInstance = new PublicClientApplication(msalConfig);
const handleLogin = () => {
  msalInstance.loginRedirect(loginRequest).catch((e) => {
    console.log(e);
  });
}


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(

  <RouterProvider router={router} />

        // <MsalProvider instance={msalInstance}>
        //     <AuthenticatedTemplate>
        //         <RouterProvider router={router} />
        //     </AuthenticatedTemplate>
        //     <UnauthenticatedTemplate>
        //       {handleLogin}
        //     </UnauthenticatedTemplate>
        // </MsalProvider>
);
