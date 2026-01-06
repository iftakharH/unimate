import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import '../styles/MyListings.css';

const MyListings = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchMyListings();
        }
    }, [user]);

    const fetchMyListings = async () => {
        try {
            const { data, error } = await supabase
                .from('listings')
                .select('*')
                .eq('seller_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setListings(data || []);
        } catch (error) {
            console.error('Error fetching listings:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
            return;
        }

        try {
            const { error } = await supabase
                .from('listings')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setListings(listings.filter(item => item.id !== id));
        } catch (error) {
            alert('Error deleting listing: ' + error.message);
        }
    };

    if (loading) return <div className="loading">Loading your items...</div>;

    return (
        <div className="mylists-container">
            <div className="mylists-header">
                <h1>My Listings</h1>
                <button className="btn-create" onClick={() => navigate('/create-listing')}>
                    + New Listing
                </button>
            </div>

            {listings.length === 0 ? (
                <div className="empty-state">
                    <p>You haven't listed anything yet.</p>
                    <button onClick={() => navigate('/create-listing')}>Sell your first item</button>
                </div>
            ) : (
                <div className="listings-grid">
                    {listings.map(item => (
                        <div key={item.id} className="listing-card">
                            <div className="card-image">
                                <img src={item.image_url} alt={item.title} />
                            </div>
                            <div className="card-content">
                                <h3>{item.title}</h3>
                                <p className="price">${item.price}</p>
                                <div className="card-actions">
                                    <button
                                        className="btn-edit"
                                        onClick={() => navigate(`/edit-listing/${item.id}`)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyListings;
