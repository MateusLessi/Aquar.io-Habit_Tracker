import React, { useState } from 'react';
import { useHabits } from '../../context/HabitContext';
import { X, CheckSquare, Hash, Clock } from 'lucide-react';
import { CREATURE_TYPES } from '../../constants/aquario';
import './AddHabitModal.css';

const AddHabitModal = ({ isOpen, onClose }) => {
    const { addHabit } = useHabits();
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Health');
    const [frequencyType, setFrequencyType] = useState('simple'); // 'simple', 'counter', 'timer'
    const [counterGoal, setCounterGoal] = useState(3);
    const [timerDuration, setTimerDuration] = useState(15); // in minutes

    const selectedCreature = CREATURE_TYPES[category] || CREATURE_TYPES['Health'];

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        const newHabit = {
            name: name.trim(),
            category,
            creatureType: selectedCreature.id,
            frequencyType,
        };

        if (frequencyType === 'counter') {
            newHabit.counterGoal = Number(counterGoal);
        } else if (frequencyType === 'timer') {
            newHabit.timerDuration = Number(timerDuration) * 60; // save as seconds
        }

        addHabit(newHabit);

        setName('');
        setCategory('Health');
        setFrequencyType('simple');
        setCounterGoal(3);
        setTimerDuration(15);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-panel">
                <div className="modal-header">
                    <h3>Add New Habit</h3>
                    <button className="icon-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="habitName">Habit Name</label>
                        <input
                            type="text"
                            id="habitName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Drink Water"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Habit Type</label>
                        <div className="type-selector">
                            <button 
                                type="button" 
                                className={`type-btn ${frequencyType === 'simple' ? 'active' : ''}`}
                                onClick={() => setFrequencyType('simple')}
                            >
                                <CheckSquare size={18} /> Simple
                            </button>
                            <button 
                                type="button" 
                                className={`type-btn ${frequencyType === 'counter' ? 'active' : ''}`}
                                onClick={() => setFrequencyType('counter')}
                            >
                                <Hash size={18} /> Counter
                            </button>
                            <button 
                                type="button" 
                                className={`type-btn ${frequencyType === 'timer' ? 'active' : ''}`}
                                onClick={() => setFrequencyType('timer')}
                            >
                                <Clock size={18} /> Timer
                            </button>
                        </div>
                    </div>

                    {frequencyType === 'counter' && (
                        <div className="form-group">
                            <label htmlFor="counterGoal">Daily Goal (times)</label>
                            <input
                                type="number"
                                id="counterGoal"
                                value={counterGoal}
                                onChange={(e) => setCounterGoal(e.target.value)}
                                min="1"
                                required
                            />
                        </div>
                    )}

                    {frequencyType === 'timer' && (
                        <div className="form-group">
                            <label htmlFor="timerDuration">Duration (minutes)</label>
                            <input
                                type="number"
                                id="timerDuration"
                                value={timerDuration}
                                onChange={(e) => setTimerDuration(e.target.value)}
                                min="1"
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="habitCat">Category / Creature</label>
                        <select
                            id="habitCat"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            {Object.entries(CREATURE_TYPES).map(([key, creature]) => (
                                <option key={key} value={key}>
                                    {key} {creature.emoji}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="creature-preview" style={{
                        marginTop: '1rem', 
                        padding: '1rem', 
                        background: 'rgba(255,255,255,0.05)', 
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px'
                    }}>
                        <div style={{ fontSize: '2.5rem' }}>{selectedCreature.eggEmoji}</div>
                        <div>
                            <div style={{ fontWeight: 'bold' }}>Feeds: {selectedCreature.name}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{selectedCreature.description}</div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-marine" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-marine-primary">Add Habit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddHabitModal;
