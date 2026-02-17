import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ArtworkCard from '../components/ArtworkCard';
import Modal from '../components/Modal';
import './HomePage.css';
import heroImage1 from '../assets/image1.jpeg';
import heroImage2 from '../assets/image2.jpeg';
import heroImage3 from '../assets/image3.jpeg';
import { getResponsiveImage, resolveImageUrl } from '../utils/api';

const HomePage = ({ gallery, whatsAppNumber, heroImages = [], heroImageVariants = [], artistProfile }) => {
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    const featuredList = gallery.filter((artwork) => artwork.featured);
    const featuredArtworks = (featuredList.length > 0 ? featuredList : gallery).slice(0, 6);
    const heroTrackRef = useRef(null);
    const heroSlides = heroImages.length > 0 ? heroImages : [heroImage1, heroImage2, heroImage3];
    const heroIndexRef = useRef(0);

    useEffect(() => {
        const track = heroTrackRef.current;
        if (!track) return;

        const slideCount = heroSlides.length;
        const scrollToIndex = (index) => {
            const width = track.clientWidth;
            track.scrollTo({ left: width * index, behavior: 'smooth' });
        };

        const interval = setInterval(() => {
            heroIndexRef.current = (heroIndexRef.current + 1) % slideCount;
            scrollToIndex(heroIndexRef.current);
        }, 4000);

        return () => clearInterval(interval);
    }, [heroSlides.length]);

    const handleWhatsAppClick = (artwork) => {
        const message = encodeURIComponent(`Hello, I'm interested in the painting titled "${artwork.title}". Please share the price and details.`);
        window.open(`https://wa.me/${whatsAppNumber}?text=${message}`, '_blank');
    };

    const handleViewClick = (artwork) => {
        setSelectedArtwork(artwork);
    };

    const handleCloseModal = () => {
        setSelectedArtwork(null);
    };

    return (
        <div className="home-page">
            <section className="hero">
                <div className="hero-slider">
                    <div className="hero-track" ref={heroTrackRef}>
                        {heroSlides.map((image, index) => (
                            <div className="hero-slide" key={image}>
                                {(() => {
                                    const source = getResponsiveImage(heroImageVariants[index] || image, '100vw');
                                    return (
                                <img
                                    src={source.src || resolveImageUrl(image)}
                                    srcSet={source.srcSet || undefined}
                                    sizes={source.sizes || undefined}
                                    alt={`Hero ${index + 1}`}
                                    loading={index === 0 ? 'eager' : 'lazy'}
                                    decoding="async"
                                    fetchPriority={index === 0 ? 'high' : 'auto'}
                                />
                                    );
                                })()}
                                <div className="hero-overlay">
                                    <div className="hero-text">
                                        <h1 className="hero-title">
                                            <span className="hero-greeting">Welcome to</span>
                                            <span className="hero-logo-text" aria-label="Aurexon">
                                                AURE<span className="hero-logo-x">X</span>ON
                                            </span>
                                            <span className="hero-line"></span>
                                        </h1>
                                        <p className="hero-tagline">Creating Beyond the Canvas</p>
                                        <div className="hero-actions">
                                            <Link to="/gallery" className="btn btn-primary">
                                                <i className="fas fa-images"></i>
                                                Explore Gallery
                                            </Link>
                                            <button
                                                className="btn btn-whatsapp"
                                                onClick={() => {
                                                    const message = encodeURIComponent('Hello! I saw your art portfolio and would like to learn more about your beautiful paintings.');
                                                    window.open(`https://wa.me/${whatsAppNumber}?text=${message}`, '_blank');
                                                }}
                                            >
                                                <i className="fab fa-whatsapp"></i>
                                                Contact Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="hero-controls">
                        <button
                            className="hero-control"
                            aria-label="Previous slide"
                            onClick={() => {
                                const track = heroTrackRef.current;
                                if (!track) return;
                                heroIndexRef.current = (heroIndexRef.current - 1 + heroSlides.length) % heroSlides.length;
                                track.scrollTo({ left: track.clientWidth * heroIndexRef.current, behavior: 'smooth' });
                            }}
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <button
                            className="hero-control"
                            aria-label="Next slide"
                            onClick={() => {
                                const track = heroTrackRef.current;
                                if (!track) return;
                                heroIndexRef.current = (heroIndexRef.current + 1) % heroSlides.length;
                                track.scrollTo({ left: track.clientWidth * heroIndexRef.current, behavior: 'smooth' });
                            }}
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </section>

            <section className="featured-artworks">
                <div className="container">
                    <div className="section-title">
                        <h2>Featured Artworks</h2>
                        <p className="section-description">Selected pieces from my collection</p>
                    </div>

                    <div className="artwork-grid">
                        {featuredArtworks.map((artwork) => (
                            <ArtworkCard
                                key={artwork._id}
                                artwork={artwork}
                                onWhatsAppClick={handleWhatsAppClick}
                                onViewClick={handleViewClick}
                            />
                        ))}
                    </div>

                    <div className="view-all-container">
                        <Link to="/gallery" className="btn btn-secondary">
                            <i className="fas fa-arrow-right"></i>
                            View All Artworks
                        </Link>
                    </div>
                </div>
            </section>

            <section className="about-preview">
                <div className="container">
                    <div className="about-content">
                        <div className="about-text">
                            <h2>About the Artist</h2>
                            <p>
                                With over a decade of experience, I bring stories to life through the vibrant language of colors.
                                Each artwork is a journey of emotions, crafted with passion and dedication.
                            </p>
                            <Link to="/about" className="btn btn-primary">
                                <i className="fas fa-user"></i>
                                Learn More
                            </Link>
                        </div>
                        <div className="about-image">
                            {artistProfile?.image ? (
                                (() => {
                                    const source = getResponsiveImage(
                                        artistProfile?.imageVariants || artistProfile?.image,
                                        '(max-width: 768px) 90vw, 320px'
                                    );
                                    return (
                                        <img
                                            className="artist-photo"
                                            src={source.src || resolveImageUrl(artistProfile.image)}
                                            srcSet={source.srcSet || undefined}
                                            sizes={source.sizes || undefined}
                                            alt={artistProfile?.name || 'Artist'}
                                            loading="eager"
                                            decoding="async"
                                            fetchPriority="high"
                                        />
                                    );
                                })()
                            ) : (
                                <div className="artist-placeholder">
                                    <i className="fas fa-palette"></i>
                                    <p>Artist Profile</p>
                                </div>
                            )}
                            {artistProfile?.name && (
                                <div className="artist-name">{artistProfile.name}</div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="services-preview">
                <div className="container">
                    <div className="section-title">
                        <h2>Services</h2>
                        <p className="section-description">What I offer</p>
                    </div>

                    <div className="services-grid">
                        <div className="service-card">
                            <div className="service-icon">
                                <i className="fas fa-paint-brush"></i>
                            </div>
                            <h3>Custom Artworks</h3>
                            <p>Commission unique pieces tailored to your preferences</p>
                        </div>
                        <div className="service-card">
                            <div className="service-icon">
                                <i className="fas fa-graduation-cap"></i>
                            </div>
                            <h3>Art Workshops</h3>
                            <p>Learn the art of painting with hands-on guidance</p>
                        </div>
                        <div className="service-card">
                            <div className="service-icon">
                                <i className="fas fa-gallery"></i>
                            </div>
                            <h3>Exhibitions</h3>
                            <p>Participate in art shows and exhibitions</p>
                        </div>
                    </div>

                    <div className="view-all-container">
                        <Link to="/services" className="btn btn-secondary">
                            <i className="fas fa-arrow-right"></i>
                            View All Services
                        </Link>
                    </div>
                </div>
            </section>

            <Modal
                isOpen={!!selectedArtwork}
                onClose={handleCloseModal}
                artwork={selectedArtwork}
                onWhatsAppClick={handleWhatsAppClick}
            />

        </div>
    );
};

export default HomePage;
