import React, { useRef } from 'react'
import './AddTag.css'
const AddTag = ({ imageUrlDuplicated, imageUrl, tagList, setTagList }) => {
    const tagInputRef = useRef();

    const tagSubmitHandler = event => {
        if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();
            const cur = tagInputRef.current.value;
            if (cur) {
                setTagList(prev => {
                    return [...prev, cur];
                })
                tagInputRef.current.value = "";
            }
        }
    }
    const removeSelectedTagHandler = (index) => {
        setTagList(prev => {
            const dup = [...prev];
            dup.splice(index, 1);
            return dup;

        })
    }
    return (
        <div className='tag-display'>
            <div>
                <div className='preview-gallery'>
                    {imageUrl.map((url, index) => (<div className='preview-holder'><img id={url} className={`preview-image ${imageUrlDuplicated[index] ? "image-shadow": ""}`} src={url} />
                        {imageUrlDuplicated[index] && <div className='single-image-duplicated'>Duplicated</div>}</div>))
                    }

                </div>
                <p className='imgcount-text'>{imageUrl.length} images will be added</p>

            </div>

            <div>
                <p>Add tags</p>
                <div className='tag-container'>{tagList.map((tag, index) => (<div className='tag'>
                    <p>{tag}</p>
                    <svg onClick={() => removeSelectedTagHandler(index)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="tag-close">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </div>))}</div>
                <input ref={tagInputRef} onKeyDown={tagSubmitHandler} className='field-input' placeholder='Add tag to make your image discoverable (comma separated)' />
            </div>

        </div>
    )
}

export default AddTag