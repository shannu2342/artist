import React, { useState } from 'react';
import './ContactPage.css';

const ContactPage = ({ whatsAppNumber }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitSuccess(true);
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });

            // Reset success message after 5 seconds
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 5000);
        }, 1500);
    };

    return (
        <div className="contact-page">
            <section className="contact-hero">
                <div className="container">
                    <div className="contact-hero-content">
                        <h1>Contact Me</h1>
                        <p>Get in touch for collaborations, commissions, or just to say hello</p>
                    </div>
                </div>
            </section>

            <section className="contact-content">
                <div className="container">
                    <div className="contact-grid">
                        <div className="contact-info">
                            <div className="contact-card">
                                <div className="contact-icon">
                                    <i className="fab fa-whatsapp"></i>
                                </div>
                                <h3>WhatsApp</h3>
                                <p>Quickest way to reach me</p>
                                <a
                                    href={`https://wa.me/${whatsAppNumber}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="contact-link"
                                >
                                    <i className="fas fa-external-link-alt"></i>
                                    Chat on WhatsApp
                                </a>
                            </div>

                            <div className="contact-card">
                                <div className="contact-icon">
                                    <i className="fas fa-envelope"></i>
                                </div>
                                <h3>Email</h3>
                                <p>For detailed inquiries</p>
                                <a
                                    href="mailto:artist@example.com"
                                    className="contact-link"
                                >
                                    <i className="fas fa-external-link-alt"></i>
                                    artist@example.com
                                </a>
                            </div>

                            <div className="contact-card">
                                <div className="contact-icon">
                                    <i className="fas fa-map-marker-alt"></i>
                                </div>
                                <h3>Location</h3>
                                <p>Based in India</p>
                                <a
                                    href="https://maps.google.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="contact-link"
                                >
                                    <i className="fas fa-external-link-alt"></i>
                                    View on Map
                                </a>
                            </div>
                        </div>

                        <div className="contact-form-container">
                            <div className="contact-form-card">
                                <h2>Send a Message</h2>
                                <p>Fill out the form below and I'll get back to you as soon as possible</p>

                                {submitSuccess && (
                                    <div className="form-success">
                                        <i className="fas fa-check-circle"></i>
                                        <p>Your message has been sent successfully! I'll get back to you soon.</p>
                                    </div>
                                )}

                                <form className="contact-form" onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label for="name">Your Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label for="email">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="your.email@example.com"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label for="subject">Subject</label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            placeholder="How can I help you?"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label for="message">Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            placeholder="Write your message here..."
                                            rows="6"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="submit-btn"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin"></i>
                                                <span>Sending...</span>
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-paper-plane"></i>
                                                <span>Send Message</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
