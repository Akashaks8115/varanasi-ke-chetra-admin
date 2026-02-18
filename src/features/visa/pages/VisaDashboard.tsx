import React, { useEffect, useState } from 'react';
import { getVisaEnquiries } from '../services/visaApi';
import { TravelEnquiry } from '../../../types';
import '../../flights/pages/flights-dashboard.css'; // Reuse flights dashboard CSS

const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const VisaDashboard = () => {
    const [items, setItems] = useState<TravelEnquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalInfo, setTotalInfo] = useState({ total: 0, page: 1, totalPages: 1 });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getVisaEnquiries();
                if (response.success) {
                    setItems(response.data);
                    setTotalInfo({ total: response.total, page: response.page, totalPages: response.totalPages });
                } else {
                    setError('Failed to load visa enquiries.');
                }
            } catch (err: any) {
                setError(`Failed to fetch visa enquiries. ${err?.message || ''}`);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="flights-dashboard"> {/* Using same class for consistent styling */}
            <header className="dashboard-header">
                <h2>🛂 Visa Enquiries</h2>
                {!loading && !error && (
                    <span className="total-badge">{totalInfo.total} Total Enquiries</span>
                )}
            </header>
            <p className="sub-header">All incoming visa assistance enquiries from users</p>

            {loading ? (
                <div className="loading">Loading enquiries...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : items.length === 0 ? (
                <div className="no-data">No visa enquiries found.</div>
            ) : (
                <div className="table-wrapper">
                    <table className="enquiries-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Applicant</th>
                                <th>Route</th>
                                <th>Travel Dates</th>
                                <th>Applicants</th>
                                <th>Enquiry Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, idx) => (
                                <tr key={item._id}>
                                    <td style={{ color: 'var(--text-sub)', fontWeight: 600 }}>{idx + 1}</td>

                                    {/* Applicant info */}
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

                                    {/* Applicants */}
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
                                        <button className="action-btn">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination-info">
                        <span>Showing {items.length} of {totalInfo.total} enquiries</span>
                        <span>Page {totalInfo.page} of {totalInfo.totalPages}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VisaDashboard;
