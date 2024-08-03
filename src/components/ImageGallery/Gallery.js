import React from 'react';
import './Gallery.css';

const Gallery = ({ imageList, onImageClickHandler }) => {
  imageList = filterUniqueObjects(imageList);
  // Chunk the imageList into arrays of 4
  const chunkedImages = imageList.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index % 4);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);
  console.log(chunkedImages);
  console.log(imageList);

  return (
    <div>
        <div className='image-gallery-row'>
      {chunkedImages.map((col, colIndex) => (
            <div key={colIndex} className='gallery-col'>
        
          {col.map((image, rowIndex) => (
              <img key={image.id} src={image.src} style={{ width: '100%'}} onClick={() => onImageClickHandler(chunkedImages[colIndex][rowIndex])} />
          ))}
            </div>
      ))}
        </div>
    </div>
  );
};
function filterUniqueObjects(array) {
  const uniqueObjectsSet = new Set();
  const uniqueArray = [];
  
  array.forEach(obj => {
      const stringifiedObj = JSON.stringify(obj);
      if (!uniqueObjectsSet.has(stringifiedObj)) {
          uniqueArray.push(obj);
          uniqueObjectsSet.add(stringifiedObj);
      }
  });
  
  return uniqueArray;
}

export default Gallery;
