import React, { useEffect, useState } from 'react';
import './catalog.css';
import { useNavigate } from 'react-router-dom';
import { apiConnector } from '../../service/apiconnector';
import { categories } from '../../service/apis';

const Catalog = () => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const result = await apiConnector("GET", categories.CATEGORIES_API);
            console.log("Fetched categories:", result);
            if (result?.data?.tags) {
                setTags(result.data.tags);
            } else {
                setTags([]);
            }
        } catch (err) {
            console.log("Could not fetch categories:", err);
            setTags([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleTagClick = (tagId) => {
        navigate(`/tag/${tagId}`);
    };

    if (loading) {
        return (
            <div className="catalog-container">
                <div className="catalog-loading">
                    <h2>Loading Categories...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="catalog-container">
            <div className="catalog-header">
                <h1>Explore All <span className="highlight">Categories</span></h1>
                <p>Discover courses across various programming languages and technologies</p>
            </div>
            
            <div className="catalog-grid">
                {tags.length > 0 ? (
                    tags.map((tag, index) => (
                        <div 
                            key={tag._id || index} 
                            className="catalog-card"
                            onClick={() => handleTagClick(tag._id)}
                        >
                            <div className="catalog-card-header">
                                <h3>{tag.name}</h3>
                            </div>
                            <div className="catalog-card-body">
                                <p>{tag.Description}</p>
                            </div>
                            <div className="catalog-card-footer">
                                <button className="explore-btn">
                                    Explore Courses →
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-categories">
                        <h3>No categories available at the moment</h3>
                        <p>Please check back later for more course categories</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Catalog;
