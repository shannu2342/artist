import React from 'react';
import { resolveImageUrl } from '../utils/api';
import './AboutPage.css';

const AboutPage = ({ content, artistProfile }) => {
    return (
        <div className="about-page">
            <section className="about-hero">
                <div className="container">
                    <div className="about-hero-content">
                        <h1>About AUREXON</h1>
                        <p>Creating Beyond the Canvas</p>
                    </div>
                </div>
            </section>

            <section className="about-content-section">
                <div className="container">
                    <div className="about-grid">
                        <div className="about-image">
                            {artistProfile?.image ? (
                                <img
                                    className="artist-portrait-image"
                                    src={resolveImageUrl(artistProfile.image)}
                                    alt={artistProfile?.name || 'Artist'}
                                    loading="eager"
                                    decoding="async"
                                    fetchPriority="high"
                                />
                            ) : (
                                <div className="artist-portrait">
                                    <i className="fas fa-palette"></i>
                                </div>
                            )}
                        </div>
                        <div className="about-text">
                            <h2>{artistProfile?.name ? `About ${artistProfile.name}` : 'About AUREXON'}</h2>
                            <div className="about-description">
                                {artistProfile?.bio || content ? (
                                    <p>{artistProfile?.bio || content}</p>
                                ) : (
                                    <>
                                        <p>
                                            AUREXON is a digital painting studio dedicated to pure creativity, artistic expression, and visual storytelling.
                                            The studio focuses on crafting high-quality digital artworks that combine imagination, emotion, and refined
                                            aesthetics, without being bound by trends or templates.
                                        </p>
                                        <p>
                                            At its core, AUREXON is about artistry over automation. Every piece is thoughtfully designed and painted
                                            with attention to form, color, mood, and detail resulting in visuals that feel expressive, original, and
                                            timeless. The studio embraces a hands-on creative process, valuing depth, craftsmanship, and personal
                                            vision in every artwork.
                                        </p>
                                        <p>
                                            AUREXON explores a wide range of artistic themes, from concept art and stylized illustrations to expressive
                                            visual narratives, always driven by a strong sense of composition and storytelling. The focus remains on
                                            creating art that connects emotionally, inspires curiosity, and leaves a lasting impression.
                                        </p>
                                        <p>
                                            AUREXON is not just a studio it is a creative space where ideas are shaped into meaningful visual art.
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            <section className="achievements">
                <div className="container">
                    <h2>Our Journey</h2>
                    <div className="achievements-list">
                        <div className="achievement-item">
                            <div className="achievement-icon">
                                <i className="fas fa-palette"></i>
                            </div>
                            <div className="achievement-content">
                                <h3>Studio Founded</h3>
                                <p>2018</p>
                            </div>
                        </div>
                        <div className="achievement-item">
                            <div className="achievement-icon">
                                <i className="fas fa-award"></i>
                            </div>
                            <div className="achievement-content">
                                <h3>International Recognition</h3>
                                <p>2021</p>
                            </div>
                        </div>
                        <div className="achievement-item">
                            <div className="achievement-icon">
                                <i className="fas fa-users"></i>
                            </div>
                            <div className="achievement-content">
                                <h3>Global Clientele</h3>
                                <p>20+ Countries</p>
                            </div>
                        </div>
                        <div className="achievement-item">
                            <div className="achievement-icon">
                                <i className="fas fa-images"></i>
                            </div>
                            <div className="achievement-content">
                                <h3>Artworks Created</h3>
                                <p>500+</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
