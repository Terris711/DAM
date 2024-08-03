import React, { useState, useRef, useEffect } from 'react';
import logo from '../../assests/cbh_logo.png';
import './SearchBar.css';
import Modal from '../Modal/Modal';
import FileUpload from '../FileUpload/FileUpload';
import { useDropzone } from "react-dropzone";
import UserProfile from "../UserProfile/UserProfile";
import { useIsAuthenticated } from '@azure/msal-react';
import { Link } from 'react-router-dom';


const fileTypes = ["JPEG", "PNG", "GIF", "TIF", "JPG"];
const SearchBar = ({setQuery}) => {
  const [scrolled, setScrolled] = useState(false);
  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 20) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const [imageUrl, setImageUrl] = useState([]);
  const isAuthenticated = useIsAuthenticated();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setUploadedFiles(acceptedFiles);
      console.log(acceptedFiles[0].name);
      acceptedFiles.forEach((file) => {
        const fileType = file.path.substring(file.path.lastIndexOf(".") + 1);
        let isValid = false;
        for (let type of fileTypes) {
          console.log(type + " " + fileType);
          if (type === fileType.toUpperCase()) {
            isValid = true;
          }
        }
        if (isValid === false) {
          return;
        }

        const reader = new FileReader();
        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = () => {
          const binaryStr = reader.result;
          const blob = new Blob([binaryStr], { type: "image/jpeg" }); // Adjust the MIME type as necessary
          // Create a URL for the Blob
          const url = URL.createObjectURL(blob);
          // Set the URL as the image source
          console.log(url);

          setImageUrl((prev) => [...prev, url]);
          openModal();
        };
        reader.readAsArrayBuffer(file);
      });
    },
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/tiff": [],
      "image/jpg": [],
    },
  });


  const queryRef = useRef();
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setQuery(prev => ({ search: event.target.value, filter: prev.filter })); // Update the query state in the parent component
    }
  };

  const searchHandler = () => {
    setQuery(prev => ({ search: queryRef.current.value, filter: prev.filter }));
  }

  return (
    <div className='top-bar'>
      <div           className={
            scrolled ? "searchbar-outer white-background" : "searchbar-outer"
          }>
        <Link to={"/"} ><img className='logo' src={logo} alt="logo" /></Link>

        <div className={scrolled ? 'search-wrap' : 'search-bar-hidden'} >
          <input
            ref={queryRef}
            className='searchbar'
            placeholder='Search your image'
            onKeyDown={handleKeyDown} // Set up onKeyDown event handler
          />
          <svg onClick={searchHandler} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="search-icon">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <div
        >
          <div>
            <input
              {...getInputProps()}
              directory=""
              webkitdirectory=""
              type="file"
            />
          </div>
          <div className="searchbar-right">

            <svg
              {...getRootProps()}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="upload-button"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <FileUpload
          imageUrl={imageUrl}
          uploadedFiles={uploadedFiles}
          closeModal={closeModal}
        />
      </Modal>
    </div>
  );
};

export default SearchBar;
