import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';

const Profile = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    if (!user) return null; // Protected route handles redirect, but good safety

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-avatar">
                    {user.email.charAt(0).toUpperCase()}
                </div>
                <h1 className="profile-name">Student</h1>
                <p className="profile-email">{user.email}</p>
                <p className="profile-joined">Joined: {new Date(user.created_at).toLocaleDateString()}</p>
            </div>

            <div className="profile-actions">
                <button
                    className="action-card"
                    onClick={() => navigate('/my-listings')}
                >
                    <h3>📝 My Listings</h3>
                    <p>Manage items you are selling</p>
                </button>

                <button
                    className="action-card"
                    onClick={() => navigate('/my-deals')}
                >
                    <h3>🤝 My Deals</h3>
                    <p>View your purchases and sales</p>
                </button>
            </div>

            <div className="profile-footer">
                <button className="btn-logout-danger" onClick={handleLogout}>
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Profile;
