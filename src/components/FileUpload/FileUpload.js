import React, { useRef, useState } from 'react';
import "./FileUpload.css"
import AddTag from './AddTag';
import Modal from 'react-modal';
import { useDropzone } from 'react-dropzone';
const fileTypes = ["JPEG", "PNG", "GIF", "TIF", "JPG"];
const UPLOAD_ENDPOINT = "https://cbhazr-afn-img-dev-01.azurewebsites.net/api/ImageProcess";

const FileUpload = ({ closeModal, author }) => {

    const [tagList, setTagList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDuplicated, setShowDuplicated] = useState(false);
    const [showUploadError, setshowUploadError] = useState(false);
    const tagInputRef = useRef();
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [imageUrl, setImageUrl] = useState([]);
    const [imageUrlDuplicated, setImageUrlDuplicated] = useState([]);
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
                    setImageUrlDuplicated((prev) => [...prev, false]);
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
    const onTagSubmitHandler = async () => {
        setIsLoading(true);
        for (let i = 0; i < imageUrl.length; i++) {
            try {
                const url = imageUrl[i];
                const fileName = uploadedFiles[i].name;
                const response = await fetch(url);
                const imageBlob = await response.blob();

                const formData = new FormData();
                formData.append('image', imageBlob, fileName);
                formData.append('additionalTags', JSON.stringify(tagList));
                formData.append('author', author)
                const uploadResponse = await fetch(UPLOAD_ENDPOINT, {
                    method: 'POST',
                    body: formData,
                });

                try {
                    if (uploadResponse.ok) {
                        const responseText = await uploadResponse.text();
                        console.log('Success:', responseText);
                        closeModal();
                    } else {
                        /* Duplicates detected */
                        const errorResponseText = await uploadResponse.text();
                        console.log('Failed:', errorResponseText);
                        if (errorResponseText === 'Duplicate image detected!') {
                            setShowDuplicated(true);
                            setImageUrlDuplicated(prev => {
                                const copy = [...prev];
                                copy[i] = true;
                                return copy
                            })
                        } else {
                            setshowUploadError(true);
                        }

                    }
                    setIsLoading(false);
                } catch (error) {
                    console.error('Error:', error);
                }
            } catch (error) {
                console.error('Error:', error);
            }
            console.log("after")
            console.log(imageUrl);
        }
    }
    return (

        <div className='upload-form-fileupload'>
            <div className='upload-title'>
                Upload Your Images
            </div>
            <div className='upload-session' {...getRootProps()}>
                <div className='upload-session-outer'>
                    <div className='upload-session-inner'>
                        <svg

                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="upload-button-fu"
                        >
                            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />

                        </svg>
                    </div>
                </div>
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
            </div>
            <AddTag imageUrlDuplicated={imageUrlDuplicated} imageUrl={imageUrl} tagList={tagList} setTagList={setTagList} />
            <div className='submit-area'>
                {showUploadError && <div className='duplicated-message'>Error While Uploading! Please try again.</div>}
                {showDuplicated && <div className='duplicated-message'>Duplicated Image(s) Found! Please try again.</div>}
                <button className="submit-button" onClick={onTagSubmitHandler} >{isLoading ? <div className="spinner"></div> : 'Submit'}</button>
            </div>
        </div>
    );
};
export default FileUpload;