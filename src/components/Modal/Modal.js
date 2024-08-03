import React, { useEffect } from 'react';
import './Modal.css'; // Make sure to create a corresponding CSS file

const Modal = ({ children, isOpen, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
         
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className='close-button-searchbar' onClick={onClose}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>

            <div className="content-modal">
                {children}
            </div>
        </div>
    );
};

export default Modal;
