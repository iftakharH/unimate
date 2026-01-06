import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import '../styles/CreateListing.css';

const CreateListing = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            let publicUrl = 'https://via.placeholder.com/400x300/f7f8f9/636e72?text=No+Image';

            // Only upload image if one is selected
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${user.id}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('listing-images')
                    .upload(filePath, imageFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl: uploadedUrl } } = supabase.storage
                    .from('listing-images')
                    .getPublicUrl(filePath);

                publicUrl = uploadedUrl;
            }

            // Insert into Database
            const { error: insertError } = await supabase
                .from('listings')
                .insert([
                    {
                        title: formData.title,
                        description: formData.description,
                        price: parseFloat(formData.price),
                        image_url: publicUrl,
                        seller_id: user.id,
                    },
                ]);

            if (insertError) throw insertError;

            // Redirect to Marketplace
            navigate('/marketplace');

        } catch (error) {
            console.error('Error creating listing:', error);
            setErrorMsg(error.message || 'Failed to create listing');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-listing-container">
            <div className="create-listing-box">
                <h2 className="listing-title">Sell an Item</h2>
                <p className="listing-subtitle">List your textbook, gear, or notes</p>

                {errorMsg && <div className="listing-error">{errorMsg}</div>}

                <form onSubmit={handleSubmit} className="listing-form">
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Calculus 101 Textbook"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">Price ($)</label>
                        <input
                            type="number"
                            id="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="25.00"
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe condition, pickup location, etc."
                            rows="4"
                            required
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="image">Item Image (Optional)</label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <small className="file-help">Optional. Max size 2MB. Placeholder will be used if no image is uploaded.</small>
                    </div>

                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                        {loading ? 'Creating Listing...' : 'List Item'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateListing;
