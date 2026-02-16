import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.jpeg';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = () => {
        setIsMenuOpen(false);
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <Link to="/" className="logo" onClick={handleNavClick}>
                    <img src={logo} alt="Aurexon" className="logo-img" />
                </Link>

                <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`} id="navMenu">
                    <Link
                        to="/"
                        className={`nav-link ${isActive('/') ? 'active' : ''}`}
                        onClick={handleNavClick}
                    >
                        Home
                    </Link>
                    <Link
                        to="/about"
                        className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                        onClick={handleNavClick}
                    >
                        About
                    </Link>
                    <Link
                        to="/gallery"
                        className={`nav-link ${isActive('/gallery') ? 'active' : ''}`}
                        onClick={handleNavClick}
                    >
                        Gallery
                    </Link>
                    <Link
                        to="/services"
                        className={`nav-link ${isActive('/services') ? 'active' : ''}`}
                        onClick={handleNavClick}
                    >
                        Services
                    </Link>
                    <Link
                        to="/terms"
                        className={`nav-link ${isActive('/terms') ? 'active' : ''}`}
                        onClick={handleNavClick}
                    >
                        Terms
                    </Link>
                    <Link
                        to="/contact"
                        className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
                        onClick={handleNavClick}
                    >
                        Contact
                    </Link>
                </div>

                <button
                    className={`nav-toggle ${isMenuOpen ? 'active' : ''}`}
                    id="navToggle"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
