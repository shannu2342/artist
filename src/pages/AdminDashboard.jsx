import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('isAdminLoggedIn');
        navigate('/admin/login');
    };

    return (
        <div className={`admin-dashboard ${sidebarOpen ? 'sidebar-open' : ''}`}>
            <aside className="admin-sidebar">
                <div className="sidebar-brand">
                    <i className="fas fa-crown"></i>
                    <span>Admin</span>
                </div>
                <nav className="sidebar-nav">
                    <button className="nav-item" onClick={() => { setSidebarOpen(false); navigate('/admin/add-painting'); }}>
                        <i className="fas fa-plus"></i>
                        <span>Add Painting</span>
                    </button>
                    <button className="nav-item" onClick={() => { setSidebarOpen(false); navigate('/admin/manage-paintings'); }}>
                        <i className="fas fa-images"></i>
                        <span>Manage Paintings</span>
                    </button>
                    <button className="nav-item" onClick={() => { setSidebarOpen(false); navigate('/admin/edit-hero'); }}>
                        <i className="fas fa-panorama"></i>
                        <span>Hero Images</span>
                    </button>
                    <button className="nav-item" onClick={() => { setSidebarOpen(false); navigate('/admin/edit-profile'); }}>
                        <i className="fas fa-user"></i>
                        <span>Artist Profile</span>
                    </button>
                    <button className="nav-item" onClick={() => { setSidebarOpen(false); navigate('/admin/edit-about'); }}>
                        <i className="fas fa-user-edit"></i>
                        <span>About Page</span>
                    </button>
                    <button className="nav-item" onClick={() => { setSidebarOpen(false); navigate('/admin/edit-services'); }}>
                        <i className="fas fa-tools"></i>
                        <span>Services</span>
                    </button>
                    <button className="nav-item" onClick={() => { setSidebarOpen(false); navigate('/admin/edit-terms'); }}>
                        <i className="fas fa-file-alt"></i>
                        <span>Terms</span>
                    </button>
                    <button className="nav-item" onClick={() => { setSidebarOpen(false); navigate('/admin/edit-whatsapp'); }}>
                        <i className="fab fa-whatsapp"></i>
                        <span>WhatsApp</span>
                    </button>
                    <button className="nav-item" onClick={() => { setSidebarOpen(false); navigate('/'); }}>
                        <i className="fas fa-globe"></i>
                        <span>View Website</span>
                    </button>
                </nav>
                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
            <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)}></div>

            <div className="admin-content">
                <header className="admin-header">
                    <div className="header-content">
                        <div className="logo-section">
                            <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>
                                <i className="fas fa-bars"></i>
                            </button>
                            <i className="fas fa-crown"></i>
                            <h1>Admin Dashboard</h1>
                        </div>
                        <div className="header-actions">
                            <button className="quick-btn" onClick={() => navigate('/admin/add-painting')}>
                                <i className="fas fa-plus"></i>
                                <span>New Artwork</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="admin-main">
                    <div className="dashboard-grid">
                        <div className="dashboard-card" onClick={() => navigate('/admin/add-painting')}>
                            <div className="card-icon add-painting">
                                <i className="fas fa-plus"></i>
                                <i className="fas fa-palette"></i>
                            </div>
                            <h3>Add New Painting</h3>
                            <p>Upload a new artwork</p>
                            <button className="card-action">
                                <i className="fas fa-arrow-right"></i>
                                <span>Add Now</span>
                            </button>
                        </div>

                        <div className="dashboard-card" onClick={() => navigate('/admin/manage-paintings')}>
                            <div className="card-icon manage-paintings">
                                <i className="fas fa-images"></i>
                            </div>
                            <h3>Manage Paintings</h3>
                            <p>Edit or delete artworks</p>
                            <button className="card-action">
                                <i className="fas fa-arrow-right"></i>
                                <span>Manage</span>
                            </button>
                        </div>

                        <div className="dashboard-card" onClick={() => navigate('/admin/edit-hero')}>
                            <div className="card-icon edit-hero">
                                <i className="fas fa-panorama"></i>
                            </div>
                            <h3>Hero Images</h3>
                            <p>Update homepage hero slider</p>
                            <button className="card-action">
                                <i className="fas fa-arrow-right"></i>
                                <span>Edit</span>
                            </button>
                        </div>

                        <div className="dashboard-card" onClick={() => navigate('/admin/edit-profile')}>
                            <div className="card-icon edit-profile">
                                <i className="fas fa-user"></i>
                            </div>
                            <h3>Artist Profile</h3>
                            <p>Update name, bio & photo</p>
                            <button className="card-action">
                                <i className="fas fa-arrow-right"></i>
                                <span>Edit</span>
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
