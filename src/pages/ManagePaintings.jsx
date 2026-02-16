import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManagePaintings.css';
import { resolveImageUrl } from '../utils/api';

const ManagePaintings = ({ gallery, onDeleteArtwork, onUpdateArtwork }) => {
    const navigate = useNavigate();
    const [paintings, setPaintings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [pendingDelete, setPendingDelete] = useState(null);

    useEffect(() => {
        const sorted = [...gallery].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setPaintings(sorted);
    }, [gallery]);

    const filteredPaintings = paintings.filter(painting => {
        const matchesSearch = painting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            painting.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const orderedPaintings = [...filteredPaintings].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const applyOrderChange = (paintingId, newPosition) => {
        const list = [...paintings].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        const currentIndex = list.findIndex(p => p._id === paintingId);
        if (currentIndex === -1) return;

        const targetIndex = Math.max(0, Math.min(list.length - 1, newPosition - 1));
        if (targetIndex === currentIndex) return;

        const [moved] = list.splice(currentIndex, 1);
        list.splice(targetIndex, 0, moved);

        const previousOrder = new Map(paintings.map(item => [item._id, item.order ?? 0]));
        const updatedList = list.map((item, index) => ({
            ...item,
            order: index + 1
        }));

        setPaintings(updatedList);

        updatedList.forEach((item) => {
            if (previousOrder.get(item._id) !== item.order) {
                onUpdateArtwork(item._id, { order: item.order });
            }
        });
    };

    const handleDeleteClick = (painting) => {
        setPendingDelete(painting);
    };

    const cancelDelete = () => {
        setPendingDelete(null);
    };

    const confirmDelete = () => {
        if (!pendingDelete) return;
        onDeleteArtwork(pendingDelete._id);
        setPendingDelete(null);
    };

    const handleEditClick = (painting) => {
        navigate('/admin/edit-painting', { state: { painting } });
    };

    const movePainting = (index, direction) => {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= orderedPaintings.length) return;

        const current = orderedPaintings[index];
        const target = orderedPaintings[targetIndex];

        const currentOrder = current.order ?? 0;
        const targetOrder = target.order ?? 0;

        onUpdateArtwork(current._id, { order: targetOrder });
        onUpdateArtwork(target._id, { order: currentOrder });
    };

    const handleBack = () => {
        navigate('/admin');
    };


    return (
        <div className="manage-paintings">
            <div className="admin-container">
                <header className="admin-header">
                    <div className="header-content">
                        <div className="logo-section">
                            <i className="fas fa-images"></i>
                            <h1>Manage Paintings</h1>
                        </div>
                        <div className="header-actions">
                            <button className="back-btn" onClick={handleBack}>
                                <i className="fas fa-arrow-left"></i>
                                <span>Back to Dashboard</span>
                            </button>
                            <button className="logout-btn" onClick={() => {
                                localStorage.removeItem('adminLoggedIn');
                                localStorage.removeItem('adminToken');
                                localStorage.removeItem('isAdminLoggedIn');
                                navigate('/admin/login');
                            }}>
                                <i className="fas fa-sign-out-alt"></i>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="admin-main">
                    <div className="filter-section">
                        <div className="search-box">
                            <i className="fas fa-search"></i>
                            <input
                                type="text"
                                placeholder="Search paintings..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="paintings-grid">
                        {filteredPaintings.length === 0 ? (
                            <div className="no-paintings">
                                <i className="fas fa-search"></i>
                                <h3>No paintings found</h3>
                                <p>Try adjusting your search or filter</p>
                            </div>
                        ) : (
                            orderedPaintings.map((painting, index) => (
                                <div key={painting._id} className="painting-card">
                                    <div className="painting-image">
                                        <img
                                            src={resolveImageUrl(painting.images ? painting.images[0] : painting.image)}
                                            alt={painting.title}
                                            loading="lazy"
                                            decoding="async"
                                        />
                                        {painting.featured && (
                                            <div className="featured-badge">
                                                <i className="fas fa-star"></i>
                                                Featured
                                            </div>
                                        )}
                                    </div>
                                    <div className="painting-info">
                                        <h3 className="painting-title">{painting.title}</h3>
                                        <p className="painting-description">{painting.description}</p>
                                        <div className="painting-order">
                                            <span>Order</span>
                                            <input
                                                type="number"
                                                min="1"
                                                max={orderedPaintings.length}
                                                defaultValue={index + 1}
                                                onBlur={(e) => {
                                                    const value = Number(e.target.value || index + 1);
                                                    applyOrderChange(painting._id, value);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="painting-actions">
                                        <button
                                            className="move-btn"
                                            onClick={() => movePainting(index, -1)}
                                            aria-label="Move up"
                                        >
                                            <i className="fas fa-arrow-up"></i>
                                        </button>
                                        <button
                                            className="move-btn"
                                            onClick={() => movePainting(index, 1)}
                                            aria-label="Move down"
                                        >
                                            <i className="fas fa-arrow-down"></i>
                                        </button>
                                        <button className="edit-btn" onClick={() => handleEditClick(painting)}>
                                            <i className="fas fa-edit"></i>
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            className="feature-btn"
                                            onClick={() => onUpdateArtwork(painting._id, { featured: !painting.featured })}
                                        >
                                            <i className={`fas ${painting.featured ? 'fa-star' : 'fa-star-half-alt'}`}></i>
                                            <span>{painting.featured ? 'Unfeature' : 'Feature'}</span>
                                        </button>
                                        <button className="delete-btn" onClick={() => handleDeleteClick(painting)}>
                                            <i className="fas fa-trash"></i>
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </main>
            </div>

            {pendingDelete && (
                <div className="delete-toast" role="alert">
                    <div className="delete-toast__content">
                        <i className="fas fa-exclamation-triangle"></i>
                        <span>
                            Delete "<strong>{pendingDelete.title}</strong>"? This cannot be undone.
                        </span>
                    </div>
                    <div className="delete-toast__actions">
                        <button className="toast-cancel" onClick={cancelDelete}>
                            Cancel
                        </button>
                        <button className="toast-confirm" onClick={confirmDelete}>
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePaintings;
