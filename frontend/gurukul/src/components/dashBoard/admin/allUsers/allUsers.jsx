import React, { useState, useEffect } from 'react';
import './allUsers.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, getAllStudents, getAllInstructors } from '../../../../service/operations/adminApi';
import { toast } from 'react-hot-toast';

const AllUsers = ({ userType = 'all' }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const token = useSelector((state) => state.auth?.token);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            let result = [];
            
            switch (userType) {
                case 'students':
                    result = await getAllStudents(token);
                    break;
                case 'instructors':
                    result = await getAllInstructors(token);
                    break;
                default:
                    result = await getAllUsers(token);
            }

            setUsers(result || []);
        } catch (error) {
            console.error("Error fetching users:", error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUsers();
        }
    }, [token, userType]);

    const filteredUsers = users.filter(user => {
        if (filter === 'All') return true;
        return user.accountType === filter;
    });

    const handleUserClick = (userId) => {
        navigate(`/dashboard/admin/user-details/${userId}`);
    };

    const getTitle = () => {
        switch (userType) {
            case 'students':
                return 'All Students';
            case 'instructors':
                return 'All Instructors';
            default:
                return 'All Users';
        }
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="spinner"></div>
                <p>Loading users...</p>
            </div>
        );
    }

    return (
        <div className="admin-users-container">
            <div className="admin-users-header">
                <h1>{getTitle()}</h1>
                <p>{filteredUsers.length} user(s) found</p>
            </div>

            {userType === 'all' && (
                <div className="users-filter">
                    <button
                        className={filter === 'All' ? 'active' : ''}
                        onClick={() => setFilter('All')}
                    >
                        All ({users.length})
                    </button>
                    <button
                        className={filter === 'Student' ? 'active' : ''}
                        onClick={() => setFilter('Student')}
                    >
                        Students ({users.filter(u => u.accountType === 'Student').length})
                    </button>
                    <button
                        className={filter === 'Instructor' ? 'active' : ''}
                        onClick={() => setFilter('Instructor')}
                    >
                        Instructors ({users.filter(u => u.accountType === 'Instructor').length})
                    </button>
                    <button
                        className={filter === 'Admin' ? 'active' : ''}
                        onClick={() => setFilter('Admin')}
                    >
                        Admins ({users.filter(u => u.accountType === 'Admin').length})
                    </button>
                </div>
            )}

            <div className="users-grid">
                {filteredUsers.length === 0 ? (
                    <div className="no-users">
                        <h3>No users found</h3>
                        <p>No users match the current filter criteria.</p>
                    </div>
                ) : (
                    filteredUsers.map((user) => (
                        <div
                            key={user._id}
                            className="user-card"
                            onClick={() => handleUserClick(user._id)}
                        >
                            <div className="user-avatar">
                                <img
                                    src={user.image || `https://api.dicebear.com/5.x/initials/svg?seed=${user.Fname}${user.Lname}`}
                                    alt={`${user.Fname} ${user.Lname}`}
                                />
                            </div>
                            <div className="user-info">
                                <h3>{user.Fname} {user.Lname}</h3>
                                <p className="user-email">{user.email}</p>
                                <span className={`user-type ${user?.accountType?.toLowerCase()}`}>
                                    {user.accountType}
                                </span>
                                <div className="user-stats">
                                    <span>Courses: {user.courses?.length || 0}</span>
                                    <span>Joined: {(user?.createdAt?.split('T')[0])}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AllUsers;
