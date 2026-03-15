import React, { useState } from 'react';
import { useTodos } from '../../context/TodoContext';
import { Plus, Check, Circle, Trash2 } from 'lucide-react';
import SwipeableItem from '../common/SwipeableItem';
import './DashboardWidgets.css';

export const ToDoWidget = () => {
    const { todos, addTodo, toggleTodo } = useTodos();
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const myDayTodos = todos.filter(todo => todo.list === 'My Day');

    const handleAddSubmit = (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        addTodo({
            title: newTaskTitle.trim(),
            list: 'My Day',
            isImportant: false,
        });
        setNewTaskTitle('');
    };

    return (
        <div className="dashboard-widget glass-panel">
            <div className="widget-header">
                <h3>Meu Dia (To-Do)</h3>
                <span className="count-badge">{myDayTodos.filter(t => !t.isCompleted).length} restam</span>
            </div>
            <div className="widget-todo-list">
                {myDayTodos.slice(0, 5).map(todo => (
                    <div key={todo.id} className="widget-todo-item-wrapper">
                        <SwipeableItem
                            onSwipeRight={() => toggleTodo(todo.id)}
                            onSwipeLeft={() => deleteTodo(todo.id)}
                            leftIcon={<Trash2 size={24} />}
                            rightIcon={<Check size={24} />}
                            leftBgColor="#FF6B6B"
                            rightBgColor="#1DD1A1"
                        >
                            <div className="widget-todo-item" onClick={() => toggleTodo(todo.id)}>
                                {todo.isCompleted ? <Check size={18} color="var(--status-done)" /> : <Circle size={18} color="var(--text-secondary)" />}
                                <span className={todo.isCompleted ? 'completed-text' : ''}>{todo.title}</span>
                            </div>
                        </SwipeableItem>
                    </div>
                ))}
            </div>
            <form className="widget-add-todo" onSubmit={handleAddSubmit}>
                <Plus size={18} />
                <input
                    type="text"
                    placeholder="Adicionar tarefa rápida..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                />
            </form>
        </div>
    );
};
