import React, { useState } from 'react';
import './WhatsAppButton.css';

const WhatsAppButton = ({ number }) => {
    const [showGreeting, setShowGreeting] = useState(false);

    const handleClick = () => {
        const message = encodeURIComponent('Hello! I saw your art portfolio and would like to learn more about your beautiful paintings.');
        window.open(`https://wa.me/${number}?text=${message}`, '_blank');
    };

    return (
        <>
            <button
                className="whatsapp-button"
                onClick={handleClick}
                onMouseEnter={() => setShowGreeting(true)}
                onMouseLeave={() => setShowGreeting(false)}
                aria-label="Chat on WhatsApp"
            >
                <i className="fab fa-whatsapp"></i>
            </button>

            {showGreeting && (
                <div className="whatsapp-greeting">
                    <i className="fas fa-comments"></i> Chat with us on WhatsApp
                </div>
            )}
        </>
    );
};

export default WhatsAppButton;
