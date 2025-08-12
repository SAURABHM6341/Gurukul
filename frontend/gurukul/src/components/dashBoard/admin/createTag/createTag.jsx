import React, { useState } from 'react';
import './createTag.css';
import { useSelector } from 'react-redux';
import { createTag } from '../../../../service/operations/adminApi';
import { toast } from 'react-hot-toast';
import { apiConnector } from '../../../../service/apiconnector';
import { categories } from '../../../../service/apis';
const CreateTag = () => {
    const [formData, setFormData] = useState({
        tagname: '',
        Description: ''
    });
    const [loading, setLoading] = useState(false);
    const token = useSelector((state) => state.auth?.token);

    const refreshCategories = async () => {
        try {
            // Trigger category refresh by calling the categories API
            await apiConnector("GET", categories.CATEGORIES_API);
            // This will help refresh the header categories when user navigates
            window.dispatchEvent(new Event('categoriesUpdated'));
        } catch (error) {
            console.log("Could not refresh categories:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.tagname.trim()) {
            toast.dismiss();
            toast.error("Tag name is required");
            return;
        }

        try {
            setLoading(true);
            const result = await createTag(formData, token);

            if (result) {
                setFormData({
                    tagname: '',
                    Description: ''
                });
                // Refresh categories after successful tag creation
                await refreshCategories();
                toast.success("Tag created successfully! Categories updated.");
            }
        } catch (error) {
            console.error("Error creating tag:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-tag-container">
            <div className="create-tag-header">
                <h1>Create New Tag</h1>
                <p>Create tags to categorize courses and make them easier to discover</p>
            </div>

            <div className="create-tag-form-container">
                <form onSubmit={handleSubmit} className="create-tag-form">
                    <div className="form-group">
                        <label htmlFor="tagname">
                            Tag Name <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="tagname"
                            name="tagname"
                            value={formData.tagname}
                            onChange={handleChange}
                            placeholder="Enter tag name (e.g., Web Development, Data Science)"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="Description">
                            Tag Description
                        </label>
                        <textarea
                            id="Description"
                            name="Description"
                            value={formData.Description}
                            onChange={handleChange}
                            placeholder="Enter a brief description of this tag..."
                            rows="4"
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => setFormData({ tagname: '', Description: '' })}
                        >
                            Clear
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Tag'}
                        </button>
                    </div>
                </form>

                <div className="tag-info">
                    <h3>Tag Guidelines</h3>
                    <ul>
                        <li>Use descriptive and relevant tag names</li>
                        <li>Keep tag names concise and easy to understand</li>
                        <li>Tags help students find courses more easily</li>
                        <li>Consider using existing tag names when possible</li>
                        <li>Use proper capitalization (e.g., "Web Development")</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CreateTag;
