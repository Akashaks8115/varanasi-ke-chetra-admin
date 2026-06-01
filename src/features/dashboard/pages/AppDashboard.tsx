import { useEffect, useState } from 'react';
import http from '../../../services/http';
import {
    Landmark,
    Waves,
    Utensils,
    Folder,
    Route,
    Flame,
    Sparkles,
    Activity,
    Image as ImageIcon,
    Sun,
    Plane,
    Bus,
    FileText,
    Settings
} from 'lucide-react';
import './app-dashboard.css';

interface DashboardCounts {
    Temples: number;
    Ghats: number;
    HistoricalPlaces: number;
    Foods: number;
    Categories: number;
    Panchkroshi: number;
    Jyotirlings: number;
    Shaktipeeths: number;
    Activities: number;
    Banners: number;
    Spirituals: number;
    Flights: number;
    Transports: number;
    Visas: number;
    Services: number;
}

const AppDashboard = () => {
    const [counts, setCounts] = useState<DashboardCounts | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await http.get('admin/Dashboard');
            if (response.data.success) {
                setCounts(response.data.data);
            } else {
                setError('Failed to fetch dashboard data');
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('An error occurred while fetching data');
        } finally {
            setLoading(false);
        }
    };

    const getIconConfig = (key: string) => {
        switch (key) {
            case 'Temples': return { icon: <Landmark size={28} />, colorClass: 'gradient-orange' };
            case 'Ghats': return { icon: <Waves size={28} />, colorClass: 'gradient-blue' };
            case 'HistoricalPlaces': return { icon: <Landmark size={28} />, colorClass: 'gradient-amber' };
            case 'Foods': return { icon: <Utensils size={28} />, colorClass: 'gradient-red' };
            case 'Categories': return { icon: <Folder size={28} />, colorClass: 'gradient-purple' };
            case 'Panchkroshi': return { icon: <Route size={28} />, colorClass: 'gradient-green' };
            case 'Jyotirlings': return { icon: <Flame size={28} />, colorClass: 'gradient-pink' };
            case 'Shaktipeeths': return { icon: <Sparkles size={28} />, colorClass: 'gradient-indigo' };
            case 'Activities': return { icon: <Activity size={28} />, colorClass: 'gradient-teal' };
            case 'Banners': return { icon: <ImageIcon size={28} />, colorClass: 'gradient-cyan' };
            case 'Spirituals': return { icon: <Sun size={28} />, colorClass: 'gradient-yellow' };
            case 'Flights': return { icon: <Plane size={28} />, colorClass: 'gradient-sky' };
            case 'Transports': return { icon: <Bus size={28} />, colorClass: 'gradient-emerald' };
            case 'Visas': return { icon: <FileText size={28} />, colorClass: 'gradient-violet' };
            case 'Services': return { icon: <Settings size={28} />, colorClass: 'gradient-slate' };
            default: return { icon: <Activity size={28} />, colorClass: 'gradient-primary' };
        }
    };

    if (loading) return <div className="loading">Loading dashboard...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="app-dashboard">
            <div className="dashboard-header-premium">
                <div className="header-content">
                    <h2>Admin Overview</h2>
                    <p>Welcome back! Here's what's happening today.</p>
                </div>
            </div>

            {counts && (
                <div className="stats-grid-premium">
                    {Object.entries(counts).map(([key, value]) => {
                        const { icon, colorClass } = getIconConfig(key);
                        return (
                            <div key={key} className="stat-card-premium group">
                                <div className={`stat-icon-premium ${colorClass}`}>
                                    {icon}
                                </div>
                                <div className="stat-info-premium">
                                    <h3>{value}</h3>
                                    <p>{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                </div>
                                <div className="card-decoration"></div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AppDashboard;
