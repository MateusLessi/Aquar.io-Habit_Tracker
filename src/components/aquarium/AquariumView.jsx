import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Compass, CheckSquare, MessageCircle, BarChart2 } from 'lucide-react';
import HabitBoard from '../habits/HabitBoard';
import ToDoList from '../todo/ToDoList';
import ProgressCharts from '../analytics/ProgressCharts';
import '../habits/HabitsView.css'; // Reusing established tabs CSS

const AquariumView = () => {
    // Top-level tabs for Aquarium Area
    const [activeTab, setActiveTab] = useState('habits');
    const [portalNode, setPortalNode] = useState(null);

    useEffect(() => {
        setPortalNode(document.getElementById('tabs-portal'));
    }, []);

    const tabsHeader = (
        <div className="habits-tabs-wrapper">
            <div className="habits-tabs">
                <button
                    className={`tab-btn icon-tab ${activeTab === 'habits' ? 'active' : ''}`}
                    onClick={() => setActiveTab('habits')}
                    title="Hábitos"
                >
                    <Compass size={20} />
                </button>
                <button
                    className={`tab-btn icon-tab ${activeTab === 'todos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('todos')}
                    title="To-Do"
                >
                    <CheckSquare size={20} />
                </button>
                <button
                    className={`tab-btn icon-tab ${activeTab === 'community' ? 'active' : ''}`}
                    onClick={() => setActiveTab('community')}
                    title="Chat"
                >
                    <MessageCircle size={20} />
                </button>
                <button
                    className={`tab-btn icon-tab ${activeTab === 'stats' ? 'active' : ''}`}
                    onClick={() => setActiveTab('stats')}
                    title="Stats"
                >
                    <BarChart2 size={20} />
                </button>
            </div>
        </div>
    );

    return (
        <div className="aquarium-sub-content">
            <div className="habits-view-container">
                {/* Top Tabs rendered into the Layout's static portal */}
                {portalNode ? createPortal(tabsHeader, portalNode) : tabsHeader}

            {/* Tab Content */}
            <div className="habits-content" style={{ marginTop: '1rem' }}>
                {activeTab === 'habits' && (
                    <div className="tab-pane active fade-in">
                        <HabitBoard />
                    </div>
                )}

                {activeTab === 'todos' && (
                    <div className="tab-pane active fade-in">
                        <ToDoList disableWrapper={true} />
                        {/* Note: disableWrapper could be a future prop to remove Top margin since we are inside a tab */}
                    </div>
                )}

                {activeTab === 'community' && (
                    <div className="tab-pane active fade-in glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                        <MessageCircle size={40} style={{ color: 'var(--ocean-light)', marginBottom: '1rem' }} />
                        <h3>Comunidade & Chat</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Compartilhe suas vitórias e converse com outros guardiões do oceano. (Em Breve)</p>
                    </div>
                )}

                {activeTab === 'stats' && (
                    <div className="tab-pane active fade-in">
                        <ProgressCharts />
                    </div>
                )}
            </div>
        </div>
        </div>
    );
};

export default AquariumView;
