import React from 'react';
import { useHabits } from '../../context/HabitContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import './ProgressCharts.css';

const COLORS = ['#1DD1A1', '#FF9F43', '#FF6B6B', '#64FFDA', '#00ACC1'];

const ProgressCharts = () => {
    const { habits } = useHabits();

    // Prepare data for Pie Chart (Habits per Category)
    const categoryCount = habits.reduce((acc, habit) => {
        acc[habit.category] = (acc[habit.category] || 0) + 1;
        return acc;
    }, {});

    const pieData = Object.keys(categoryCount).map(key => ({
        name: key,
        value: categoryCount[key]
    }));

    // Mock data for Line Chart (Weekly Streak Progress)
    const mockLineData = [
        { name: 'Mon', completion: Math.floor(Math.random() * 5) + 1 },
        { name: 'Tue', completion: Math.floor(Math.random() * 5) + 2 },
        { name: 'Wed', completion: Math.floor(Math.random() * 5) + 3 },
        { name: 'Thu', completion: Math.floor(Math.random() * 5) + 2 },
        { name: 'Fri', completion: Math.floor(Math.random() * 5) + 4 },
        { name: 'Sat', completion: Math.floor(Math.random() * 5) + 5 },
        { name: 'Sun', completion: Math.floor(Math.random() * 5) + 6 },
    ];

    return (
        <div className="analytics-container">
            <div className="charts-grid">

                {/* Habit Completion Trend */}
                <div className="chart-card glass-panel">
                    <h3>Weekly Habit Flow</h3>
                    <p className="chart-desc">Your overall habit completion trend over the last 7 days.</p>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={mockLineData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="#8892B0" />
                                <YAxis stroke="#8892B0" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(17, 34, 64, 0.9)', borderColor: '#64FFDA', color: '#fff' }}
                                    itemStyle={{ color: '#64FFDA' }}
                                />
                                <Line type="monotone" dataKey="completion" stroke="#64FFDA" strokeWidth={3} dot={{ fill: '#64FFDA', strokeWidth: 2, r: 6 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="chart-card glass-panel">
                    <h3>Habit Categories</h3>
                    <p className="chart-desc">Distribution of your active habits across different areas.</p>
                    <div style={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center' }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(17, 34, 64, 0.9)', borderColor: '#1DD1A1', color: '#fff' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            <div className="table-card glass-panel">
                <h3>Habit Historical Log</h3>
                <table className="marine-table">
                    <thead>
                        <tr>
                            <th>Habit</th>
                            <th>Category</th>
                            <th>Current Streak</th>
                            <th>Status</th>
                            <th>Date Added</th>
                        </tr>
                    </thead>
                    <tbody>
                        {habits.map(habit => (
                            <tr key={habit.id}>
                                <td>{habit.name}</td>
                                <td><span className={`category-badge ${habit.category.toLowerCase()}`}>{habit.category}</span></td>
                                <td>🔥 {habit.streak}</td>
                                <td><span className={`status-text ${habit.status}`}>{habit.status.toUpperCase()}</span></td>
                                <td>{new Date(habit.dateAdded).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default ProgressCharts;
