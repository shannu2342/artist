import React, { useEffect, useState } from 'react';
import './ImageSlideshow.css';
import watermarkLogo from '../assets/logo2.png';
import { getResponsiveImage, resolveImageUrl } from '../utils/api';

const ImageSlideshow = ({ images, imageVariants = [], alt, currentIndex, onIndexChange }) => {
    const [internalCurrentIndex, setInternalCurrentIndex] = useState(0);
    const activeIndex = typeof currentIndex === 'number' ? currentIndex : internalCurrentIndex;

    useEffect(() => {
        setInternalCurrentIndex(0);
    }, [images]);

    const setIndex = (nextIndex) => {
        if (typeof currentIndex !== 'number') {
            setInternalCurrentIndex(nextIndex);
        }
        if (onIndexChange) {
            onIndexChange(nextIndex);
        }
    };

    const handlePrev = () => {
        const nextIndex = activeIndex === 0 ? images.length - 1 : activeIndex - 1;
        setIndex(nextIndex);
    };

    const handleNext = () => {
        const nextIndex = activeIndex === images.length - 1 ? 0 : activeIndex + 1;
        setIndex(nextIndex);
    };

    const handleDotClick = (index) => {
        setIndex(index);
    };

    const handleContextMenu = (e) => {
        e.preventDefault();
        return false;
    };

    const handleDragStart = (e) => {
        e.preventDefault();
        return false;
    };

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <div className="image-slideshow">
            <div className="slideshow-container">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`slide ${index === activeIndex ? 'active' : ''}`}
                    >
                        {(() => {
                            const source = getResponsiveImage(
                                imageVariants[index] || image,
                                '(max-width: 768px) 100vw, 80vw'
                            );
                            return (
                        <img
                            src={source.src || resolveImageUrl(image)}
                            srcSet={source.srcSet || undefined}
                            sizes={source.sizes || undefined}
                            alt={`${alt} - Image ${index + 1}`}
                            loading={index === activeIndex ? 'eager' : 'lazy'}
                            decoding="async"
                            fetchPriority={index === activeIndex ? 'high' : 'auto'}
                            onContextMenu={handleContextMenu}
                            onDragStart={handleDragStart}
                            draggable={false}
                        />
                            );
                        })()}
                        <div className="watermark-overlay">
                            <img src={watermarkLogo} alt="Watermark logo" className="watermark-logo" />
                        </div>
                    </div>
                ))}

                {images.length > 1 && (
                    <>
                        <button className="slideshow-btn prev-btn" onClick={handlePrev}>
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <button className="slideshow-btn next-btn" onClick={handleNext}>
                            <i className="fas fa-chevron-right"></i>
                        </button>

                        <div className="slideshow-dots">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    className={`dot ${index === activeIndex ? 'active' : ''}`}
                                    onClick={() => handleDotClick(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                ></button>
                            ))}
                        </div>

                        <div className="slideshow-counter">
                            <span>{activeIndex + 1}</span> / <span>{images.length}</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ImageSlideshow;
