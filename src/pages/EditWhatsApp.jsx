import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditWhatsApp.css';

const EditWhatsApp = ({ onUpdateWhatsAppNumber, whatsAppNumber: initialNumber }) => {
    const navigate = useNavigate();
    const [whatsAppNumber, setWhatsAppNumber] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        setWhatsAppNumber(initialNumber || '919876543210');
    }, [initialNumber]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onUpdateWhatsAppNumber(whatsAppNumber);
        setShowSuccess(true);

        setTimeout(() => {
            setShowSuccess(false);
        }, 2000);
    };

    const handleBack = () => {
        navigate('/admin');
    };

    return (
        <div className="edit-whatsapp">
            <div className="admin-container">
                <header className="admin-header">
                    <div className="header-content">
                        <div className="logo-section">
                            <i className="fab fa-whatsapp"></i>
                            <h1>Change WhatsApp Number</h1>
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
                                <p>WhatsApp number updated successfully</p>
                            </div>
                        </div>
                    )}

                    <form className="edit-whatsapp-form" onSubmit={handleSubmit}>
                        <div className="form-section">
                            <div className="form-header">
                                <i className="fas fa-phone"></i>
                                <h2>WhatsApp Configuration</h2>
                            </div>

                            <div className="form-group">
                                <label htmlFor="whatsappNumber">
                                    <i className="fab fa-whatsapp"></i>
                                    WhatsApp Number <span className="required">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="whatsappNumber"
                                    value={whatsAppNumber}
                                    onChange={(e) => setWhatsAppNumber(e.target.value)}
                                    placeholder="Enter WhatsApp number with country code (e.g., 919876543210)"
                                    required
                                />
                                <p className="help-text">
                                    <i className="fas fa-info-circle"></i>
                                    Please include country code without '+' or '0'. For India, use 91 followed by 10-digit number.
                                </p>
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

export default EditWhatsApp;
