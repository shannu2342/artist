import React, { useEffect, useState } from 'react';
import './ImageSlideshow.css';
import watermarkLogo from '../assets/logo2.png';
import { getResponsiveImage, resolveImageUrl } from '../utils/api';

const ImageSlideshow = ({ images, imageVariants = [], alt, currentIndex, onIndexChange, quality = 'medium' }) => {
    const [internalCurrentIndex, setInternalCurrentIndex] = useState(0);
    const [loadedMap, setLoadedMap] = useState({});
    const activeIndex = typeof currentIndex === 'number' ? currentIndex : internalCurrentIndex;

    useEffect(() => {
        setInternalCurrentIndex(0);
        setLoadedMap({});
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
                            const variant = imageVariants[index];
                            const variantForQuality = variant
                                ? {
                                    ...variant,
                                    default: quality === 'full'
                                        ? (variant.full || variant.lg || variant.default || variant.medium)
                                        : (variant.medium || variant.md || variant.default || variant.full)
                                }
                                : image;
                            const preview = resolveImageUrl(
                                variant?.small || variant?.sm || variant?.medium || variant?.md || image
                            );
                            const source = getResponsiveImage(
                                variantForQuality,
                                '(max-width: 768px) 100vw, 80vw',
                                { includeFull: quality === 'full' }
                            );
                            return (
                        <>
                        {!loadedMap[index] && (
                            <img
                                src={preview}
                                alt=""
                                aria-hidden="true"
                                className="slide-preview"
                                loading="eager"
                                decoding="async"
                                width="1600"
                                height="1200"
                            />
                        )}
                        <img
                            src={source.src || resolveImageUrl(image)}
                            srcSet={source.srcSet || undefined}
                            sizes={source.sizes || undefined}
                            alt={`${alt} - Image ${index + 1}`}
                            loading={index === activeIndex ? 'eager' : 'lazy'}
                            decoding="async"
                            fetchPriority={index === activeIndex ? 'high' : 'auto'}
                            className={loadedMap[index] ? 'slide-main is-loaded' : 'slide-main is-loading'}
                            width="1600"
                            height="1200"
                            onLoad={() => setLoadedMap((prev) => ({ ...prev, [index]: true }))}
                            onContextMenu={handleContextMenu}
                            onDragStart={handleDragStart}
                            draggable={false}
                        />
                        </>
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
