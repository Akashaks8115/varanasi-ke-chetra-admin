import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Trash2, ExternalLink, Image as ImageIcon, Eye, ThumbsUp, EyeOff, Edit } from 'lucide-react';
import http from '../../../services/http';
import { ENDPOINTS } from '../../../services/endpoints';
import { uploadImage } from '../../../services/uploadApi';
import './news-dashboard.css';

interface NewsItem {
    _id: string;
    title: string;
    snippet: string;
    imageUrl?: string;
    category?: string;
    source?: string;
    publishedDate?: string;
    pubDate?: string;
    views?: number;
    likes?: number;
    likesCount?: number;
    isActive?: boolean;
    url?: string;
    link?: string;
}

const NewsDashboard = () => {
    const [newsList, setNewsList] = useState<NewsItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isHiding, setIsHiding] = useState<string | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
    const [previewNews, setPreviewNews] = useState<NewsItem | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        snippet: '',
        category: 'General',
        source: '',
        link: '',
        imageUrl: '',
        pubDate: '',
        isActive: true
    });
    const [isSaving, setIsSaving] = useState(false);

    const limit = 20;

    const fetchNews = async (page = 1) => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const response = await http.post(ENDPOINTS.NEWS_LIST, {
                page,
                limit
            });
            
            const responseData = response.data;
            setNewsList(Array.isArray(responseData.data) ? responseData.data : []);
            
            if (responseData.pagination) {
                setTotalPages(responseData.pagination.totalPages || 1);
                setCurrentPage(responseData.pagination.currentPage || page);
            } else {
                setTotalPages(1);
                setCurrentPage(page);
            }
        } catch (error) {
            console.error('Error fetching news:', error);
            setErrorMessage('Failed to load news articles. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNews(1);
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this article?')) return;
        
        setIsDeleting(id);
        try {
            await http.delete(`${ENDPOINTS.DELETE_NEWS}/${id}`);
            setNewsList(prev => prev.filter(news => news._id !== id));
        } catch (error) {
            console.error('Error deleting news:', error);
            alert('Failed to delete the article.');
        } finally {
            setIsDeleting(null);
        }
    };

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            await http.post(ENDPOINTS.SYNC_NEWS);
            setLastSyncTime(new Date());
            await fetchNews(1);
        } catch (error) {
            console.error('Error syncing news:', error);
            alert('Failed to sync news.');
        } finally {
            setIsSyncing(false);
        }
    };

    const handleHide = async (id: string, currentStatus?: boolean) => {
        setIsHiding(id);
        try {
            await http.put(`${ENDPOINTS.HIDE_NEWS}/${id}`, {
                isActive: false
            });
            setNewsList(prev => prev.map(news => 
                news._id === id ? { ...news, isActive: false } : news
            ));
        } catch (error) {
            console.error('Error hiding news:', error);
            alert('Failed to hide the article.');
        } finally {
            setIsHiding(null);
        }
    };

    const handleOpenModal = (news?: NewsItem) => {
        setSelectedImage(null);
        if (news) {
            setEditingNews(news);
            setFormData({
                title: news.title || '',
                snippet: news.snippet || '',
                category: news.category || 'General',
                source: news.source || '',
                link: news.link || news.url || '',
                imageUrl: news.imageUrl || '',
                pubDate: (news.pubDate || news.publishedDate) ? new Date((news.pubDate || news.publishedDate) as string).toISOString().slice(0, 16) : '',
                isActive: news.isActive ?? true
            });
        } else {
            setEditingNews(null);
            setFormData({
                title: '',
                snippet: '',
                category: 'General',
                source: '',
                link: '',
                imageUrl: '',
                pubDate: '',
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingNews(null);
        setSelectedImage(null);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            let finalImageUrl = formData.imageUrl;
            
            if (selectedImage) {
                const uploadRes = await uploadImage(selectedImage, 'news');
                if (uploadRes.success && uploadRes.imageUrl) {
                    finalImageUrl = uploadRes.imageUrl;
                } else {
                    throw new Error(uploadRes.message || 'Failed to upload image');
                }
            }

            const payload = {
                ...formData,
                imageUrl: finalImageUrl,
                pubDate: formData.pubDate ? new Date(formData.pubDate).toISOString() : new Date().toISOString()
            };

            if (editingNews) {
                await http.put(`${ENDPOINTS.UPDATE_NEWS}/${editingNews._id}`, payload);
                alert('News updated successfully.');
            } else {
                await http.post(ENDPOINTS.INSERT_NEWS, payload);
                alert('News created successfully.');
            }
            handleCloseModal();
            fetchNews(currentPage);
        } catch (error: any) {
            console.error('Error saving news:', error);
            alert(error.response?.data?.message || error.message || 'Failed to save news article.');
        } finally {
            setIsSaving(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    return (
        <div className="news-dashboard">
            <header className="dashboard-header">
                <div>
                    <h2>News Management (Admin)</h2>
                    {lastSyncTime && (
                        <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                            Last synced: {lastSyncTime.toLocaleString()}
                        </p>
                    )}
                </div>
                <div className="header-actions">
                    <button className="btn-secondary" onClick={handleSync} disabled={isSyncing || isLoading}>
                        <RefreshCw size={18} className={isSyncing ? 'spin' : ''} />
                        {isSyncing ? 'Syncing...' : 'Sync & Refresh'}
                    </button>
                    <button className="btn-primary" onClick={() => handleOpenModal()}>
                        <Plus size={18} />
                        Add New Article
                    </button>
                </div>
            </header>

            {isLoading && !newsList.length ? (
                <div className="message-container">
                    <RefreshCw size={32} className="spin" style={{ marginBottom: '1rem', color: '#4f46e5' }} />
                    <p>Loading news articles...</p>
                </div>
            ) : errorMessage ? (
                <div className="message-container">
                    <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{errorMessage}</p>
                    <button className="btn-primary" onClick={() => fetchNews(currentPage)}>Retry</button>
                </div>
            ) : newsList.length === 0 ? (
                <div className="message-container">
                    <p>No news articles found.</p>
                </div>
            ) : (
                <>
                    <div className="news-grid">
                        {newsList.map(news => (
                            <div key={news._id} className="news-card">
                                {news.imageUrl ? (
                                    <img src={news.imageUrl} alt={news.title} className="news-image" />
                                ) : (
                                    <div className="news-image">
                                        <ImageIcon size={48} />
                                    </div>
                                )}
                                <div className="news-content">
                                    <div className="news-badges">
                                        {news.category && (
                                            <span className="badge category">{news.category}</span>
                                        )}
                                        {news.source && (
                                            <span className="badge source">{news.source}</span>
                                        )}
                                        <span className={`badge ${news.isActive !== false ? 'status-active' : 'status-inactive'}`}>
                                            {news.isActive !== false ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <h3 className="news-title">{news.title}</h3>
                                    <p className="news-snippet">{news.snippet}</p>
                                    
                                    <div className="news-stats">
                                        <div className="stat-item">
                                            <Eye size={14} /> {news.views || 0}
                                        </div>
                                        <div className="stat-item">
                                            <ThumbsUp size={14} /> {news.likesCount || news.likes || 0}
                                        </div>
                                        {(news.pubDate || news.publishedDate) && (
                                            <div className="stat-item" style={{ marginLeft: 'auto' }}>
                                                {formatDate(news.pubDate || news.publishedDate)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="news-actions">
                                        <button 
                                            className="action-btn delete" 
                                            onClick={() => handleDelete(news._id)}
                                            disabled={isDeleting === news._id || isHiding === news._id}
                                        >
                                            <Trash2 size={16} />
                                            {isDeleting === news._id ? 'Deleting...' : 'Delete'}
                                        </button>
                                        
                                        {news.isActive !== false && (
                                            <button 
                                                className="action-btn" 
                                                onClick={() => handleHide(news._id, news.isActive)}
                                                disabled={isHiding === news._id || isDeleting === news._id}
                                                style={{ color: '#d97706' }}
                                            >
                                                <EyeOff size={16} />
                                                {isHiding === news._id ? 'Hiding...' : 'Hide'}
                                            </button>
                                        )}

                                        <button 
                                            className="action-btn" 
                                            onClick={() => setPreviewNews(news)}
                                            style={{ color: '#059669' }}
                                        >
                                            <Eye size={16} />
                                            Preview
                                        </button>

                                        <button 
                                            className="action-btn edit" 
                                            onClick={() => handleOpenModal(news)}
                                        >
                                            <Edit size={16} />
                                            Edit
                                        </button>
                                        
                                        {(news.link || news.url) && (
                                            <a 
                                                href={news.link || news.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="action-btn"
                                            >
                                                <ExternalLink size={16} />
                                                Original
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pagination">
                        <button 
                            disabled={currentPage === 1 || isLoading}
                            onClick={() => fetchNews(currentPage - 1)}
                        >
                            Previous
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button 
                            disabled={currentPage === totalPages || isLoading}
                            onClick={() => fetchNews(currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}

            {isModalOpen && (
                <div className="news-modal-overlay" onClick={handleCloseModal}>
                    <div className="news-modal" onClick={e => e.stopPropagation()}>
                        <h3>{editingNews ? 'Edit News Article' : 'Add New Article'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Title *</label>
                                <input name="title" value={formData.title} onChange={handleFormChange} required minLength={5} />
                            </div>
                            <div className="form-group">
                                <label>Snippet *</label>
                                <textarea name="snippet" value={formData.snippet} onChange={handleFormChange} required minLength={10} />
                            </div>
                            <div className="form-group" style={{ display: 'flex', gap: '1rem', flexDirection: 'row' }}>
                                <div style={{ flex: 1 }}>
                                    <label>Category *</label>
                                    <select name="category" value={formData.category} onChange={handleFormChange}>
                                        <option value="General">General</option>
                                        <option value="Temple">Temple</option>
                                        <option value="Ghats">Ghats</option>
                                        <option value="Traffic">Traffic</option>
                                        <option value="Events">Events</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label>Source</label>
                                    <input name="source" value={formData.source} onChange={handleFormChange} placeholder="Admin / Official" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Link URL</label>
                                <input name="link" type="url" value={formData.link} onChange={handleFormChange} placeholder="https://" />
                            </div>
                            <div className="form-group">
                                <label>Image Upload / URL</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            setSelectedImage(file || null);
                                            if (file) {
                                                setFormData(prev => ({ ...prev, imageUrl: '' }));
                                            }
                                        }} 
                                    />
                                    <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#6b7280', margin: '0.25rem 0' }}>— OR —</div>
                                    <input 
                                        name="imageUrl" 
                                        type="url" 
                                        value={formData.imageUrl} 
                                        onChange={(e) => {
                                            handleFormChange(e);
                                            if (e.target.value) {
                                                setSelectedImage(null);
                                                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                                                if (fileInput) fileInput.value = '';
                                            }
                                        }} 
                                        placeholder="Enter image URL https://" 
                                        disabled={!!selectedImage}
                                    />
                                </div>
                            </div>
                            <div className="form-group" style={{ display: 'flex', gap: '1rem', flexDirection: 'row', alignItems: 'center' }}>
                                <div style={{ flex: 1 }}>
                                    <label>Publish Date</label>
                                    <input name="pubDate" type="datetime-local" value={formData.pubDate} onChange={handleFormChange} />
                                </div>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                                    <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleFormChange} style={{ width: 'auto', margin: 0 }} />
                                    <label style={{ margin: 0 }}>Is Active</label>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={isSaving}>
                                    {isSaving ? 'Saving...' : 'Save Article'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {previewNews && (
                <div className="news-modal-overlay" onClick={() => setPreviewNews(null)}>
                    <div className="news-modal" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>Preview News Article</h3>
                            <button 
                                className="btn-cancel" 
                                onClick={() => setPreviewNews(null)}
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                            >
                                Close
                            </button>
                        </div>
                        
                        {previewNews.imageUrl && (
                            <img src={previewNews.imageUrl} alt={previewNews.title} style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1.5rem' }} />
                        )}
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                            {previewNews.category && <span className="badge category">{previewNews.category}</span>}
                            {previewNews.source && <span className="badge source">{previewNews.source}</span>}
                            <span className={`badge ${previewNews.isActive !== false ? 'status-active' : 'status-inactive'}`}>
                                {previewNews.isActive !== false ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <h2 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '1.5rem', color: '#111827' }}>{previewNews.title}</h2>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Eye size={14}/> {previewNews.views || 0} Views</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><ThumbsUp size={14}/> {previewNews.likesCount || previewNews.likes || 0} Likes</div>
                            {(previewNews.pubDate || previewNews.publishedDate) && (
                                <div>Published: {formatDate(previewNews.pubDate || previewNews.publishedDate)}</div>
                            )}
                        </div>
                        <div style={{ lineHeight: '1.6', color: '#374151', whiteSpace: 'pre-wrap', marginBottom: '1.5rem', fontSize: '1rem' }}>
                            {previewNews.snippet}
                        </div>
                        {(previewNews.link || previewNews.url) && (
                            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '6px' }}>
                                <strong>Original Link: </strong>
                                <a href={previewNews.link || previewNews.url} target="_blank" rel="noopener noreferrer" style={{ color: '#4f46e5', wordBreak: 'break-all' }}>
                                    {previewNews.link || previewNews.url}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsDashboard;
