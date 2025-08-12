import React, { useState, useEffect } from 'react';
import './purchaseHistory.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { apiConnector } from '../../../service/apiconnector';
import { invoiceApi } from '../../../service/apis';
import { toast } from 'react-hot-toast';

const PurchaseHistory = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = useSelector((state) => state.auth?.token);
    const navigate = useNavigate();

    const fetchPurchaseHistory = async () => {
        try {
            setLoading(true);
            const response = await apiConnector("GET", invoiceApi.PURCHASE_HISTORY_API, {
                Authorization: `Bearer ${token}`
            });

            if (response.data.success) {
                setInvoices(response.data.invoices);
            } else {
                toast.error("Failed to fetch purchase history");
            }
        } catch (error) {
            console.error("Error fetching purchase history:", error);
            toast.error("Failed to fetch purchase history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchPurchaseHistory();
        }
    }, [token]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="purchase-history-loading">
                <div className="spinner"></div>
                <p>Loading purchase history...</p>
            </div>
        );
    }

    return (
        <div className="purchase-history-container">
            <div className="purchase-history-header">
                <h1>Purchase History</h1>
                <p>{invoices.length} purchase(s) found</p>
            </div>

            {invoices.length === 0 ? (
                <div className="no-purchases">
                    <div className="no-purchases-icon">📄</div>
                    <h3>No purchases yet</h3>
                    <p>You haven't made any course purchases. Start learning today!</p>
                    <button className="browse-courses-btn" onClick={() => navigate('/dashboard/allcourses')}>
                        Browse Courses
                    </button>
                </div>
            ) : (
                <div className="invoices-list">
                    {invoices.map((invoice) => (
                        <div key={invoice._id} className="invoice-card">
                            <div className="invoice-header">
                                <div className="invoice-info">
                                    <h3>Invoice #{invoice._id.slice(-8)}</h3>
                                    <p className="purchase-date">{formatDate(invoice.purchaseDate)}</p>
                                    <span className={`status-badge ${invoice.paymentStatus}`}>
                                        {invoice.paymentStatus.charAt(0).toUpperCase() + invoice.paymentStatus.slice(1)}
                                    </span>
                                </div>
                                <div className="invoice-total">
                                    <p className="total-label">Total Paid</p>
                                    <p className="total-amount">₹{invoice.totalAmount.toLocaleString('en-IN')}</p>
                                </div>
                            </div>

                            <div className="courses-purchased">
                                <h4>Courses Purchased:</h4>
                                <div className="courses-grid">
                                    {invoice.courses.map((course, index) => (
                                        <div key={index} className="course-item">
                                            <img 
                                                src={course.courseId?.thumbnail || '/default-course.jpg'} 
                                                alt={course.courseName}
                                                className="course-thumbnail"
                                            />
                                            <div className="course-details">
                                                <h5>{course.courseName}</h5>
                                                <p className="course-price">₹{course.price.toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="invoice-footer">
                                <div className="payment-details">
                                    <p><strong>Payment ID:</strong> {invoice.paymentId}</p>
                                    <p><strong>Payment Method:</strong> {invoice.paymentMethod}</p>
                                </div>
                                <button className="download-invoice-btn">
                                    📄 Download Invoice
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PurchaseHistory;
