import React from 'react';
import { Home, Fish, ShoppingBag, User } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import './BottomNav.css';

const BottomNav = () => {
    const { activeView, setActiveView } = useNavigation();

    const navItems = [
        { name: 'HOME', id: 'dashboard', icon: <Home size={28} /> },
        { name: 'AQUARIUM', id: 'aquarium', icon: <Fish size={28} /> },
        { name: 'STORE', id: 'store', icon: <ShoppingBag size={28} /> },
        { name: 'PROFILE', id: 'profile', icon: <User size={28} /> },
    ];

    const activeIndex = navItems.findIndex(item => item.id === activeView) !== -1 
                        ? navItems.findIndex(item => item.id === activeView) 
                        : 0;

    return (
        <nav className="mobile-bottom-nav">
            <ul className="nav-list">
                <div 
                    className="nav-indicator" 
                    style={{ transform: `translateX(${activeIndex * 100}%)` }}
                >
                    <div className="indicator-bubble"></div>
                </div>
                {navItems.map((item, index) => {
                    const isActive = activeView === item.id;
                    return (
                        <li key={item.id} className={`nav-item ${isActive ? 'active' : ''}`}>
                            <button
                                className="nav-btn"
                                onClick={() => setActiveView(item.id)}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                <span className="nav-label">{item.name}</span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default BottomNav;
