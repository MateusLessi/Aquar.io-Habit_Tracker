import React, { useState } from 'react';
import Layout from './components/layout/Layout';
import ProgressCharts from './components/analytics/ProgressCharts';
import { ToDoWidget } from './components/dashboard/ToDoWidget';
import { AnalyticsWidget } from './components/dashboard/AnalyticsWidget';
import { useNavigation } from './context/NavigationContext';
import AquariumView from './components/aquarium/AquariumView';
import FloatingActionButton from './components/common/FloatingActionButton';
import HabitBoard from './components/habits/HabitBoard';
import CreateHabitPage from './components/habits/CreateHabitPage';

function App() {
    // isModalOpen removed, relying entirely on activeView routing for the create page
    const { activeView, setActiveView } = useNavigation();

    if (activeView === 'create-habit') {
        return <CreateHabitPage />;
    }

    return (
        <Layout>
            <div className="dashboard-content" style={{ paddingBottom: '2rem', position: 'relative', zIndex: 1 }}>

                {activeView === 'dashboard' && (
                    <>

                        <div style={{ marginTop: '0.5rem', marginBottom: '1rem', width: '100%' }}>
                            <h2 style={{ 
                                fontSize: '1.2rem', 
                                fontWeight: '400', 
                                color: 'rgba(255,255,255,0.9)', 
                                letterSpacing: '0.5px',
                                marginBottom: '1rem' 
                            }}>
                                Hábitos Diários
                            </h2>
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.2)', width: '100%', marginBottom: '1.5rem' }}></div>
                            
                            <HabitBoard />
                        </div>

                        <ToDoWidget />
                        <AnalyticsWidget />
                    </>
                )}

                {activeView === 'aquarium' && (
                    <AquariumView />
                )}

                {(activeView === 'store' || activeView === 'profile' || activeView === 'community') && (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 1rem', marginTop: '1rem' }}>
                        <span style={{ fontSize: '2.5rem' }}>🚧</span>
                        <h3 style={{ marginTop: '1rem', fontSize: '1.2rem' }}>Em Breve...</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            {activeView === 'store'
                                ? 'A Loja está sendo abastecida com novos peixes e decorações!'
                                : 'Seu perfil estendido e conquistas estarão aqui em breve!'}
                        </p>
                    </div>
                )}

            </div>

            {/* Global FAB */}
            <FloatingActionButton
                onAddHabit={() => setActiveView('create-habit')}
                onAddTodo={() => setActiveView('aquarium')} // Since ToDo is inside Aquarium now
            />
        </Layout>
    );
}

export default App;
