import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import { apiUrl } from '../utils/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [credMessage, setCredMessage] = useState('');
    const [credError, setCredError] = useState('');
    const [updatingCreds, setUpdatingCreds] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('isAdminLoggedIn');
        navigate('/admin/login');
    };

    const handleCredentialsUpdate = async (e) => {
        e.preventDefault();
        setCredMessage('');
        setCredError('');
        setUpdatingCreds(true);

        try {
            const response = await fetch(apiUrl('/api/auth/credentials'), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({
                    currentPassword,
                    newEmail,
                    newPassword
                })
            });

            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update credentials');
            }

            if (data.token) {
                localStorage.setItem('adminToken', data.token);
            }

            setCredMessage('Admin login updated successfully. Use new credentials next time.');
            setCurrentPassword('');
            setNewEmail('');
            setNewPassword('');
        } catch (error) {
            setCredError(error.message || 'Failed to update credentials');
        } finally {
            setUpdatingCreds(false);
        }
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

                    <section className="security-card">
                        <div className="security-header">
                            <h3>Reset Admin Login</h3>
                            <p>Update admin email and password used for future login.</p>
                        </div>
                        {credMessage && <div className="security-success">{credMessage}</div>}
                        {credError && <div className="security-error">{credError}</div>}
                        <form className="security-form" onSubmit={handleCredentialsUpdate}>
                            <div className="security-field">
                                <label htmlFor="currentPassword">Current Password</label>
                                <input
                                    id="currentPassword"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="security-field">
                                <label htmlFor="newEmail">New Admin Email</label>
                                <input
                                    id="newEmail"
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="Artist@login.com"
                                    required
                                />
                            </div>
                            <div className="security-field">
                                <label htmlFor="newPassword">New Admin Password</label>
                                <input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="At least 8 characters"
                                    minLength={8}
                                    required
                                />
                            </div>
                            <button type="submit" className="security-save-btn" disabled={updatingCreds}>
                                {updatingCreds ? 'Updating...' : 'Save New Login'}
                            </button>
                        </form>
                    </section>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
