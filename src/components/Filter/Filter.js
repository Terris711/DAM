import React, { useEffect, useState } from 'react';
import './Filter.css';
import { filterData } from './FilterData.js';

const Filter = ({ setQuery }) => {
  const [chosenFilter, setChosenFilter] = useState();
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

  const onSetFilterHandler = (filter) => {
    if (filter === chosenFilter) {
      setChosenFilter(null);
      setQuery((prev) => ({ search: prev.search, filter: "" }));
    } else {
      setChosenFilter(filter);
      setQuery((prev) => ({ search: prev.search, filter: filter }));
    }

  };

  return (
    <div className='filter-bar'>
      {filterData.map((filter) => (
        <div
          key={filter.name}
          className='filter-div'
          onClick={() => onSetFilterHandler(filter.name)}
          style={!isMobile ? chosenFilter !== filter.name ? { backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.8)), url(${filter.bg})` } : { backgroundImage: `url(${filter.bg})`, color: 'black' } : {}}
        >
          {filter.name}
        </div>
      ))}
    </div>
  );
};

export default Filter;
