import React, { createContext, useContext, useState } from 'react';

const TodoContext = createContext();

export const useTodos = () => useContext(TodoContext);

export const TodoProvider = ({ children }) => {
    const [todos, setTodos] = useState([
        { id: 't1', title: 'Buy groceries', isImportant: false, isCompleted: false, list: 'My Day', dateAdded: new Date().toISOString() },
        { id: 't2', title: 'Finish Phase 4', isImportant: true, isCompleted: false, list: 'Tasks', dateAdded: new Date().toISOString() },
        { id: 't3', title: 'Check emails', isImportant: false, isCompleted: true, list: 'Tasks', dateAdded: new Date().toISOString() },
    ]);

    const addTodo = (newTodo) => {
        setTodos([
            ...todos,
            { ...newTodo, id: Date.now().toString(), isCompleted: false, dateAdded: new Date().toISOString() }
        ]);
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
    };

    const toggleImportant = (id) => {
        setTodos(todos.map(t => t.id === id ? { ...t, isImportant: !t.isImportant } : t));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(t => t.id !== id));
    };

    return (
        <TodoContext.Provider value={{ todos, addTodo, toggleTodo, toggleImportant, deleteTodo }}>
            {children}
        </TodoContext.Provider>
    );
};
