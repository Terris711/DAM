import React, { useEffect, useRef, useState } from 'react'
import './ImageDetail.css'
import example from '../../assests/example.jpg';

const EDIT_TAG_ENDPOINT = "https://imageanalysiscbh.azurewebsites.net/api/EditTags";

const ImageDetail = ({ displayImageDetail }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedImageDetail, setFetchedImageDetail] = useState();
  const [tagList, setTagList] = useState();
  const addTagRef = useRef();
  useEffect(() => {
    const url = new URL('https://imageanalysiscbh.azurewebsites.net/api/ViewImageDetail');
    url.search = new URLSearchParams({
      'documentId': displayImageDetail.id
    }).toString();

    
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.error('Server responded with non-OK status:', response.status);
          return response.text().then(text => {
            throw new Error(text);
          });
        }
      })
      .then(data => {
        setFetchedImageDetail(data);
        console.log("Data: ");
        console.log(data);
        setTagList([...data.tags]);

      })
      .catch(error => {
        console.error('Error fetching images:', error);
      });
  }, []);

  const onDownloadHandler = async (event) => {
    const url = new URL('https://imageanalysiscbh.azurewebsites.net/api/DownloadIncrement');
    url.search = new URLSearchParams({
      'documentId': displayImageDetail.id
    }).toString();
    try {
      const response = await fetch(url, {
        method: 'GET'
      });
      if (response.ok) {
        console.log("download increase succesfully")
      }
    } catch (error) {
      console.log(error);
    }

  }

  const onRemoveTagHandler = (index) => {
    setFetchedImageDetail(prev => {
      const copy = { ...prev };
      copy.tags.splice(index, 1);
      return copy;
    })
  }
  const onInputKeyDownHandler = (event) => {
    if (event.key === 'Enter') {
      const cur = addTagRef.current.value;
      if (cur) {
        setFetchedImageDetail(prev => {
          const copy = { ...prev };
          copy.tags.push(cur);
          return copy;
        })
        addTagRef.current.value = "";
      }
    }
  }

  const onSaveTagsHandler = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(EDIT_TAG_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId: displayImageDetail.id,
          tags: fetchedImageDetail.tags
        })
      });
      setIsLoading(false);
      setTagList([...fetchedImageDetail.tags]);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Optionally handle the response, e.g., show a success message or update state
      console.log('Tags saved successfully');
    } catch (error) {
      alert("Error saving tags: " + error);
      setIsLoading(false);
    }
    console.log(fetchedImageDetail);
  };
  return (
    <>
      {fetchedImageDetail && <div className='image-detail-wrapper'>
        <div className='image-uploader-detail'>
          <img src={example} className='image-uploader' />
          <div>Thi Van Anh Duong</div>
        </div>
        <div class="click-zoom">
          <label>
            <input type="checkbox" />
            <img className='img-detail' src={fetchedImageDetail.url} />

          </label>
        </div>




        <div className="share-option-container">
          <div className="share-button">
            <div>Download</div>
            <a onClick={onDownloadHandler} href={fetchedImageDetail.url} >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="share-icon">
                <path fill-rule="evenodd" d="M9.75 6.75h-3a3 3 0 0 0-3 3v7.5a3 3 0 0 0 3 3h7.5a3 3 0 0 0 3-3v-7.5a3 3 0 0 0-3-3h-3V1.5a.75.75 0 0 0-1.5 0v5.25Zm0 0h1.5v5.69l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72V6.75Z" clip-rule="evenodd" />
                <path d="M7.151 21.75a2.999 2.999 0 0 0 2.599 1.5h7.5a3 3 0 0 0 3-3v-7.5c0-1.11-.603-2.08-1.5-2.599v7.099a4.5 4.5 0 0 1-4.5 4.5H7.151Z" />              </svg>
            </a>

          </div>
          <div className="share-button">
            <div>Like</div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="share-icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />

            </svg>
          </div>
          <div className="share-button">
            <div>Share</div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="share-icon">
              <path fill-rule="evenodd" d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z" clip-rule="evenodd" />
            </svg>
          </div>

          <div className='share-button'>
            <div>Option</div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="share-icon">
              <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm0 8.625a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM15.375 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>

        <div className='date-container'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="share-icon">
            <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
            <path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clip-rule="evenodd" />
          </svg>

          <p className="date-text">
            Caption: {fetchedImageDetail.caption}
          </p>
        </div>
        <div className='date-container'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="share-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>


          <p className="date-text">
            View: {fetchedImageDetail.view}
          </p>
        </div>
        <div className='date-container'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="share-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
          </svg>


          <p className="date-text">
            Download: {fetchedImageDetail.download}
          </p>
        </div>
        <div className='date-container'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="share-icon">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
          </svg>


          <p className="date-text">
            Date taken: {fetchedImageDetail.dateTaken}
          </p>
        </div>


        <div className='date-container'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="share-icon">
            <path fill-rule="evenodd" d="M5.25 2.25a3 3 0 0 0-3 3v4.318a3 3 0 0 0 .879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 0 0 5.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 0 0-2.122-.879H5.25ZM6.375 7.5a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" clip-rule="evenodd" />
          </svg>

          <p className="date-text">
            Tags:
          </p>
        </div>
        <div className='caption-pad'>
          <div className='tag-container-detail'>
            {fetchedImageDetail.tags.map((tag, index) => <div className='tag-edit'>{tag} <svg onClick={() => onRemoveTagHandler(index)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="remove-tag-icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            </div>)}
          </div>

          <input onKeyDown={onInputKeyDownHandler} ref={addTagRef} className='field-input-add-tag' placeholder='Add more tags to your image' />
        </div>
        {
          fetchedImageDetail.tags.toString() !== tagList.toString() &&
          <div className='button-wrapper'>
            <button className='button-30' onClick={onSaveTagsHandler}> {isLoading ? <div className="spinner"></div> : 'Save'}</button>
          </div>
        }

      </div>}
    </>
  )
}
export default ImageDetail
