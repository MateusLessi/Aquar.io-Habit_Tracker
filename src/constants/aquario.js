// src/constants/aquario.js

export const CREATURE_TYPES = {
    Health: {
        id: 'turtle',
        name: 'Turtle',
        emoji: '🐢',
        eggEmoji: '🥚',
        color: 'var(--seaweed-green)',
        description: 'Represents longevity and steady pace.'
    },
    Study: {
        id: 'octopus',
        name: 'Octopus',
        emoji: '🐙',
        eggEmoji: '🥚',
        color: 'var(--ocean-accent)',
        description: 'Represents intelligence and focus.'
    },
    Work: {
        id: 'shark',
        name: 'Shark',
        emoji: '🦈',
        eggEmoji: '🥚',
        color: 'var(--text-secondary)',
        description: 'Represents energy and constant movement.'
    },
    Mindfulness: {
        id: 'jellyfish',
        name: 'Jellyfish',
        emoji: '🪼',
        eggEmoji: '🥚',
        color: 'var(--coral-orange)', // Adjust for magical vibe
        description: 'Represents flow and calmness.'
    },
    Social: {
        id: 'dolphin',
        name: 'Dolphin',
        emoji: '🐬',
        eggEmoji: '🥚',
        color: 'var(--ocean-light)',
        description: 'Represents connection and playfulness.'
    },
    Organization: {
        id: 'crab',
        name: 'Crab',
        emoji: '🦀',
        eggEmoji: '🥚',
        color: 'var(--coral-red)',
        description: 'Represents structure and foundation.'
    },
    Hobby: {
        id: 'fish',
        name: 'Clownfish',
        emoji: '🐠',
        eggEmoji: '🥚',
        color: 'var(--sand-yellow)',
        description: 'Represents creativity and joy.'
    }
};

export const getCreatureStage = (streak) => {
    if (streak < 3) return { stage: 'Egg', icon: '🥚' };
    if (streak < 7) return { stage: 'Baby', icon: '🐣' };
    if (streak < 15) return { stage: 'Young', icon: '🐟' };
    if (streak < 30) return { stage: 'Adult', icon: '🦈' };
    return { stage: 'Legendary', icon: '🐉' };
};
