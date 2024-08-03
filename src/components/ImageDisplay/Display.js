import React, { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import Gallery from '../ImageGallery/Gallery';
import './Display.css'
import { GetRequest } from '../../services/RestRequest';
const DEFAULT_PAGINATION = { top: 30, skip: 0 };
const Display = ({ query, onImageClickHandler, searchAccuracy }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  useEffect(() => {
    const handleScroll = debounce(() => {
      const distanceFromBottom = document.body.scrollHeight - (window.scrollY + window.innerHeight);
      const threshold = 100;
      if (distanceFromBottom <= threshold) {
        setPagination(prevPagination => {
          const copy = { ...prevPagination };
          copy.skip += copy.top;
          return copy;
        });
      }
    }, 200);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);



  useEffect(() => {
    setPagination(DEFAULT_PAGINATION);
    const getAndSetImages = async () => {
      const url = new URL('https://imageanalysiscbh.azurewebsites.net/api/ClientQuery');
      url.search = new URLSearchParams({
        'code': 'fdwIOewySupWl_ce1776gk30wl-ZVS7eGNPvuduUFYm0AzFuJZcQGA==',
        'query': query.search,
        'filter': query.filter.toLowerCase(),
        'top': pagination.top,
        'skip': pagination.skip
      }).toString();
      setIsLoading(true);
      const data = await GetRequest(url);
      console.log("useEffect images: ")
      console.log(data);
      const fetchedImages = data.value.map(item => ({ score: item['@search.score'], src: item.thumbnail, id: item.id }));
      setImages(fetchedImages);
      setIsLoading(false);
    }

    getAndSetImages();

  }, [query, query.query, query.filter]);
  useEffect(() => {
    console.log(pagination)
    const getAndSetImages = async () => {
      if (isLoading == null) return;
      const url = new URL('https://imageanalysiscbh.azurewebsites.net/api/ClientQuery');
      url.search = new URLSearchParams({
        'code': 'fdwIOewySupWl_ce1776gk30wl-ZVS7eGNPvuduUFYm0AzFuJZcQGA==',
        'query': query.search,
        'filter': query.filter.toLowerCase(),
        'top': pagination.top,
        'skip': pagination.skip
      }).toString();
      setIsLoading(true);
      const data = await GetRequest(url);
      if (data && data.value && data.value.length > 0) {
        const fetchedImages = data.value.map(item => ({ score: item['@search.score'], src: item.thumbnail, id: item.id }));
        setImages(prevImages => [...prevImages, ...fetchedImages]);
        setIsLoading(false);
      } else {
        setIsLoading(null);
      }
    }
    getAndSetImages();


  }, [pagination])

  const filteredImages = images.filter(image => image.score >= searchAccuracy / 10);
  return (
    <>

      <Gallery imageList={filteredImages} onImageClickHandler={onImageClickHandler} />
      {isLoading && <div className='align-spinner'><div className="display-spinner"></div> </div>}
    </>
  );
};

export default Display;
