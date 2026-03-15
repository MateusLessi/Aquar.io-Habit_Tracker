import React from 'react';
import { useHabits } from '../../context/HabitContext';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CREATURE_TYPES } from '../../constants/aquario';
import './DashboardWidgets.css';

const COLORS = ['#1DD1A1', '#FF9F43', '#FF6B6B', '#64FFDA', '#00ACC1'];

export const AnalyticsWidget = () => {
    const { habits } = useHabits();

    // Count by Creature Type now instead of Category
    const creatureCount = habits.reduce((acc, habit) => {
        const type = habit.creatureType || 'turtle'; // Fallback for old data
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    const pieData = Object.keys(creatureCount).map(key => ({
        name: key, // name is now the creature id (e.g. 'turtle')
        value: creatureCount[key]
    }));

    const totalStreak = habits.reduce((acc, habit) => acc + habit.streak, 0);

    return (
        <div className="dashboard-widget glass-panel analytics-widget">
            <div className="widget-header">
                <h3>Ecossistema Atual</h3>
                <div className="streak-badge" title="Total Ecosystem Age">🌊 {totalStreak} Anos</div>
            </div>

            <div className="widget-analytics-content">
                <div className="analytics-chart-mini">
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={120}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={30}
                                    outerRadius={50}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="empty-text">Sem dados</p>
                    )}
                </div>
                <div className="analytics-legend-mini">
                    {pieData.map((entry, index) => {
                        const creature = Object.values(CREATURE_TYPES).find(c => c.id === entry.name) || CREATURE_TYPES['Health'];
                        return (
                            <div key={entry.name} className="legend-item" style={{ marginBottom: '4px' }}>
                                <span className="legend-icon" style={{ marginRight: '8px' }}>{creature.emoji}</span>
                                <span className="legend-name" style={{ fontSize: '0.85rem' }}>{creature.name} ({entry.value})</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
