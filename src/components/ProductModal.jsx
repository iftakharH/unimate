import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { chatService } from '../services/chatService';
import '../styles/ProductModal.css';

const ProductModal = ({ listing, onClose }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!listing) return null;

    const handleMessage = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (user.id === listing.seller_id) {
            alert("You cannot chat with yourself!");
            return;
        }

        try {
            const chatId = await chatService.getOrCreateChat(listing.id, listing.seller_id, user.id);
            navigate(`/chat/${chatId}`);
            onClose();
        } catch (error) {
            console.error('Error starting chat:', error);
            alert('Could not start chat. Please try again.');
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>×</button>

                <div className="modal-image">
                    <img src={listing.image_url} alt={listing.title} />
                </div>

                <div className="modal-body">
                    <h2 className="modal-title">{listing.title}</h2>
                    <p className="modal-price">${listing.price}</p>

                    <div className="modal-section">
                        <h3>Description</h3>
                        <p className="modal-description">{listing.description}</p>
                    </div>

                    <div className="modal-section">
                        <p className="modal-meta">
                            Listed on {new Date(listing.created_at).toLocaleDateString()}
                        </p>
                    </div>

                    {user && user.id !== listing.seller_id && (
                        <button className="btn-modal-action" onClick={handleMessage}>
                            💬 Message Seller
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
