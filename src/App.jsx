import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import TermsPage from './pages/TermsPage';
import ContactPage from './pages/ContactPage';
import GalleryPage from './pages/GalleryPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AddPainting from './pages/AddPainting';
import ManagePaintings from './pages/ManagePaintings';
import EditPainting from './pages/EditPainting';
import EditAbout from './pages/EditAbout';
import EditServices from './pages/EditServices';
import EditTerms from './pages/EditTerms';
import EditWhatsApp from './pages/EditWhatsApp';
import EditHero from './pages/EditHero';
import EditArtistProfile from './pages/EditArtistProfile';
import { apiUrl } from './utils/api';
import { preloadImageUrls } from './utils/imagePerformance';

const App = () => {
    const [whatsAppNumber, setWhatsAppNumber] = useState('919876543210');
    const [gallery, setGallery] = useState([]);
    const [services, setServices] = useState([]);
    const [aboutContent, setAboutContent] = useState('');
    const [termsContent, setTermsContent] = useState('');
    const [heroImages, setHeroImages] = useState([]);
    const [artistProfile, setArtistProfile] = useState({ name: 'Aurexon', bio: '', image: '' });
    const [adminLoggedIn, setAdminLoggedIn] = useState(false);

    useEffect(() => {
        const fetchArtworks = async () => {
            try {
                const response = await fetch(apiUrl('/api/artworks'));
                if (response.ok) {
                    const artworks = await response.json();
                    setGallery(artworks);
                }
            } catch (error) {
                console.error('Error fetching artworks:', error);
            }
        };

        const fetchContent = async () => {
            try {
                const response = await fetch(apiUrl('/api/content'));
                if (response.ok) {
                    const content = await response.json();
                    if (Array.isArray(content.services)) {
                        setServices(content.services);
                    } else if (typeof content.services === 'string' && content.services.trim()) {
                        try {
                            const parsed = JSON.parse(content.services);
                            setServices(Array.isArray(parsed) ? parsed : []);
                        } catch (err) {
                            setServices([]);
                        }
                    } else {
                        setServices([]);
                    }
                    setAboutContent(content.about || 'Welcome to Aurexon - Creating Beyond the Canvas');
                    setTermsContent(content.terms || '');
                    setWhatsAppNumber(content.whatsapp || '919876543210');
                    setHeroImages(Array.isArray(content.heroImages) ? content.heroImages : []);
                    setArtistProfile(content.artistProfile || { name: 'Aurexon', bio: '', image: '' });
                }
            } catch (error) {
                console.error('Error fetching content:', error);
            }
        };

        fetchArtworks();
        fetchContent();

        const savedAdminLoggedIn = localStorage.getItem('adminLoggedIn');
        if (savedAdminLoggedIn === 'true') {
            setAdminLoggedIn(true);
        }
    }, []);

    useEffect(() => {
        const artworkCovers = gallery.map((art) => (art.images && art.images[0] ? art.images[0] : art.image));
        const importantImages = [
            ...heroImages,
            artistProfile?.image,
            ...artworkCovers
        ];

        preloadImageUrls(importantImages, 30);
    }, [gallery, heroImages, artistProfile?.image]);

    const addArtwork = async (artwork) => {
        try {
            const response = await fetch(apiUrl('/api/artworks'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify(artwork)
            });

            if (response.ok) {
                const newArtwork = await response.json();
                const newGallery = [...gallery, newArtwork];
                setGallery(newGallery);
            }
        } catch (error) {
            console.error('Error adding artwork:', error);
        }
    };

    const updateArtwork = async (id, updatedArtwork) => {
        try {
            const response = await fetch(apiUrl(`/api/artworks/${id}`), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify(updatedArtwork)
            });

            if (response.ok) {
                const updated = await response.json();
                const newGallery = gallery.map(art =>
                    art._id === id ? updated : art
                );
                setGallery(newGallery);
            }
        } catch (error) {
            console.error('Error updating artwork:', error);
        }
    };

    const deleteArtwork = async (id) => {
        try {
            const response = await fetch(apiUrl(`/api/artworks/${id}`), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            if (response.ok) {
                const newGallery = gallery.filter(art => art._id !== id);
                setGallery(newGallery);
            }
        } catch (error) {
            console.error('Error deleting artwork:', error);
        }
    };

    const updateServices = async (newServices) => {
        try {
            const response = await fetch(apiUrl('/api/content'), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({ services: newServices })
            });

            if (response.ok) {
                const updated = await response.json();
                setServices(Array.isArray(updated.services) ? updated.services : []);
            }
        } catch (error) {
            console.error('Error updating services:', error);
        }
    };

    const updateAbout = async (content) => {
        try {
            const response = await fetch(apiUrl('/api/content'), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({ about: content })
            });

            if (response.ok) {
                const updated = await response.json();
                setAboutContent(updated.about || '');
            }
        } catch (error) {
            console.error('Error updating about content:', error);
        }
    };

    const updateTerms = async (content) => {
        try {
            const response = await fetch(apiUrl('/api/content'), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({ terms: content })
            });

            if (response.ok) {
                const updated = await response.json();
                setTermsContent(updated.terms || '');
            }
        } catch (error) {
            console.error('Error updating terms:', error);
        }
    };

    const updateWhatsAppNumber = async (number) => {
        try {
            const response = await fetch(apiUrl('/api/content'), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({ whatsapp: number })
            });

            if (response.ok) {
                const updated = await response.json();
                setWhatsAppNumber(updated.whatsapp || '');
            }
        } catch (error) {
            console.error('Error updating WhatsApp number:', error);
        }
    };

    const updateHeroImages = async (formData) => {
        try {
            const response = await fetch(apiUrl('/api/content/hero-images'), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: formData
            });

            if (response.ok) {
                const updated = await response.json();
                setHeroImages(Array.isArray(updated.heroImages) ? updated.heroImages : []);
            }
        } catch (error) {
            console.error('Error updating hero images:', error);
        }
    };

    const deleteHeroImage = async (image) => {
        try {
            const response = await fetch(apiUrl('/api/content/hero-images'), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({ image })
            });

            if (response.ok) {
                const updated = await response.json();
                setHeroImages(Array.isArray(updated.heroImages) ? updated.heroImages : []);
            }
        } catch (error) {
            console.error('Error deleting hero image:', error);
        }
    };

    const updateArtistProfile = async (formData) => {
        try {
            const response = await fetch(apiUrl('/api/content/artist-profile'), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: formData
            });

            if (response.ok) {
                const updated = await response.json();
                setArtistProfile(updated.artistProfile || { name: 'Aurexon', bio: '', image: '' });
                if (updated.about) {
                    setAboutContent(updated.about);
                }
            }
        } catch (error) {
            console.error('Error updating artist profile:', error);
        }
    };

    const loginAdmin = () => {
        setAdminLoggedIn(true);
        localStorage.setItem('adminLoggedIn', 'true');
    };

    const logoutAdmin = () => {
        setAdminLoggedIn(false);
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminToken');
    };

    return (
        <Router>
            <div className="App">
                {/* Show Navbar, Footer, and WhatsApp button only on public pages */}
                {!window.location.pathname.startsWith('/admin') && <Navbar />}

                <Routes>
                    <Route path="/" element={
                        <HomePage
                            gallery={gallery}
                            whatsAppNumber={whatsAppNumber}
                            heroImages={heroImages}
                            artistProfile={artistProfile}
                        />
                    } />
                    <Route path="/about" element={
                        <AboutPage content={aboutContent} artistProfile={artistProfile} />
                    } />
                    <Route path="/services" element={
                        <ServicesPage
                            services={services}
                            whatsAppNumber={whatsAppNumber}
                        />
                    } />
                    <Route path="/terms" element={
                        <TermsPage content={termsContent} />
                    } />
                    <Route path="/contact" element={
                        <ContactPage whatsAppNumber={whatsAppNumber} />
                    } />
                    <Route path="/gallery" element={
                        <GalleryPage
                            gallery={gallery}
                            whatsAppNumber={whatsAppNumber}
                        />
                    } />
                    <Route path="/admin/login" element={
                        <AdminLogin onLogin={loginAdmin} />
                    } />
                    <Route path="/admin" element={
                        <AdminDashboard
                            isLoggedIn={adminLoggedIn}
                            onLogout={logoutAdmin}
                            gallery={gallery}
                            onAddArtwork={addArtwork}
                            onUpdateArtwork={updateArtwork}
                            onDeleteArtwork={deleteArtwork}
                            services={services}
                            onUpdateServices={updateServices}
                            aboutContent={aboutContent}
                            onUpdateAbout={updateAbout}
                            termsContent={termsContent}
                            onUpdateTerms={updateTerms}
                            whatsAppNumber={whatsAppNumber}
                            onUpdateWhatsAppNumber={updateWhatsAppNumber}
                        />
                    } />
                    <Route path="/admin/add-painting" element={
                        <AddPainting
                            onAddArtwork={addArtwork}
                        />
                    } />
                    <Route path="/admin/manage-paintings" element={
                        <ManagePaintings
                            gallery={gallery}
                            onDeleteArtwork={deleteArtwork}
                            onUpdateArtwork={updateArtwork}
                        />
                    } />
                    <Route path="/admin/edit-painting" element={
                        <EditPainting
                            onUpdateArtwork={updateArtwork}
                        />
                    } />
                    <Route path="/admin/edit-about" element={
                        <EditAbout
                            onUpdateAbout={updateAbout}
                            aboutContent={aboutContent}
                        />
                    } />
                    <Route path="/admin/edit-services" element={
                        <EditServices
                            onUpdateServices={updateServices}
                            services={services}
                        />
                    } />
                    <Route path="/admin/edit-terms" element={
                        <EditTerms
                            onUpdateTerms={updateTerms}
                            termsContent={termsContent}
                        />
                    } />
                    <Route path="/admin/edit-whatsapp" element={
                        <EditWhatsApp
                            onUpdateWhatsAppNumber={updateWhatsAppNumber}
                            whatsAppNumber={whatsAppNumber}
                        />
                    } />
                    <Route path="/admin/edit-hero" element={
                        <EditHero
                            heroImages={heroImages}
                            onUpdateHeroImages={updateHeroImages}
                            onDeleteHeroImage={deleteHeroImage}
                        />
                    } />
                    <Route path="/admin/edit-profile" element={
                        <EditArtistProfile
                            artistProfile={artistProfile}
                            onUpdateArtistProfile={updateArtistProfile}
                        />
                    } />
                </Routes>

                {!window.location.pathname.startsWith('/admin') && <Footer />}
                {!window.location.pathname.startsWith('/admin') && <WhatsAppButton number={whatsAppNumber} />}
            </div>
        </Router>
    );
};

export default App;
