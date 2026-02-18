import React, { useState } from 'react';
import ArtworkCard from '../components/ArtworkCard';
import Modal from '../components/Modal';
import './GalleryPage.css';

const GalleryPage = ({
    gallery,
    whatsAppNumber,
    hasMoreArtworks = false,
    loadingMoreArtworks = false,
    onLoadMoreArtworks
}) => {
    const [selectedArtwork, setSelectedArtwork] = useState(null);

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
        <div className="gallery-page">
            <section className="gallery-hero">
                <div className="container">
                    <div className="gallery-hero-content">
                        <h1>Art Gallery</h1>
                        <p>Explore my collection of beautiful artworks</p>
                    </div>
                </div>
            </section>

            <section className="gallery-grid-section">
                <div className="container">
                    <div className="gallery-grid">
                        {gallery.map((artwork, index) => (
                            <ArtworkCard
                                key={artwork._id}
                                artwork={artwork}
                                onWhatsAppClick={handleWhatsAppClick}
                                onViewClick={handleViewClick}
                                priority={index < 6}
                            />
                        ))}
                    </div>

                    {gallery.length === 0 && (
                        <div className="empty-gallery">
                            <i className="fas fa-images"></i>
                            <h3>No Artworks Yet</h3>
                            <p>Check back soon for new additions to the gallery</p>
                        </div>
                    )}

                    {gallery.length > 0 && hasMoreArtworks && (
                        <div className="gallery-load-more">
                            <button
                                type="button"
                                className="gallery-load-more-btn"
                                onClick={onLoadMoreArtworks}
                                disabled={loadingMoreArtworks}
                            >
                                {loadingMoreArtworks ? 'Loading...' : 'Load More Artworks'}
                            </button>
                        </div>
                    )}
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

export default GalleryPage;
