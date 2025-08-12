import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { apiConnector } from '../../../../service/apiconnector';
import { adminApi } from '../../../../service/apis';
import { toast } from 'react-hot-toast';
import './adminStats.css';

const AdminStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = useSelector((state) => state.auth?.token);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            toast.dismiss();
            const toastId = toast.loading("Loading dashboard statistics...");
            
            const response = await apiConnector("GET", `${adminApi.GET_ALL_USERS_API.replace('/users', '/dashboard/stats')}`, {
                Authorization: `Bearer ${token}`,
            });

            if (response?.data?.success) {
                setStats(response.data.data);
                toast.dismiss();
                toast.dismiss(toastId);
                toast.success("Statistics loaded successfully");
            } else {
                throw new Error("Could not fetch statistics");
            }
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            toast.dismiss();
            toast.error("Failed to load statistics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchDashboardStats();
        }
    }, [token]);

    if (loading) {
        return (
            <div className="admin-stats-loading">
                <div className="spinner"></div>
                <p>Loading dashboard statistics...</p>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="admin-stats-error">
                <h2>Unable to load statistics</h2>
                <button onClick={fetchDashboardStats} className="retry-btn">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="admin-stats-container">
            <div className="admin-stats-header">
                <h1>Dashboard Statistics</h1>
                <p>Overview of platform metrics and user activity</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card total-users">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                        <h3>Total Users</h3>
                        <div className="stat-number">{stats.totalUsers}</div>
                        <p>All registered users</p>
                    </div>
                </div>

                <div className="stat-card students">
                    <div className="stat-icon">🎓</div>
                    <div className="stat-content">
                        <h3>Students</h3>
                        <div className="stat-number">{stats.totalStudents}</div>
                        <p>Enrolled learners</p>
                    </div>
                </div>

                <div className="stat-card instructors">
                    <div className="stat-icon">👨‍🏫</div>
                    <div className="stat-content">
                        <h3>Instructors</h3>
                        <div className="stat-number">{stats.totalInstructors}</div>
                        <p>Course creators</p>
                    </div>
                </div>

                <div className="stat-card admins">
                    <div className="stat-icon">⚙️</div>
                    <div className="stat-content">
                        <h3>Admins</h3>
                        <div className="stat-number">{stats.totalAdmins}</div>
                        <p>Platform administrators</p>
                    </div>
                </div>

                <div className="stat-card courses">
                    <div className="stat-icon">📚</div>
                    <div className="stat-content">
                        <h3>Total Courses</h3>
                        <div className="stat-number">{stats.totalCourses}</div>
                        <p>Available courses</p>
                    </div>
                </div>

                <div className="stat-card recent-registrations">
                    <div className="stat-icon">🆕</div>
                    <div className="stat-content">
                        <h3>Recent Registrations</h3>
                        <div className="stat-number">{stats.recentRegistrations}</div>
                        <p>Last 7 days</p>
                    </div>
                </div>
            </div>

            <div className="stats-summary">
                <div className="summary-card">
                    <h3>Platform Overview</h3>
                    <div className="summary-content">
                        <div className="summary-item">
                            <span className="summary-label">Student-to-Instructor Ratio:</span>
                            <span className="summary-value">
                                {stats.totalInstructors > 0 ? 
                                    Math.round(stats.totalStudents / stats.totalInstructors) : 0}:1
                            </span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Courses per Instructor:</span>
                            <span className="summary-value">
                                {stats.totalInstructors > 0 ? 
                                    Math.round(stats.totalCourses / stats.totalInstructors) : 0}
                            </span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Growth Rate (7 days):</span>
                            <span className="summary-value">
                                {stats.totalUsers > 0 ? 
                                    ((stats.recentRegistrations / stats.totalUsers) * 100).toFixed(1) : 0}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="stats-actions">
                <button onClick={fetchDashboardStats} className="refresh-btn">
                    🔄 Refresh Statistics
                </button>
            </div>
        </div>
    );
};

export default AdminStats;
