import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';
import { apiUrl } from '../utils/api';

const AdminLogin = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(apiUrl('/api/auth/login'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || 'Invalid email or password');
            }

            const data = await response.json();
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('isAdminLoggedIn', 'true');

            if (remember) {
                localStorage.setItem('adminRemember', 'true');
            }

            onLogin();
            navigate('/admin');
        } catch (err) {
            setError(err.message || 'Login failed');
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-login">
            <div className="login-shell">
                <div className="login-panel">
                    <div className="panel-badge">
                        <i className="fas fa-palette"></i>
                        <span>Artist Admin</span>
                    </div>
                    <h1>Manage Aurexon</h1>
                    <p>Upload new works, curate your gallery, and update hero content in one place.</p>
                    <div className="panel-strip"></div>
                    <div className="panel-stats">
                        <div>
                            <strong>01</strong>
                            <span>Upload Artwork</span>
                        </div>
                        <div>
                            <strong>02</strong>
                            <span>Feature Pieces</span>
                        </div>
                        <div>
                            <strong>03</strong>
                            <span>Publish Updates</span>
                        </div>
                    </div>
                </div>

                <div className="login-card">
                    <div className="login-header">
                        <div className="login-icon">
                            <i className="fas fa-crown"></i>
                        </div>
                        <div>
                            <h2>Admin Login</h2>
                            <p>Sign in to manage the portfolio.</p>
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">
                            <i className="fas fa-exclamation-circle"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-group">
                                <i className="fas fa-envelope"></i>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Artist@login.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-group">
                                <i className="fas fa-lock"></i>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="show-password-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                                </button>
                            </div>
                        </div>

                        <div className="form-options">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                />
                                <span className="checkmark"></span>
                                Remember me
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="login-button"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    <span>Logging in...</span>
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-sign-in-alt"></i>
                                    <span>Login</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        Use your admin credentials to access the dashboard.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
