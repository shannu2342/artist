import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditAbout.css';

const EditAbout = ({ onUpdateAbout, aboutContent: initialContent }) => {
    const navigate = useNavigate();
    const [aboutContent, setAboutContent] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        setAboutContent(initialContent || 'Welcome to Aurexon - Creating Beyond the Canvas');
    }, [initialContent]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onUpdateAbout(aboutContent);
        setShowSuccess(true);

        setTimeout(() => {
            setShowSuccess(false);
        }, 2000);
    };

    const handleBack = () => {
        navigate('/admin');
    };

    return (
        <div className="edit-about">
            <div className="admin-container">
                <header className="admin-header">
                    <div className="header-content">
                        <div className="logo-section">
                            <i className="fas fa-user-edit"></i>
                            <h1>Edit About Page</h1>
                        </div>
                        <div className="header-actions">
                            <button className="back-btn" onClick={handleBack}>
                                <i className="fas fa-arrow-left"></i>
                                <span>Back to Dashboard</span>
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
                                <p>About page updated successfully</p>
                            </div>
                        </div>
                    )}

                    <form className="edit-about-form" onSubmit={handleSubmit}>
                        <div className="form-section">
                            <div className="form-header">
                                <i className="fas fa-info-circle"></i>
                                <h2>About Content</h2>
                            </div>

                            <div className="form-group">
                                <label htmlFor="aboutContent">
                                    <i className="fas fa-align-left"></i>
                                    About Page Content
                                </label>
                                <textarea
                                    id="aboutContent"
                                    value={aboutContent}
                                    onChange={(e) => setAboutContent(e.target.value)}
                                    placeholder="Write about the artist..."
                                    rows={12}
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

export default EditAbout;
