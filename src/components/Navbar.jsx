import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                {/* Logo redirects to Marketplace if logged in, otherwise Landing */}
                <Link to={user ? "/marketplace" : "/"} className="nav-logo">
                    Unimate
                </Link>
                <ul className="nav-menu">
                    {user ? (
                        <>
                            <li className="nav-item">
                                <Link to="/create-listing" className="nav-link nav-link-btn-sell">Sell Item</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/marketplace" className="nav-link">Marketplace</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/messages" className="nav-link">
                                    Messages
                                    <span className="notification-badge" style={{ display: 'none' }}>0</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/profile" className="nav-link">Profile</Link>
                            </li>
                            <li className="nav-item">
                                <button onClick={handleLogout} className="nav-link nav-link-btn-logout">
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            {/* Home link only visible when not logged in */}
                            <li className="nav-item">
                                <Link to="/" className="nav-link">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/login" className="nav-link nav-link-btn">Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/register" className="nav-link nav-link-btn-primary">Sign Up</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
