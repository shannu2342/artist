import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './EditPainting.css';
import { apiUrl, resolveImageUrl } from '../utils/api';

const EditPainting = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [painting, setPainting] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [paintingName, setPaintingName] = useState('');
    const [paintingDescription, setPaintingDescription] = useState('');
    const [featured, setFeatured] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (location.state && location.state.painting) {
            const { painting: initialPainting } = location.state;
            setPainting(initialPainting);
            setSelectedImages(initialPainting.images || [initialPainting.image]);
            setPaintingName(initialPainting.title);
            setPaintingDescription(initialPainting.description);
            setFeatured(!!initialPainting.featured);
        } else {
            navigate('/admin/manage-paintings');
        }
    }, [location, navigate]);

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => URL.createObjectURL(file));
        setSelectedImages(prev => [...prev, ...newImages]);
    };

    const handleRemoveImage = (index) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedImages.length === 0 || !paintingName) {
            alert('Please select at least one image and enter a painting name');
            return;
        }

        const formData = new FormData();
        formData.append('title', paintingName);
        formData.append('description', paintingDescription);
        formData.append('featured', featured ? 'true' : 'false');

        // Append new files to FormData
        const files = Array.from(document.getElementById('imageInput').files);
        files.forEach(file => {
            formData.append('images', file);
        });

        try {
            const response = await fetch(apiUrl(`/api/artworks/${painting._id}`), {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: formData
            });

            if (response.ok) {
                setShowSuccess(true);

                // Reset success message after 2 seconds
                setTimeout(() => {
                    setShowSuccess(false);
                }, 2000);
            } else {
                alert('Error updating painting');
            }
        } catch (error) {
            console.error('Error updating painting:', error);
            alert('Error updating painting');
        }
    };

    const handleBack = () => {
        navigate('/admin/manage-paintings');
    };

    if (!painting) return null;

    return (
        <div className="edit-painting">
            <div className="admin-container">
                <header className="admin-header">
                    <div className="header-content">
                        <div className="logo-section">
                            <i className="fas fa-edit"></i>
                            <h1>Edit Painting</h1>
                        </div>
                        <div className="header-actions">
                            <button className="back-btn" onClick={handleBack}>
                                <i className="fas fa-arrow-left"></i>
                                <span>Back to Gallery</span>
                            </button>
                            <button className="logout-btn" onClick={() => {
                                localStorage.removeItem('adminLoggedIn');
                                localStorage.removeItem('adminToken');
                                localStorage.removeItem('isAdminLoggedIn');
                                navigate('/admin/login');
                            }}>
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
                                <p>Painting updated successfully</p>
                            </div>
                        </div>
                    )}

                    <form className="edit-painting-form" onSubmit={handleSubmit}>
                        <div className="form-section">
                            <div className="form-header">
                                <i className="fas fa-images"></i>
                                <h2>Update Image</h2>
                            </div>
                            <div className="image-upload-section">
                                <label className="image-upload-label">
                                    {selectedImages.length > 0 ? (
                                        <div className="image-previews">
                                            {selectedImages.map((image, index) => (
                                                <div key={index} className="image-preview">
                                                    <img
                                                        src={resolveImageUrl(image)}
                                                        alt={`Preview ${index + 1}`}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="remove-image"
                                                        onClick={() => handleRemoveImage(index)}
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="upload-placeholder">
                                            <i className="fas fa-cloud-upload-alt"></i>
                                            <p>Click to select images</p>
                                            <span>Supports JPG, PNG, GIF up to 10MB (multiple files allowed)</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="imageInput"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        style={{ display: 'none' }}
                                        multiple
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="form-section">
                            <div className="form-header">
                                <i className="fas fa-info-circle"></i>
                                <h2>Details</h2>
                            </div>

                            <div className="form-group">
                                <label htmlFor="paintingName">
                                    <i className="fas fa-paint-brush"></i>
                                    Painting Name <span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="paintingName"
                                    value={paintingName}
                                    onChange={(e) => setPaintingName(e.target.value)}
                                    placeholder="Enter painting name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={featured}
                                        onChange={(e) => setFeatured(e.target.checked)}
                                    />
                                    <span className="checkmark"></span>
                                    Feature on Home Page
                                </label>
                            </div>

                            <div className="form-group">
                                <label htmlFor="paintingDescription">
                                    <i className="fas fa-align-left"></i>
                                    Description
                                </label>
                                <textarea
                                    id="paintingDescription"
                                    value={paintingDescription}
                                    onChange={(e) => setPaintingDescription(e.target.value)}
                                    placeholder="Enter short description"
                                    rows={4}
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={handleBack}>
                                <i className="fas fa-times"></i>
                                <span>Cancel</span>
                            </button>
                            <button type="submit" className="save-btn">
                                <i className="fas fa-save"></i>
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default EditPainting;
