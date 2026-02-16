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
        <div className="admin-login-v2">
            <div className="login-backdrop-shape shape-a" aria-hidden="true"></div>
            <div className="login-backdrop-shape shape-b" aria-hidden="true"></div>

            <div className="admin-login-card">
                <div className="admin-login-head">
                    <p className="admin-login-kicker">Aurexon Admin</p>
                    <h1>Sign in</h1>
                    <p className="admin-login-subtitle">Access dashboard controls, uploads, and portfolio management.</p>
                </div>

                {error && (
                    <div className="admin-login-error" role="alert">
                        <i className="fas fa-circle-exclamation"></i>
                        <span>{error}</span>
                    </div>
                )}

                <form className="admin-login-form" onSubmit={handleSubmit}>
                    <label htmlFor="email" className="admin-login-label">Email</label>
                    <div className="admin-input-wrap">
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

                    <label htmlFor="password" className="admin-login-label">Password</label>
                    <div className="admin-input-wrap">
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
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                        </button>
                    </div>

                    <label className="remember-row">
                        <input
                            type="checkbox"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                        />
                        <span>Remember me</span>
                    </label>

                    <button type="submit" className="admin-login-btn" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                <span>Signing in...</span>
                            </>
                        ) : (
                            <>
                                <i className="fas fa-right-to-bracket"></i>
                                <span>Login to Dashboard</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
