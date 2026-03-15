import React, { useState } from 'react';
import { Home, Fish, CheckSquare, BarChart2, Menu, X, Calendar as CalendarIcon, Users } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import './Sidebar.css';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const { activeView, setActiveView } = useNavigation();

    const navItems = [
        { name: 'Aquarium & Dashboard', id: 'dashboard', icon: <Fish size={24} /> },
        { name: 'Habits', id: 'habits', icon: <Home size={24} /> },
        { name: 'To-Do List', id: 'todos', icon: <CheckSquare size={24} /> },
        { name: 'Analytics', id: 'analytics', icon: <BarChart2 size={24} /> },
        { name: 'Calendar (Soon)', id: 'calendar', icon: <CalendarIcon size={24} /> },
        { name: 'Community (Soon)', id: 'community', icon: <Users size={24} /> },
    ];

    const handleNavClick = (e, id) => {
        e.preventDefault();
        setActiveView(id);
        if (window.innerWidth < 992) {
            setIsOpen(false);
        }
    };

    return (
        <>
            <button
                className="mobile-menu-btn d-lg-none"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Sidebar"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <aside className={`marine - sidebar glass - panel ${isOpen ? 'open' : 'closed'} `}>
                <div className="sidebar-header">
                    <div className="logo-container">
                        <span className="logo-emoji">🐢</span>
                        {isOpen && <h2 className="logo-text">DeepHabits</h2>}
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        {navItems.map((item) => (
                            <li key={item.id} className="nav-item">
                                <a
                                    href={`#${item.id} `}
                                    className={`nav - link ${activeView === item.id ? 'active' : ''} `}
                                    onClick={(e) => handleNavClick(e, item.id)}
                                >
                                    <span className="nav-icon">{item.icon}</span>
                                    {isOpen && <span className="nav-text">{item.name}</span>}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {isOpen && (
                    <div className="sidebar-footer">
                        <div className="user-streak">
                            <span className="streak-icon">🔥</span>
                            <span className="streak-count">12 Day Streak</span>
                        </div>
                        <div className="theme-toggle">
                            {/* Future toggle for themes */}
                            <button className="btn-marine full-width">Settings</button>
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
};

export default Sidebar;
