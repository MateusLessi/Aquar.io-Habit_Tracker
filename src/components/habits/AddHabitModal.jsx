import React, { useState } from 'react';
import { useHabits } from '../../context/HabitContext';
import { X } from 'lucide-react';
import { CREATURE_TYPES } from '../../constants/aquario';
import './AddHabitModal.css';

const AddHabitModal = ({ isOpen, onClose }) => {
    const { addHabit } = useHabits();
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Health'); // Default aligns with key in CREATURE_TYPES

    const selectedCreature = CREATURE_TYPES[category] || CREATURE_TYPES['Health'];

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        addHabit({
            name: name.trim(),
            category,
            creatureType: selectedCreature.id,
        });

        setName('');
        setCategory('Health');
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
