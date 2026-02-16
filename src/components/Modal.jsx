import React, { useEffect } from 'react';
import './Modal.css';
import ImageSlideshow from './ImageSlideshow';

const Modal = ({ isOpen, onClose, artwork, onWhatsAppClick }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.body.style.overflow = 'auto';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen || !artwork) return null;

    const images = artwork.images || [artwork.image];

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <button className="modal-close" onClick={onClose} aria-label="Close">
                    <i className="fas fa-times"></i>
                </button>

                <div className="modal-body">
                    <div className="modal-image-container">
                        <ImageSlideshow images={images} alt={artwork.title} />
                    </div>

                    <div className="modal-info">
                        <div className="modal-info-header">
                            <span className="modal-pill">Featured Artwork</span>
                            <h2 className="modal-title">{artwork.title}</h2>
                            <p className="modal-description">{artwork.description}</p>
                        </div>
                        <div className="modal-info-actions">
                            <button
                                className="modal-whatsapp-btn"
                                onClick={() => {
                                    onWhatsAppClick(artwork);
                                    onClose();
                                }}
                            >
                                <i className="fab fa-whatsapp"></i>
                                <span>Interested / Buy via WhatsApp</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
