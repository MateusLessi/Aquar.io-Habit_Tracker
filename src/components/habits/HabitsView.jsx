import React, { useState } from 'react';
import { ClipboardList, List } from 'lucide-react';
import HabitBoard from './HabitBoard';
import './HabitsView.css';

const HabitsView = () => {
    const [activeTab, setActiveTab] = useState('hoje');

    return (
        <div className="habits-view-container">
            {/* Top Tabs */}
            <div className="habits-tabs-wrapper">
                <div className="habits-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'hoje' ? 'active' : ''}`}
                        onClick={() => setActiveTab('hoje')}
                    >
                        Hoje
                    </button>
                    <button
                        className={`tab-btn icon-tab ${activeTab === 'clipboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('clipboard')}
                    >
                        <ClipboardList size={20} />
                    </button>
                    <button
                        className={`tab-btn icon-tab ${activeTab === 'list' ? 'active' : ''}`}
                        onClick={() => setActiveTab('list')}
                    >
                        <List size={20} />
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="habits-content">
                {activeTab === 'hoje' && (
                    <div className="tab-pane active fade-in">
                        <HabitBoard filter="hoje" />
                    </div>
                )}
                {activeTab === 'clipboard' && (
                    <div className="tab-pane active fade-in glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                        <ClipboardList size={40} style={{ color: 'var(--ocean-light)', marginBottom: '1rem' }} />
                        <h3>Desafios e Projetos</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Esta área será dedicada a hábitos agrupados por projetos maiores.</p>
                    </div>
                )}
                {activeTab === 'list' && (
                    <div className="tab-pane active fade-in glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                        <List size={40} style={{ color: 'var(--ocean-light)', marginBottom: '1rem' }} />
                        <h3>Todos os Hábitos</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Lista consolidada de todos os seus hábitos sem divisões de colunas.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HabitsView;
