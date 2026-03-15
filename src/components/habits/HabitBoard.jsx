import React, { useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useHabits } from '../../context/HabitContext';
import HabitCard from './HabitCard';
import './HabitBoard.css';

const COLUMNS = [
    { id: 'todo', title: 'Hoje', color: 'var(--status-todo)' },
    { id: 'done', title: 'Done', color: 'var(--status-done)' },
    { id: 'failed', title: 'Failed', color: 'var(--status-failed)' }
];

const HabitBoard = () => {
    const { habits, updateHabitStatus } = useHabits();

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        // The destination droppableId maps exactly to the new status
        const newStatus = destination.droppableId;
        updateHabitStatus(draggableId, newStatus);
    };

    return (
        <div className="habit-board-container">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="habit-board">
                    {COLUMNS.map(column => {
                        let columnHabits = habits.filter(h => h.status === column.id);

                        if (column.id === 'todo') {
                            const order = { morning: 1, afternoon: 2, night: 3, any: 4 };
                            columnHabits.sort((a, b) => (order[a.timeOfDay || 'any'] || 4) - (order[b.timeOfDay || 'any'] || 4));
                        }

                        // Condition: only show 'todo', or if column has habits. Never show empty done/failed/postponed just for dragging.
                        if (column.id !== 'todo' && columnHabits.length === 0) {
                            return null;
                        }

                        return (
                            <div key={column.id} className="habit-column-wrapper">
                                <div className="habit-column-header" style={{ borderBottomColor: column.color }}>
                                    <h3>{column.title}</h3>
                                    <span className="count-badge">{columnHabits.length}</span>
                                </div>

                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`habit-column ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
                                        >
                                            {columnHabits.map((habit, index) => {
                                                const prevTime = index > 0 ? (columnHabits[index - 1].timeOfDay || 'any') : null;
                                                const currTime = habit.timeOfDay || 'any';
                                                const showHeader = column.id === 'todo' && prevTime !== currTime;

                                                const TURNOS = {
                                                    morning: '☀️ Manhã',
                                                    afternoon: '🌤️ Tarde',
                                                    night: '🌙 Noite',
                                                    any: '🌞 Qualquer hora'
                                                };

                                                return (
                                                    <React.Fragment key={habit.id}>
                                                        {showHeader && (
                                                            <div className="turno-divider">
                                                                {TURNOS[currTime]}
                                                            </div>
                                                        )}
                                                        <HabitCard habit={habit} index={index} />
                                                    </React.Fragment>
                                                );
                                            })}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        );
                    })}
                </div>
            </DragDropContext>
        </div>
    );
};

export default HabitBoard;
