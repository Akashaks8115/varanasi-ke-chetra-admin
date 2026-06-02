import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFlightEnquiries, deleteFlightEnquiry } from '../services/flightApi';
import { TravelEnquiry } from '../../../types';
import './flights-dashboard.css';

const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const FlightsDashboard = () => {
    const [items, setItems] = useState<TravelEnquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalInfo, setTotalInfo] = useState({ total: 0, page: 1, totalPages: 1 });
    const [currentPage, setCurrentPage] = useState(1);

    const fetchEnquiries = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getFlightEnquiries(currentPage, 10);
            if (response.success) {
                setItems(response.Data || []);
                setTotalInfo({
                    total: response.TotalCount || 0,
                    page: response.PageIndex || 1,
                    totalPages: Math.ceil((response.TotalCount || 0) / (response.PageSize || 10))
                });
            } else {
                setError('Failed to load flight enquiries.');
            }
        } catch (err: any) {
            setError(`Failed to fetch flight enquiries. ${err?.message || ''}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnquiries();
    }, [currentPage]);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this enquiry?')) {
            return;
        }
        try {
            const res = await deleteFlightEnquiry(id);
            if (res.success) {
                // Refresh list
                fetchEnquiries();
            } else {
                alert('Failed to delete enquiry');
            }
        } catch (err) {
            console.error('Delete error:', err);
            alert('Error deleting enquiry');
        }
    };


    return (
        <div className="flights-dashboard">
            <header className="dashboard-header">
                <h2>✈️ Flight Enquiries</h2>
                {!loading && !error && (
                    <span className="total-badge">{totalInfo.total} Total Enquiries</span>
                )}
            </header>
            <p className="sub-header">All incoming flight booking enquiries from users</p>

            {loading ? (
                <div className="loading">Loading enquiries...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : items.length === 0 ? (
                <div className="no-data">No flight enquiries found.</div>
            ) : (
                <div className="table-wrapper">
                    <table className="enquiries-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Passenger</th>
                                <th>Route</th>
                                <th>Travel Dates</th>
                                <th>Passengers</th>
                                <th>Enquiry Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, idx) => (
                                <tr key={item._id}>
                                    <td style={{ color: 'var(--text-sub)', fontWeight: 600 }}>{idx + 1}</td>

                                    {/* Passenger info */}
                                    <td>
                                        <div className="passenger-name">{item.name}</div>
                                        <div className="passenger-contact">📞 {item.contactNumber}</div>
                                        <div className="passenger-contact">✉️ {item.email}</div>
                                    </td>

                                    {/* Route */}
                                    <td>
                                        <div className="route-cell">
                                            <span>{item.fromLocation}</span>
                                            <span className="route-arrow">→</span>
                                            <span>{item.toLocation}</span>
                                        </div>
                                    </td>

                                    {/* Dates */}
                                    <td>
                                        <div className="date-range">
                                            <div><span className="date-label">From: </span>{formatDate(item.fromDate)}</div>
                                            <div><span className="date-label">To: </span>{formatDate(item.toDate)}</div>
                                        </div>
                                    </td>

                                    {/* Pax */}
                                    <td>
                                        <span className="pax-chip adult">👤 {item.adult} Adult{item.adult !== 1 ? 's' : ''}</span>
                                        {item.child > 0 && (
                                            <span className="pax-chip child">🧒 {item.child} Child{item.child !== 1 ? 'ren' : ''}</span>
                                        )}
                                    </td>

                                    {/* Created date */}
                                    <td>
                                        <div className="created-date">{formatDate(item.createdDate)}</div>
                                    </td>

                                    {/* Action */}
                                    <td>
                                        <button className="action-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                        <span>Showing {items.length} of {totalInfo.total} enquiries</span>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                                disabled={currentPage === 1}
                                className="action-btn"
                                style={{ background: currentPage === 1 ? '#ccc' : undefined }}
                            >
                                Previous
                            </button>
                            <span>Page {totalInfo.page} of {totalInfo.totalPages}</span>
                            <button 
                                onClick={() => setCurrentPage(prev => prev + 1)} 
                                disabled={currentPage >= totalInfo.totalPages}
                                className="action-btn"
                                style={{ background: currentPage >= totalInfo.totalPages ? '#ccc' : undefined }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlightsDashboard;
