import React, { useState } from 'react';
import { useTodos } from '../../context/TodoContext';
import { Sun, Star, Calendar as CalendarIcon, List, Plus, Trash2, Check } from 'lucide-react';
import SwipeableItem from '../common/SwipeableItem';
import './ToDoList.css';

const SIDEBAR_LISTS = [
    { id: 'My Day', icon: <Sun size={20} />, color: '#FDCB6E' },
    { id: 'Important', icon: <Star size={20} />, color: '#FF6B6B' },
    { id: 'Planned', icon: <CalendarIcon size={20} />, color: '#1DD1A1' },
    { id: 'Tasks', icon: <List size={20} />, color: '#64FFDA' },
];

const ToDoList = () => {
    const { todos, addTodo, toggleTodo, toggleImportant, deleteTodo } = useTodos();
    const [activeList, setActiveList] = useState('My Day');
    const [newTaskTitle, setNewTaskTitle] = useState('');

    // Filter based on active list
    const filteredTodos = todos.filter(todo => {
        if (activeList === 'Important') return todo.isImportant;
        return todo.list === activeList;
    });

    const handleAddSubmit = (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        addTodo({
            title: newTaskTitle.trim(),
            list: activeList === 'Important' ? 'Tasks' : activeList, // Don't add directly to 'Important' list name
            isImportant: activeList === 'Important',
        });
        setNewTaskTitle('');
    };

    return (
        <div className="todo-container glass-panel">

            {/* Todo Sidebar */}
            <aside className="todo-sidebar">
                <ul className="todo-lists-menu">
                    {SIDEBAR_LISTS.map(list => (
                        <li key={list.id}>
                            <button
                                className={`todo-list-btn ${activeList === list.id ? 'active' : ''}`}
                                onClick={() => setActiveList(list.id)}
                            >
                                <span style={{ color: list.color }}>{list.icon}</span>
                                <span>{list.id}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Todo Main Area */}
            <section className="todo-main">
                <div className="todo-header">
                    <h2>{activeList}</h2>
                    <span className="todo-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                </div>

                <div className="todo-list">
                    {filteredTodos.map(todo => (
                        <div key={todo.id} className="todo-item-wrapper" style={{ marginBottom: '0.8rem' }}>
                            <SwipeableItem
                                onSwipeRight={() => toggleTodo(todo.id)}
                                onSwipeLeft={() => deleteTodo(todo.id)}
                                leftIcon={<Trash2 size={24} />}
                                rightIcon={<Check size={24} />}
                                leftBgColor="#FF6B6B"
                                rightBgColor="#1DD1A1"
                            >
                                <div className="todo-item" style={{ margin: 0 }}>
                                    <button
                                        className={`todo-checkbox ${todo.isCompleted ? 'checked' : ''}`}
                                        onClick={() => toggleTodo(todo.id)}
                                    >
                                        {todo.isCompleted && <span className="checkmark">✓</span>}
                                    </button>

                                    <span className={`todo-title ${todo.isCompleted ? 'completed-text' : ''}`}>
                                        {todo.title}
                                    </span>

                                    <div className="todo-actions">
                                        <button
                                            className={`todo-star-btn ${todo.isImportant ? 'starred' : ''}`}
                                            onClick={() => toggleImportant(todo.id)}
                                        >
                                            <Star size={20} fill={todo.isImportant ? "currentColor" : "none"} />
                                        </button>
                                        <button className="todo-delete-btn" onClick={() => deleteTodo(todo.id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </SwipeableItem>
                        </div>
                    ))}
                </div>

                {/* Add Todo Input */}
                <form className="add-todo-form" onSubmit={handleAddSubmit}>
                    <button type="submit" className="add-todo-btn" disabled={!newTaskTitle.trim()}>
                        <Plus size={24} />
                    </button>
                    <input
                        type="text"
                        placeholder="Add a task"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                    />
                </form>
            </section>

        </div>
    );
};

export default ToDoList;
