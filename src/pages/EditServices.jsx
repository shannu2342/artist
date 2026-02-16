import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditServices.css';

const EditServices = ({ services: initialServices, onUpdateServices }) => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [newServiceName, setNewServiceName] = useState('');
    const [newServiceDescription, setNewServiceDescription] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (Array.isArray(initialServices) && initialServices.length > 0) {
            setServices(initialServices);
        } else {
            setServices([
                {
                    id: 1,
                    name: 'Custom Paintings',
                    description: 'Get a custom painting made just for you'
                },
                {
                    id: 2,
                    name: 'Art Classes',
                    description: 'Learn painting from the artist'
                },
                {
                    id: 3,
                    name: 'Workshops',
                    description: 'Join our painting workshops'
                },
                {
                    id: 4,
                    name: 'Art Consultation',
                    description: 'Get expert advice on art collection'
                }
            ]);
        }
    }, [initialServices]);

    const handleAddService = async (e) => {
        e.preventDefault();

        if (!newServiceName.trim()) return;

        const newService = {
            id: Date.now(),
            name: newServiceName.trim(),
            description: newServiceDescription.trim() || ''
        };

        const updatedServices = [...services, newService];
        setServices(updatedServices);
        await onUpdateServices(updatedServices);
        setNewServiceName('');
        setNewServiceDescription('');
        setShowSuccess(true);

        setTimeout(() => {
            setShowSuccess(false);
        }, 2000);
    };

    const handleDeleteService = async (id) => {
        const updatedServices = services.filter(service => service.id !== id);
        setServices(updatedServices);
        await onUpdateServices(updatedServices);
        setShowSuccess(true);

        setTimeout(() => {
            setShowSuccess(false);
        }, 2000);
    };

    const handleBack = () => {
        navigate('/admin');
    };

    return (
        <div className="edit-services">
            <div className="admin-container">
                <header className="admin-header">
                    <div className="header-content">
                        <div className="logo-section">
                            <i className="fas fa-tools"></i>
                            <h1>Edit Services</h1>
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
                                <p>Services updated successfully</p>
                            </div>
                        </div>
                    )}

                    <div className="services-management">
                        <div className="add-service-section">
                            <div className="form-header">
                                <i className="fas fa-plus-circle"></i>
                                <h2>Add New Service</h2>
                            </div>
                            <form className="add-service-form" onSubmit={handleAddService}>
                                <div className="form-group">
                                    <label htmlFor="serviceName">
                                        <i className="fas fa-paint-brush"></i>
                                        Service Name <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="serviceName"
                                        value={newServiceName}
                                        onChange={(e) => setNewServiceName(e.target.value)}
                                        placeholder="Enter service name"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="serviceDescription">
                                        <i className="fas fa-align-left"></i>
                                        Description
                                    </label>
                                    <textarea
                                        id="serviceDescription"
                                        value={newServiceDescription}
                                        onChange={(e) => setNewServiceDescription(e.target.value)}
                                        placeholder="Enter service description"
                                        rows={3}
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="add-btn">
                                        <i className="fas fa-plus"></i>
                                        <span>Add Service</span>
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="services-list">
                            <div className="form-header">
                                <i className="fas fa-list"></i>
                                <h2>Current Services</h2>
                            </div>

                            <div className="services-grid">
                                {services.length === 0 ? (
                                    <div className="no-services">
                                        <i className="fas fa-search"></i>
                                        <h3>No services found</h3>
                                        <p>Add your first service</p>
                                    </div>
                                ) : (
                                    services.map(service => (
                                        <div key={service.id} className="service-card">
                                            <div className="service-info">
                                                <h3 className="service-title">{service.name}</h3>
                                                <p className="service-description">{service.description}</p>
                                            </div>
                                            <button
                                                className="delete-service-btn"
                                                onClick={() => handleDeleteService(service.id)}
                                            >
                                                <i className="fas fa-trash"></i>
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default EditServices;
