import React from 'react';
import './ServicesPage.css';

const ServicesPage = ({ services, whatsAppNumber }) => {
    const defaultServices = [
        {
            id: 1,
            title: 'Custom Artworks',
            description: 'Commission unique pieces tailored to your preferences and requirements. I work closely with you to bring your vision to life.',
            icon: 'fa-paint-brush'
        },
        {
            id: 2,
            title: 'Art Workshops',
            description: 'Learn the art of painting with hands-on guidance. Perfect for beginners and intermediate artists looking to enhance their skills.',
            icon: 'fa-graduation-cap'
        },
        {
            id: 3,
            title: 'Exhibitions',
            description: 'Participate in art shows and exhibitions. I organize regular exhibitions to showcase my latest works and connect with art lovers.',
            icon: 'fa-gallery'
        },
        {
            id: 4,
            title: 'Art Consultation',
            description: 'Professional guidance on art collection, placement, and interior design integration. Find the perfect artwork for your space.',
            icon: 'fa-comments'
        },
        {
            id: 5,
            title: 'Art Restoration',
            description: 'Professional restoration services for damaged artworks. Bring your cherished pieces back to their original glory.',
            icon: 'fa-tools'
        },
        {
            id: 6,
            title: 'Digital Art',
            description: 'Modern digital art creations using advanced tools and techniques. Perfect for digital platforms and contemporary spaces.',
            icon: 'fa-tablet-alt'
        }
    ];

    const displayServices = services.length > 0 ? services.map(service => ({
        ...service,
        title: service.name,
        icon: 'fa-paint-brush' // Default icon if not provided
    })) : defaultServices;

    const handleWhatsAppClick = (service) => {
        const message = encodeURIComponent(`Hello, I'm interested in your "${service.title}" service. Please share details.`);
        window.open(`https://wa.me/${whatsAppNumber}?text=${message}`, '_blank');
    };

    return (
        <div className="services-page">
            <section className="services-hero">
                <div className="container">
                    <div className="services-hero-content">
                        <h1>Services</h1>
                        <p>Transforming ideas into beautiful artworks</p>
                    </div>
                </div>
            </section>

            <section className="services-grid-section">
                <div className="container">
                    <div className="services-grid">
                        {displayServices.map((service) => (
                            <div key={service.id} className="service-card">
                                <div className="service-icon">
                                    <i className={`fas ${service.icon}`}></i>
                                </div>
                                <h2 className="service-title">{service.title}</h2>
                                <p className="service-description">{service.description}</p>
                                <button
                                    className="service-whatsapp-btn"
                                    onClick={() => handleWhatsAppClick(service)}
                                >
                                    <i className="fab fa-whatsapp"></i>
                                    <span>Enquire on WhatsApp</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="services-info-section">
                <div className="container">
                    <div className="services-info-content">
                        <div className="info-text">
                            <h2>Why Choose My Services?</h2>
                            <p>
                                With years of experience and a passion for creativity, I offer comprehensive art services that cater to both
                                individual art enthusiasts and businesses. Whether you're looking for a custom piece to adorn your space or
                                seeking guidance on building an art collection, I'm here to help.
                            </p>

                            <div className="benefits-list">
                                <div className="benefit-item">
                                    <div className="benefit-icon">
                                        <i className="fas fa-check-circle"></i>
                                    </div>
                                    <div className="benefit-content">
                                        <h4>Personalized Approach</h4>
                                        <p>Every project is unique, and I tailor my services to meet your specific requirements.</p>
                                    </div>
                                </div>

                                <div className="benefit-item">
                                    <div className="benefit-icon">
                                        <i className="fas fa-check-circle"></i>
                                    </div>
                                    <div className="benefit-content">
                                        <h4>Quality Assurance</h4>
                                        <p>I use premium materials and techniques to ensure the highest quality in every piece.</p>
                                    </div>
                                </div>

                                <div className="benefit-item">
                                    <div className="benefit-icon">
                                        <i className="fas fa-check-circle"></i>
                                    </div>
                                    <div className="benefit-content">
                                        <h4>Timely Delivery</h4>
                                        <p>Your satisfaction is my priority, and I ensure projects are completed on schedule.</p>
                                    </div>
                                </div>

                                <div className="benefit-item">
                                    <div className="benefit-icon">
                                        <i className="fas fa-check-circle"></i>
                                    </div>
                                    <div className="benefit-content">
                                        <h4>Competitive Pricing</h4>
                                        <p>Quality art shouldn't break the bank. I offer fair and transparent pricing.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="info-image">
                            <div className="service-placeholder">
                                <i className="fas fa-palette"></i>
                                <p>Art in Progress</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="contact-cta-section">
                <div className="container">
                    <div className="contact-cta-content">
                        <h2>Ready to Get Started?</h2>
                        <p>
                            Whether you have a specific project in mind or just want to learn more about my services, I'd love to hear from you.
                        </p>
                        <button
                            className="btn btn-whatsapp btn-large"
                            onClick={() => {
                                const message = encodeURIComponent('Hello! I saw your services and would like to learn more about what you offer.');
                                window.open(`https://wa.me/${whatsAppNumber}?text=${message}`, '_blank');
                            }}
                        >
                            <i className="fab fa-whatsapp"></i>
                            <span>Contact Me Now</span>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ServicesPage;
