import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditHero.css';
import { resolveImageUrl } from '../utils/api';

const EditHero = ({ heroImages, onUpdateHeroImages, onDeleteHeroImage }) => {
    const navigate = useNavigate();
    const [selectedImages, setSelectedImages] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages(files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedImages.length === 0) {
            return;
        }

        const formData = new FormData();
        selectedImages.forEach((file) => {
            formData.append('images', file);
        });

        await onUpdateHeroImages(formData);
        setShowSuccess(true);
        setSelectedImages([]);
        setTimeout(() => setShowSuccess(false), 2000);
    };

    return (
        <div className="edit-hero">
            <div className="admin-container">
                <header className="admin-header">
                    <div className="header-content">
                        <div className="logo-section">
                            <i className="fas fa-panorama"></i>
                            <h1>Edit Hero Images</h1>
                        </div>
                        <div className="header-actions">
                            <button className="back-btn" onClick={() => navigate('/admin')}>
                                <i className="fas fa-arrow-left"></i>
                                <span>Back to Dashboard</span>
                            </button>
                            <button
                                className="logout-btn"
                                onClick={() => {
                                    localStorage.removeItem('adminLoggedIn');
                                    localStorage.removeItem('adminToken');
                                    localStorage.removeItem('isAdminLoggedIn');
                                    navigate('/admin/login');
                                }}
                            >
                                <i className="fas fa-sign-out-alt"></i>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="admin-main">
                    {showSuccess && (
                        <div className="success-message">
                            <i className="fas fa-check-circle"></i>
                            <div>
                                <h3>Success!</h3>
                                <p>Hero images updated</p>
                            </div>
                        </div>
                    )}

                    <div className="hero-preview">
                        <h2>Current Hero Images</h2>
                        <div className="hero-preview-grid">
                            {heroImages && heroImages.length > 0 ? (
                                heroImages.map((image) => (
                                    <div key={image} className="hero-preview-card">
                                        <img src={resolveImageUrl(image)} alt="Hero" />
                                        <button
                                            type="button"
                                            className="hero-delete-btn"
                                            onClick={() => onDeleteHeroImage(image)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p>No hero images set yet.</p>
                            )}
                        </div>
                    </div>

                    <form className="edit-hero-form" onSubmit={handleSubmit}>
                        <div className="form-section">
                            <div className="form-header">
                                <i className="fas fa-images"></i>
                                <h2>Upload New Hero Images</h2>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageSelect}
                            />
                            <p className="help-text">Upload 2-5 landscape images for best results.</p>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="save-btn">
                                <i className="fas fa-save"></i>
                                <span>Save Hero Images</span>
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default EditHero;
