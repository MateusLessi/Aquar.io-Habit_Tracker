import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, CheckSquare, Droplet } from 'lucide-react';
import './FloatingActionButton.css';

const FloatingActionButton = ({ onAddHabit, onAddTodo }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return createPortal(
        <div className={`fab-container ${isOpen ? 'open' : ''}`}>
            {/* Speed Dial Menu */}
            <div className="fab-menu">
                <button
                    className="fab-item"
                    onClick={() => { onAddHabit(); setIsOpen(false); }}
                >
                    <span className="fab-label">Novo Hábito</span>
                    <div className="fab-icon-wrapper">
                        <Droplet size={20} />
                    </div>
                </button>
                <button
                    className="fab-item"
                    onClick={() => { onAddTodo(); setIsOpen(false); }}
                >
                    <span className="fab-label">Nova Tarefa</span>
                    <div className="fab-icon-wrapper">
                        <CheckSquare size={20} />
                    </div>
                </button>
            </div>

            {/* Main FAB */}
            <button className="fab-main" onClick={toggleOpen}>
                <Plus size={32} />
            </button>
        </div>,
        document.body
    );
};

export default FloatingActionButton;
