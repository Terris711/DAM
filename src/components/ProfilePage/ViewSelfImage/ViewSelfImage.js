import React, { useState, useEffect } from 'react';
import Gallery from '../../ImageGallery/Gallery';
import { GetRequest } from '../../../services/RestRequest';

const ViewSelfImage = ({ graphData }) => {
    const [images, setImages] = useState([]); // Use useState to initialize images state

    useEffect(() => {
        const getAndSetImages = async () => {
            const url = new URL('https://imageanalysiscbh.azurewebsites.net/api/ClientQuery');

            url.search = new URLSearchParams({
                'code': 'fdwIOewySupWl_ce1776gk30wl-ZVS7eGNPvuduUFYm0AzFuJZcQGA==',
                'query': '*',
                'userFilter': graphData.mail,
                'top': 999,
                'skip': 0
            }).toString();
            console.log(url.toString());
            const data = await GetRequest(url);
            if (data.value && data.value.length > 0) {
                const fetchedImages = data.value.map(item => ({ score: item['@search.score'], src: item.thumbnail, id: item.id }));
                setImages(fetchedImages); // Update images state
            }
        }
        getAndSetImages();

    }, [graphData.mail]); // Add author as a dependency

    return (
        <>
            {images.length > 0 && <Gallery imageList={images} onImageClickHandler={() => {}} />}
        </>
    )
}

export default ViewSelfImage;
