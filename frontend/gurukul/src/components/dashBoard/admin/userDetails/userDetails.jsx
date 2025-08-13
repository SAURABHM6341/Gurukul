import React, { useState, useEffect } from 'react';
import './userDetails.css';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserDetails } from '../../../../service/operations/adminApi';
import { toast } from 'react-hot-toast';

const UserDetails = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userId } = useParams();
    const token = useSelector((state) => state.auth?.token);
    const navigate = useNavigate();

    const fetchUserDetails = async () => {
        try {
            setLoading(true);
            const result = await getUserDetails(userId, token);

            if (result) {
                setUser(result.user);
            } else {
                navigate('/dashboard/admin/all-users');
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            navigate('/dashboard/admin/all-users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token && userId) {
            fetchUserDetails();
        }
    }, [token, userId]);

    const handleCourseClick = (courseId) => {
        navigate(`/course_details/${courseId}`);
    };

    if (loading) {
        return (
            <div className="user-details-loading">
                <div className="spinner"></div>
                <p>Loading user details...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="user-not-found">
                <h2>User not found</h2>
                <button onClick={() => navigate('/dashboard/admin/all-users')}>
                    Go Back to Users
                </button>
            </div>
        );
    }

    return (
        <div className="user-details-container">
            <div className="user-details-header">
                <button 
                    className="back-btn" 
                    onClick={() => navigate('/dashboard/admin/all-users')}
                >
                    ← Back to Users
                </button>
                <h1>User Details</h1>
            </div>

            <div className="user-details-content">
                <div className="user-profile-section">
                    <div className="user-avatar-large">
                        <img
                            src={user.image || `https://api.dicebear.com/5.x/initials/svg?seed=${user.Fname}${user.Lname}`}
                            alt={`${user.Fname} ${user.Lname}`}
                        />
                    </div>
                    <div className="user-basic-info">
                        <h2>{user.Fname} {user.Lname}</h2>
                        <p className="user-email">{user.email}</p>
                        <span className={`user-type-badge ${user.accountType.toLowerCase()}`}>
                            {user.accountType}
                        </span>
                    </div>
                </div>

                <div className="user-info-grid">
                    <div className="info-card">
                        <h3>Basic Information</h3>
                        <div className="info-item">
                            <span className="label">Full Name:</span>
                            <span className="value">{user.Fname} {user.Lname}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Email:</span>
                            <span className="value">{user.email}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Account Type:</span>
                            <span className="value">{user.accountType}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Join Date:</span>
                            <span className="value">{user?.createdAt?.split('T')[0]}</span>
                        </div>

                    </div>

                    {user.additionalDetails && (
                        <div className="info-card">
                            <h3>Additional Details</h3>
                            <div className="info-item">
                                <span className="label">About:</span>
                                <span className="value">{user.additionalDetails.about || 'Not provided'}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Contact Number:</span>
                                <span className="value">{user.additionalDetails.contactNumber || 'Not provided'}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Gender:</span>
                                <span className="value">{user.additionalDetails.gender || 'Not provided'}</span>
                            </div>
                            <div className="info-item">
                                <span className="label">Date of Birth:</span>
                                <span className="value">
                                    {user.additionalDetails.dateOfBirth 
                                        ? new Date(user.additionalDetails.dateOfBirth).toLocaleDateString()
                                        : 'Not provided'
                                    }
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="info-card">
                        <h3>Statistics</h3>
                        <div className="stats-grid">
                            <div className="stat-item">
                                <span className="stat-number">{user.courses?.length || 0}</span>
                                <span className="stat-label">
                                    {user.accountType === 'Instructor' ? 'Courses Created' : 'Courses Enrolled'}
                                </span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">{user.courseProgress?.length || 0}</span>
                                <span className="stat-label">Course Progress</span>
                            </div>
                        </div>
                    </div>
                </div>

                {user.courses && user.courses.length > 0 && (
                    <div className="user-courses-section">
                        <h3>
                            {user.accountType === 'Instructor' ? 'Created Courses' : 'Enrolled Courses'}
                        </h3>
                        <div className="courses-grid">
                            {user.courses.map((course) => (
                                <div
                                    key={course._id}
                                    className="course-card"
                                    onClick={() => handleCourseClick(course._id)}
                                >
                                    <img
                                        src={course.thumbnail || '/default-course.jpg'}
                                        alt={course.courseName}
                                        className="course-thumbnail"
                                    />
                                    <div className="course-info">
                                        <h4>{course.courseName}</h4>
                                        <p>{course.courseDescription}</p>
                                        <div className="course-meta">
                                            <span className="course-price">₹{course.price}</span>
                                            <span className={`course-status ${course.status?.toLowerCase()}`}>
                                                {course.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDetails;
