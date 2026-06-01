import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom'
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
    LogOut,
    Key,
    MessageCircle,
    ChevronDown,
    ChevronRight
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
    { label: 'Send Notification', icon: <Bell />, path: '/send-notification' },
    { label: 'User Token', icon: <Key />, path: '/user-token' },
    { label: 'Shaktipeeth', icon: <Sparkles />, path: '/shaktipeeth' },
    { label: 'Version', icon: <Tag />, path: '/version' },
    { label: 'auth', icon: <Lock />, path: '/auth' },
    { label: 'banner', icon: <Image />, path: '/banner' },
    { label: 'category', icon: <Folder />, path: '/category' },
    { 
        label: 'Enquiries', 
        icon: <MessageCircle />, 
        subItems: [
            { label: 'Flight Enquiries', icon: <Plane />, path: '/flights' },
            { label: 'Visa Enquiries', icon: <FileText />, path: '/visa' }
        ]
    }
]

const Sidebar = () => {
    const location = useLocation();
    const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>(() => {
        // Automatically open the submenu if we are on one of its paths
        const initialState: Record<string, boolean> = {};
        menu.forEach(item => {
            if (item.subItems) {
                const isActive = item.subItems.some(subItem => location.pathname === subItem.path);
                if (isActive) initialState[item.label] = true;
            }
        });
        return initialState;
    });

    const toggleSubMenu = (label: string) => {
        setOpenSubMenus(prev => ({
            ...prev,
            [label]: !prev[label]
        }));
    };
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
                {menu.map(item => {
                    if (item.subItems) {
                        const isOpen = openSubMenus[item.label];
                        return (
                            <div key={item.label}>
                                <div 
                                    className={`menu-item submenu-toggle ${isOpen ? 'open' : ''}`} 
                                    onClick={() => toggleSubMenu(item.label)}
                                    style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span className="icon">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </div>
                                    <span className="submenu-icon">
                                        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                    </span>
                                </div>
                                {isOpen && (
                                    <div className="submenu" style={{ marginLeft: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {item.subItems.map(subItem => (
                                            <NavLink
                                                key={subItem.label}
                                                to={subItem.path}
                                                className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
                                                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                                            >
                                                <span className="icon" style={{ transform: 'scale(0.8)' }}>{subItem.icon}</span>
                                                <span>{subItem.label}</span>
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <NavLink
                            key={item.label}
                            to={item.path!}
                            className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
                        >
                            <span className="icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </ul>

            <div className="sidebar-footer">
                <LogOut />
                <span>Sign Out</span>
            </div>

        </aside>
    )
}

export default Sidebar
