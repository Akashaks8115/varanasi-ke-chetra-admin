import { NavLink } from 'react-router-dom'
import './sidebar.css'
import {
    LayoutDashboard,
    Activity,
    Database,
    Calendar,
    Utensils,
    Waves,
    Landmark,
    Flame,
    Route,
    Settings,
    Sparkles,
    Sun,
    Bell,
    Tag,
    Lock,
    Image,
    Folder,
    Plane,
    Bus,
    FileText,
    LogOut
} from 'lucide-react'

const menu = [
    { label: 'Dashboard', icon: <LayoutDashboard />, path: '/' },
    { label: 'Activity', icon: <Activity />, path: '/activity' },
    { label: 'Data', icon: <Database />, path: '/data' },
    { label: 'Events', icon: <Calendar />, path: '/events' },
    { label: 'Food', icon: <Utensils />, path: '/food' },
    { label: 'Ghat', icon: <Waves />, path: '/ghat' },
    { label: 'Temple', icon: <Landmark />, path: '/temple' },
    { label: 'HistoricalPlace', icon: <Landmark />, path: '/historical-place' },
    { label: 'Jyotirling', icon: <Flame />, path: '/jyotirling' },
    { label: 'Panchkroshi', icon: <Route />, path: '/panchkroshi' },
    { label: 'OurServices', icon: <Settings />, path: '/our-services' },
    { label: 'Spiritual Journey', icon: <Sun />, path: '/spiritual' },
    { label: 'Transport Service', icon: <Bus />, path: '/transport' },
    { label: 'Visa Enquiries', icon: <FileText />, path: '/visa' },
    { label: 'Send Notification', icon: <Bell />, path: '/send-notification' },
    { label: 'Shaktipeeth', icon: <Sparkles />, path: '/shaktipeeth' },
    { label: 'Version', icon: <Tag />, path: '/version' },
    { label: 'auth', icon: <Lock />, path: '/auth' },
    { label: 'banner', icon: <Image />, path: '/banner' },
    { label: 'category', icon: <Folder />, path: '/category' },
    { label: 'Flight Enquiries', icon: <Plane />, path: '/flights' }
]

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo">
                    <img src="https://res.cloudinary.com/dahgyycv1/image/upload/v1770533914/unnamed_ti2vel.webp" alt="VKC Logo" />
                </div>
                <span>VKC Admin</span>
            </div>

            <div className="sidebar-section">APP CONTENT</div>

            <ul className="menu">
                {menu.map(item => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
                    >
                        <span className="icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </ul>

            <div className="sidebar-footer">
                <LogOut />
                <span>Sign Out</span>
            </div>

        </aside>
    )
}

export default Sidebar
