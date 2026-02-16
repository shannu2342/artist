import React from 'react';
import './TermsPage.css';

const TermsPage = ({ content }) => {
    return (
        <div className="terms-page">
            <section className="terms-hero">
                <div className="container">
                    <div className="terms-hero-content">
                        <h1>Terms & Conditions</h1>
                        <p>Important information about artwork ownership and usage rights</p>
                    </div>
                </div>
            </section>

            <section className="terms-content">
                <div className="container">
                    <div className="terms-container">
                        {content || (
                            <>
                                <div className="term-section">
                                    <h2>1. Copyright Ownership</h2>
                                    <p>
                                        All artworks displayed on this website remain the exclusive intellectual property of the artist.
                                        The artist retains all copyright, reproduction rights, and all other intellectual property rights
                                        for each artwork unless explicitly stated otherwise.
                                    </p>
                                </div>

                                <div className="term-section">
                                    <h2>2. Usage Rights for Purchasers</h2>
                                    <p>
                                        When you purchase an original artwork, you are buying the physical piece only. The artist retains
                                        all copyright and reproduction rights. You may not reproduce, distribute, or publicly display
                                        the artwork without obtaining explicit written permission from the artist.
                                    </p>
                                </div>

                                <div className="term-section">
                                    <h2>3. Custom Order Terms</h2>
                                    <p>
                                        Custom orders require a 50% deposit before work begins. The remaining balance must be paid
                                        upon completion of the artwork. Custom orders are non-refundable once work has started.
                                    </p>
                                    <p>
                                        The artist will provide updates during the creation process and seek your input at key stages.
                                        However, the final artistic decisions remain with the artist.
                                    </p>
                                </div>

                                <div className="term-section">
                                    <h2>4. Watermark & Misuse Warning</h2>
                                    <p>
                                        All images of artwork on this website are protected by digital watermarks. These watermarks
                                        are placed to prevent unauthorized use, reproduction, or distribution of the artwork images.
                                    </p>
                                    <p>
                                        Removing or altering watermarks from any artwork images is strictly prohibited and may result
                                        in legal action. Any unauthorized use of artwork images constitutes copyright infringement.
                                    </p>
                                </div>

                                <div className="term-section">
                                    <h2>5. Original Artwork Authenticity</h2>
                                    <p>
                                        Every original artwork comes with a certificate of authenticity signed by the artist. This
                                        certificate includes details about the artwork, creation date, materials used, and provenance.
                                    </p>
                                </div>

                                <div className="term-section">
                                    <h2>6. Pricing & Payment Terms</h2>
                                    <p>
                                        Prices for artworks are displayed in your local currency. Prices are subject to change without
                                        notice. Payments are processed through secure payment methods.
                                    </p>
                                    <p>
                                        For custom orders, payment terms will be agreed upon in writing before work begins. Late payments
                                        may result in delays or cancellation of the order.
                                    </p>
                                </div>

                                <div className="term-section">
                                    <h2>7. Shipping & Delivery</h2>
                                    <p>
                                        Artworks are carefully packaged to ensure safe delivery. Shipping costs are additional and will
                                        be calculated based on your location. International shipping may take additional time and
                                        incur customs charges.
                                    </p>
                                    <p>
                                        The artist is not responsible for delays caused by shipping carriers or customs processes.
                                        Insurance for shipping is recommended and can be arranged at additional cost.
                                    </p>
                                </div>

                                <div className="term-section">
                                    <h2>8. Refund Policy</h2>
                                    <p>
                                        Original artworks are non-refundable once purchased. However, if the artwork arrives damaged,
                                        please contact us within 7 days of delivery with photographs of the damage. We will arrange
                                        for a replacement or refund.
                                    </p>
                                    <p>
                                        Custom orders are non-refundable once work has started.
                                    </p>
                                </div>

                                <div className="term-section">
                                    <h2>9. Artist's Right to Display</h2>
                                    <p>
                                        The artist reserves the right to display images of all artworks, including custom commissions,
                                        in their portfolio, exhibitions, and marketing materials unless explicitly stated otherwise
                                        in writing.
                                    </p>
                                </div>

                                <div className="term-section">
                                    <h2>10. Governing Law</h2>
                                    <p>
                                        These terms and conditions shall be governed by and construed in accordance with the laws of
                                        India. Any disputes arising from these terms and conditions shall be subject to the exclusive
                                        jurisdiction of the courts of India.
                                    </p>
                                </div>

                                <div className="contact-info">
                                    <h3>Contact Information</h3>
                                    <p>
                                        If you have any questions about these terms and conditions, please contact the artist through
                                        the contact form or WhatsApp provided on this website.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            <section className="terms-warning">
                <div className="container">
                    <div className="warning-box">
                        <div className="warning-icon">
                            <i className="fas fa-exclamation-triangle"></i>
                        </div>
                        <div className="warning-content">
                            <h3>Important Notice</h3>
                            <p>
                                All images on this website are protected by copyright law. Unauthorized use, reproduction, or distribution
                                of any artwork images is strictly prohibited and may result in legal consequences.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TermsPage;
