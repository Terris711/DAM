import { useEffect, useRef, useState } from "react";
import "./App.css";
import Display from "./components/ImageDisplay/Display";
import SearchBar from "./components/SearchBar/SearchBar";
import Modal from "./components/Modal/Modal";
import FileUpload from "./components/FileUpload/FileUpload";
import Filter from "./components/Filter/Filter";
import ImageDetail from "./components/ImageDisplay/ImageDetail";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import Gallery from "./components/ImageGallery/Gallery";
import Navbar from "./components/Navbar/Navbar";
import { loginRequest } from "./AuthConfig";
import NavBarMobile from "./components/Navbar/NavBarMobile";



function App() {
  const { instance } = useMsal();

  const searchbarRef = useRef();
  const [query, setQuery] = useState({ search: "*", filter: "" });
  const [isImageDisplayed, setIsImageDisplayed] = useState(false);
  const [displayImageDetail, setDisplayImageDetail] = useState();
  const [searchAccuracy, setSearchAccuracy] = useState(0); 
  const toggleImageDisplay = () => setIsImageDisplayed((prev) => !prev);
  const onImageClickedHandler = (imageDetail) => {
    setDisplayImageDetail(imageDetail);
    toggleImageDisplay();
  };
  const onSearchBarInputKeyDownHandler = (event) => {
    if (event.key === "Enter") {
      setQuery((prev) => ({ search: event.target.value, filter: prev.filter })); 
    }
  };
  const handleClickSearchButton = () => {
    setQuery((prev) => ({ search: searchbarRef.current.value, filter: prev.filter })); 
  }

  const [file, setFile] = useState(null);
  const handleChange = (file) => {
    setFile(file);
    
  };
  return (
    <div>
      <Navbar setSearchAccuracy={setSearchAccuracy} searchAccuracy={searchAccuracy} >
      <div className="main-searchbar">
        <div className="searchbar-holder">
          <div className="title">PicSeeker</div>
          <div className="description">
            Search the company images you wanted within seconds
          </div>
        </div>
        <div className="align-search-input">
          <div className="search-box">
            <input
            ref={searchbarRef}
              onKeyDown={onSearchBarInputKeyDownHandler}
              className="searchbar-input"
              placeholder="What are you thinking?"
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" onClick={handleClickSearchButton}>
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>

          </div>
        </div>
      
      </div>
          <div>
            <Filter setQuery={setQuery} />
            <Display query={query} onImageClickHandler={onImageClickedHandler} searchAccuracy={searchAccuracy} />
            <Modal isOpen={isImageDisplayed} onClose={toggleImageDisplay}>
              <ImageDetail displayImageDetail={displayImageDetail} />
            </Modal>
          </div>
    </Navbar>

    </div>
  );
}

export default App;
