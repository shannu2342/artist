import React, { useEffect, useMemo, useRef, useState } from 'react';
import './ArtworkCard.css';
import watermarkLogo from '../assets/logo2.png';
import { getResponsiveImage, resolveImageUrl } from '../utils/api';

const ArtworkCard = ({ artwork, onWhatsAppClick, onViewClick }) => {
    const images = useMemo(() => artwork.images || [artwork.image], [artwork.images, artwork.image]);
    const variants = useMemo(() => artwork.imageVariants || [], [artwork.imageVariants]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const touchStartX = useRef(null);
    const touchStartY = useRef(null);

    useEffect(() => {
        setCurrentIndex(0);
    }, [artwork._id]);

    useEffect(() => {
        const entries = variants.length > 0 ? variants : images;
        entries.forEach((image) => {
            const preloaded = new Image();
            preloaded.decoding = 'async';
            const source = getResponsiveImage(image);
            preloaded.src = source.src || resolveImageUrl(typeof image === 'string' ? image : '');
        });
    }, [images, variants]);

    const handleContextMenu = (e) => {
        e.preventDefault();
        return false;
    };

    const handleDragStart = (e) => {
        e.preventDefault();
        return false;
    };

    const handlePrevImage = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNextImage = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleTouchStart = (e) => {
        if (images.length <= 1) return;
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
        if (images.length <= 1 || touchStartX.current === null || touchStartY.current === null) return;

        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = touchStartX.current - endX;
        const diffY = touchStartY.current - endY;

        touchStartX.current = null;
        touchStartY.current = null;

        if (Math.abs(diffX) < 40 || Math.abs(diffY) > Math.abs(diffX)) {
            return;
        }

        setCurrentIndex((prev) => {
            if (diffX > 0) {
                return prev === images.length - 1 ? 0 : prev + 1;
            }
            return prev === 0 ? images.length - 1 : prev - 1;
        });
    };

    return (
        <div className="artwork-card">
            {(() => {
                const source = getResponsiveImage(
                    variants[currentIndex] || images[currentIndex],
                    '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                );
                return (
            <div
                className="artwork-image-container"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <img
                    src={source.src || resolveImageUrl(images[currentIndex])}
                    srcSet={source.srcSet || undefined}
                    sizes={source.sizes || undefined}
                    alt={artwork.title}
                    className="artwork-image"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
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
                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            className="artwork-image-nav artwork-image-prev"
                            onClick={handlePrevImage}
                            aria-label="Previous image"
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <button
                            type="button"
                            className="artwork-image-nav artwork-image-next"
                            onClick={handleNextImage}
                            aria-label="Next image"
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </>
                )}
                <div className="watermark-overlay">
                    <img src={watermarkLogo} alt="Watermark logo" className="watermark-logo" />
                </div>
                <div className="artwork-overlay">
                    <button
                        className="artwork-action-btn artwork-action-btn-whatsapp"
                        onClick={() => onWhatsAppClick(artwork)}
                    >
                        <i className="fab fa-whatsapp"></i>
                        <span>Interested</span>
                    </button>
                    <button
                        className="artwork-action-btn artwork-action-btn-view"
                        onClick={() => onViewClick(artwork)}
                    >
                        <i className="fas fa-eye"></i>
                        <span>View</span>
                    </button>
                </div>
            </div>
                );
            })()}
            <div className="artwork-info">
                <h3 className="artwork-title">{artwork.title}</h3>
                <p className="artwork-description">{artwork.description}</p>
            </div>
        </div>
    );
};

export default ArtworkCard;
