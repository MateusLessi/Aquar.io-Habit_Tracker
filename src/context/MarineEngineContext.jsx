import React, { createContext, useContext, useState, useEffect } from 'react';
import { useHabits } from './HabitContext';

const MarineEngineContext = createContext();

export const useMarineEngine = () => useContext(MarineEngineContext);

// Marine stages mapping
const ANIMAL_STAGES = {
    EGG: { name: 'Egg', minStreak: 0, icon: '🥚' },
    BABY: { name: 'Baby', minStreak: 3, icon: '🐣' }, // Will replace with marine specific
    JUVENILE: { name: 'Juvenile', minStreak: 7, icon: '🐟' },
    ADULT: { name: 'Adult', minStreak: 21, icon: '🦈' },
    ELDER: { name: 'Elder', minStreak: 50, icon: '🐋' }
};

export const MarineEngineProvider = ({ children }) => {
    const { habits } = useHabits();
    const [aquariumCreatures, setAquariumCreatures] = useState([]);

    useEffect(() => {
        // Map habits to creatures based on their streaks
        const creatures = habits.map(habit => {
            let stage = ANIMAL_STAGES.EGG;
            if (habit.streak >= ANIMAL_STAGES.ELDER.minStreak) stage = ANIMAL_STAGES.ELDER;
            else if (habit.streak >= ANIMAL_STAGES.ADULT.minStreak) stage = ANIMAL_STAGES.ADULT;
            else if (habit.streak >= ANIMAL_STAGES.JUVENILE.minStreak) stage = ANIMAL_STAGES.JUVENILE;
            else if (habit.streak >= ANIMAL_STAGES.BABY.minStreak) stage = ANIMAL_STAGES.BABY;

            // Assign an animal type based on category
            let animalType = 'Fish';
            if (habit.category === 'Health') animalType = 'Turtle 🐢';
            else if (habit.category === 'Study') animalType = 'Crab 🦀';
            else if (habit.category === 'Mindfulness') animalType = 'Jellyfish 🪼';

            return {
                id: `creature-${habit.id}`,
                habitId: habit.id,
                habitName: habit.name,
                animalType,
                stage: stage.name,
                icon: stage.icon,
                streak: habit.streak
            };
        });

        setAquariumCreatures(creatures);
    }, [habits]);

    return (
        <MarineEngineContext.Provider value={{ aquariumCreatures, ANIMAL_STAGES }}>
            {children}
        </MarineEngineContext.Provider>
    );
};
