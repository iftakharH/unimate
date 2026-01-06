import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { chatService } from '../services/chatService';
import ProductModal from '../components/ProductModal';
import '../styles/Marketplace.css';

const Marketplace = () => {
    const [listings, setListings] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedListing, setSelectedListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchListings();
    }, []);

    // Filter listings based on search query
    const filteredListings = listings.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const fetchListings = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('listings')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setListings(data || []);
        } catch (err) {
            console.error('Error fetching listings:', err);
            setError('Could not load listings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleMessage = async (listing) => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (user.id === listing.seller_id) {
            alert("You cannot chat with yourself!");
            return;
        }

        try {
            // Find existing chat or create new one
            const chatId = await chatService.getOrCreateChat(listing.id, listing.seller_id, user.id);
            navigate(`/chat/${chatId}`);
        } catch (error) {
            console.error('Error starting chat:', error);
            alert('Could not start chat. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="marketplace-container">
                <div className="loading-state">Loading marketplace...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="marketplace-container">
                <div className="error-state">{error}</div>
            </div>
        );
    }

    return (
        <div className="marketplace-container">
            <div className="marketplace-header">
                <div>
                    <h1 className="marketplace-title">Student Marketplace</h1>
                    <p className="marketplace-subtitle">Latest items from your peers</p>
                </div>
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {filteredListings.length === 0 ? (
                <div className="empty-state">
                    <h3>No items found</h3>
                    <p>Be the first to list something!</p>
                </div>
            ) : (
                <div className="items-grid">
                    {filteredListings.map((item) => (
                        <div key={item.id} className="item-card">
                            <div
                                className="item-image"
                                style={{ backgroundImage: `url(${item.image_url})` }}
                                role="img"
                                aria-label={item.title}
                            >
                                {!item.image_url && '📷'}
                            </div>
                            <div className="item-details">
                                <h3 className="item-title">{item.title}</h3>
                                <p className="item-price">${item.price}</p>
                                <div className="item-desc-preview">{item.description.substring(0, 60)}...</div>
                                <div className="item-actions">
                                    <button
                                        className="btn-view"
                                        onClick={() => setSelectedListing(item)}
                                    >
                                        Details
                                    </button>
                                    {user && user.id !== item.seller_id && (
                                        <button
                                            className="btn-message"
                                            onClick={() => handleMessage(item)}
                                        >
                                            Message
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedListing && (
                <ProductModal
                    listing={selectedListing}
                    onClose={() => setSelectedListing(null)}
                />
            )}
        </div>
    );
};

export default Marketplace;
