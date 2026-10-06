import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/useAuth';
import '../styles/Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [cooldown, setCooldown] = useState(0);

    const navigate = useNavigate();
    const { user } = useAuth();

    // If user is already logged in, redirect to marketplace
    useEffect(() => {
        if (user) {
            navigate('/marketplace');
        }
    }, [user, navigate]);

    // Countdown when Supabase asks us to wait before retrying
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cooldown > 0) return;

        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setErrorMsg("Passwords don't match");
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setErrorMsg("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                    },
                },
            });

            if (error) throw error;

            if (!data.session) {
                // The project still requires email confirmation: no session yet.
                setSuccessMsg(`Account created! We sent a confirmation link to ${formData.email}. Check your inbox (and spam folder) to activate it.`);
            }
            // With confirmation disabled the auth state change logs the user
            // in and the effect above redirects to the marketplace.
        } catch (error) {
            const wait = error.message?.match(/after (\d+) seconds?/i);
            if (wait) {
                const seconds = Number(wait[1]) || 60;
                setCooldown(seconds);
                setErrorMsg(`Too many signup attempts. Please wait ${seconds} seconds, then try again.`);
            } else if (/rate limit/i.test(error.message || '')) {
                setCooldown(60);
                setErrorMsg('Too many signup emails were requested. Please wait a few minutes, then try again.');
            } else {
                setErrorMsg(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            setErrorMsg('');
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/marketplace`
                }
            });
            if (error) throw error;
        } catch (error) {
            setErrorMsg(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2 className="auth-title">Join Unimate</h2>
                <p className="auth-subtitle">Connect with your university community</p>

                {errorMsg && <div className="auth-error">{errorMsg}</div>}
                {successMsg && <div className="auth-success">{successMsg}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Your full name as per university records"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">University Email</label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="yourname@university.edu (Required for verification)"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Minimum 6 characters for security"
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex="-1"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-type your password to confirm"
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                tabIndex="-1"
                                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={loading || cooldown > 0}>
                        {loading
                            ? 'Creating Account...'
                            : cooldown > 0
                                ? `Try again in ${cooldown}s`
                                : 'Create Account'}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>or continue with</span>
                </div>

                <button 
                    onClick={handleGoogleSignIn} 
                    className="google-btn" 
                    disabled={loading}
                    type="button"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                    Sign in with Google
                </button>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
