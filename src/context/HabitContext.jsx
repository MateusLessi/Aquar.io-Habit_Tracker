import React, { createContext, useContext, useState, useEffect } from 'react';

const HabitContext = createContext();

export const useHabits = () => useContext(HabitContext);

export const HabitProvider = ({ children }) => {
    const [habits, setHabits] = useState([
        { id: '1', name: 'Drink Water', category: 'Health', creatureType: 'turtle', frequencyType: 'counter', counterGoal: 3, currentProgress: 1, status: 'todo', streak: 5, dateAdded: new Date().toISOString() },
        { id: '2', name: 'Read 10 Pages', category: 'Study', creatureType: 'octopus', frequencyType: 'timer', timerDuration: 600, currentProgress: 600, status: 'done', streak: 12, dateAdded: new Date().toISOString() },
        { id: '3', name: 'Meditate', category: 'Mindfulness', creatureType: 'jellyfish', frequencyType: 'timer', timerDuration: 300, currentProgress: 0, status: 'postponed', streak: 0, dateAdded: new Date().toISOString() },
    ]);

    const updateHabitStatus = (habitId, newStatus) => {
        setHabits(prevHabits =>
            prevHabits.map(habit => {
                if (habit.id === habitId) {
                    // Simplistic streak logic for now: increment if done, reset if failed.
                    let newStreak = habit.streak;
                    if (newStatus === 'done' && habit.status !== 'done') {
                        newStreak += 1;
                    } else if (newStatus === 'failed') {
                        newStreak = 0;
                    }
                    return { ...habit, status: newStatus, streak: newStreak };
                }
                return habit;
            })
        );
    };

    const updateHabitProgress = (habitId, newProgress) => {
        setHabits(prevHabits => 
            prevHabits.map(habit => {
                if (habit.id === habitId) {
                    let newStatus = habit.status;
                    let newStreak = habit.streak;
                    
                    // Auto-complete if goal reached
                    if (habit.frequencyType === 'counter' && newProgress >= habit.counterGoal && habit.status !== 'done') {
                        newStatus = 'done';
                        newStreak += 1;
                    } else if (habit.frequencyType === 'timer' && newProgress >= habit.timerDuration && habit.status !== 'done') {
                        newStatus = 'done';
                        newStreak += 1;
                    }

                    return { ...habit, currentProgress: newProgress, status: newStatus, streak: newStreak };
                }
                return habit;
            })
        );
    };

    const addHabit = (newHabit) => {
        setHabits([...habits, { 
            ...newHabit, 
            id: Date.now().toString(), 
            status: 'todo', 
            streak: 0,
            currentProgress: 0,
            dateAdded: new Date().toISOString()
        }]);
    };

    return (
        <HabitContext.Provider value={{ habits, updateHabitStatus, updateHabitProgress, addHabit }}>
            {children}
        </HabitContext.Provider>
    );
};
