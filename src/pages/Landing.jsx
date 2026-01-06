import { Link } from 'react-router-dom';
import '../styles/Landing.css';

const Landing = () => {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Buy & sell safely <br />
                        <span className="highlight-text">on campus</span>
                    </h1>
                    <p className="hero-subtitle">
                        Unimate is the exclusive marketplace for your university.
                        No outsiders, no scams, just mates helping mates.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
                        <Link to="/login" className="btn btn-secondary btn-lg">Login</Link>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works">
                <h2 className="section-title">How Unimate Works</h2>
                <div className="steps-container">
                    <div className="step-card">
                        <div className="step-number">1</div>
                        <h3>Sign Up</h3>
                        <p>Create an account using your university email address to verify you're a student.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">2</div>
                        <h3>List or Browse</h3>
                        <p>Upload your textbooks, gear, or notes, or find what you need at student prices.</p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">3</div>
                        <h3>Connect & Trade</h3>
                        <p>Chat safely, arrange a meetup on campus, and complete the deal.</p>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="benefits-section">
                <div className="benefit-item">
                    <div className="benefit-icon">🔒</div>
                    <div className="benefit-text">
                        <h3>Verified Students Only</h3>
                        <p>Safety is our priority. Every user is verified via their .edu email.</p>
                    </div>
                </div>
                <div className="benefit-item">
                    <div className="benefit-icon">📍</div>
                    <div className="benefit-text">
                        <h3>On-Campus Meetups</h3>
                        <p>No shipping fees. No travel. Just meet at the library or student union.</p>
                    </div>
                </div>
                <div className="benefit-item">
                    <div className="benefit-icon">🚀</div>
                    <div className="benefit-text">
                        <h3>Fast & Simple</h3>
                        <p>List an item in under 30 seconds. Find what you need instantly.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
