import React, { useEffect, useState } from 'react';
import './Modal.css';
import ImageSlideshow from './ImageSlideshow';
import { getResponsiveImage, resolveImageUrl } from '../utils/api';

const Modal = ({ isOpen, onClose, artwork, onWhatsAppClick }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

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

    useEffect(() => {
        setCurrentIndex(0);
    }, [artwork?._id, isOpen]);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen || !artwork) return null;

    const images = artwork.images || [artwork.image];
    const imageVariants = artwork.imageVariants || [];
    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <button className="modal-close" onClick={onClose} aria-label="Close">
                    <i className="fas fa-times"></i>
                </button>

                <div className="modal-body">
                    <div className="modal-image-container">
                        <ImageSlideshow
                            images={images}
                            imageVariants={imageVariants}
                            alt={artwork.title}
                            currentIndex={currentIndex}
                            onIndexChange={setCurrentIndex}
                        />
                    </div>

                    <div className="modal-info">
                        <div className="modal-info-header">
                            <span className="modal-pill">Featured Artwork</span>
                            <h2 className="modal-title">{artwork.title}</h2>
                            <p className="modal-description">{artwork.description}</p>
                        </div>

                        {images.length > 1 && (
                            <div className="modal-thumbnails">
                                <h4>All Images</h4>
                                <div className="modal-thumb-grid">
                                    {images.map((_, index) => {
                                        const source = getResponsiveImage(imageVariants[index] || images[index], '140px');
                                        return (
                                            <button
                                                key={index}
                                                type="button"
                                                className={`modal-thumb ${index === currentIndex ? 'active' : ''}`}
                                                onClick={() => setCurrentIndex(index)}
                                                aria-label={`View image ${index + 1}`}
                                            >
                                                <img
                                                    src={source.src || resolveImageUrl(images[index])}
                                                    srcSet={source.srcSet || undefined}
                                                    sizes={source.sizes || undefined}
                                                    alt={`${artwork.title} preview ${index + 1}`}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

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
