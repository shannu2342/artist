import React from 'react';
import './ArtworkCard.css';
import watermarkLogo from '../assets/logo2.png';
import { resolveImageUrl } from '../utils/api';

const ArtworkCard = ({ artwork, onWhatsAppClick }) => {
    const handleContextMenu = (e) => {
        e.preventDefault();
        return false;
    };

    const handleDragStart = (e) => {
        e.preventDefault();
        return false;
    };

    const images = artwork.images || [artwork.image];

    return (
        <div className="artwork-card">
            <div className="artwork-image-container">
                <img
                    src={resolveImageUrl(images[0])}
                    alt={artwork.title}
                    className="artwork-image"
                    loading="lazy"
                    decoding="async"
                    onContextMenu={handleContextMenu}
                    onDragStart={handleDragStart}
                    draggable={false}
                />
                {images.length > 1 && (
                    <div className="multiple-images-indicator">
                        <i className="fas fa-images"></i>
                        <span>{images.length} images</span>
                    </div>
                )}
                <div className="watermark-overlay">
                    <img src={watermarkLogo} alt="Watermark logo" className="watermark-logo" />
                </div>
                <div className="artwork-overlay">
                    <button
                        className="artwork-action-btn"
                        onClick={() => onWhatsAppClick(artwork)}
                    >
                        <i className="fab fa-whatsapp"></i>
                        <span>Interested</span>
                    </button>
                </div>
            </div>
            <div className="artwork-info">
                <h3 className="artwork-title">{artwork.title}</h3>
                <p className="artwork-description">{artwork.description}</p>
            </div>
        </div>
    );
};

export default ArtworkCard;
