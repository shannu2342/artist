import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditArtistProfile.css';
import { getResponsiveImage, resolveImageUrl } from '../utils/api';

const EditArtistProfile = ({ artistProfile, onUpdateArtistProfile }) => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        setName(artistProfile?.name || 'Aurexon');
        setBio(artistProfile?.bio || '');
    }, [artistProfile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('bio', bio);
        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        await onUpdateArtistProfile(formData);
        setShowSuccess(true);
        setSelectedImage(null);
        setTimeout(() => setShowSuccess(false), 2000);
    };

    return (
        <div className="edit-artist-profile">
            <div className="admin-container">
                <header className="admin-header">
                    <div className="header-content">
                        <div className="logo-section">
                            <i className="fas fa-user"></i>
                            <h1>Edit Artist Profile</h1>
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
                                <p>Artist profile updated</p>
                            </div>
                        </div>
                    )}

                    <div className="profile-preview">
                        <h2>Current Profile</h2>
                        <div className="profile-card">
                            {artistProfile?.image ? (
                                (() => {
                                    const source = getResponsiveImage(
                                        artistProfile?.imageVariants || artistProfile?.image,
                                        '(max-width: 768px) 100vw, 420px'
                                    );
                                    return (
                                        <img
                                            src={source.src || resolveImageUrl(artistProfile.image)}
                                            srcSet={source.srcSet || undefined}
                                            sizes={source.sizes || undefined}
                                            alt={artistProfile?.name || 'Artist'}
                                            loading="eager"
                                            decoding="async"
                                        />
                                    );
                                })()
                            ) : (
                                <div className="profile-placeholder">
                                    <i className="fas fa-palette"></i>
                                </div>
                            )}
                            <div>
                                <h3>{artistProfile?.name || 'Aurexon'}</h3>
                                <p>{artistProfile?.bio || 'Add a short bio to introduce yourself.'}</p>
                            </div>
                        </div>
                    </div>

                    <form className="edit-artist-form" onSubmit={handleSubmit}>
                        <div className="form-section">
                            <div className="form-header">
                                <i className="fas fa-user-edit"></i>
                                <h2>Update Profile Details</h2>
                            </div>

                            <div className="form-group">
                                <label htmlFor="artistName">
                                    <i className="fas fa-signature"></i>
                                    Artist Name
                                </label>
                                <input
                                    id="artistName"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter artist name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="artistBio">
                                    <i className="fas fa-align-left"></i>
                                    Short Bio
                                </label>
                                <textarea
                                    id="artistBio"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={6}
                                    placeholder="Write a short bio for the artist"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="artistImage">
                                    <i className="fas fa-image"></i>
                                    Profile Image
                                </label>
                                <input
                                    id="artistImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="save-btn">
                                <i className="fas fa-save"></i>
                                <span>Save Profile</span>
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default EditArtistProfile;
