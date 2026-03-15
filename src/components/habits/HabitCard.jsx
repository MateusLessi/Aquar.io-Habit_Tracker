import React, { useState, useEffect, useRef } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Flame, Calendar, Tag, Check, X, GripVertical, Clock, RotateCcw, Plus, Play, Pause } from 'lucide-react';
import { useHabits } from '../../context/HabitContext';
import { CREATURE_TYPES, getCreatureStage } from '../../constants/aquario';
import SwipeableItem from '../common/SwipeableItem';
import './HabitBoard.css';

const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const HabitCard = ({ habit, index }) => {
    const { updateHabitStatus, updateHabitProgress } = useHabits();
    // Timer State
    const [isPlaying, setIsPlaying] = useState(false);
    const [localProgress, setLocalProgress] = useState(habit.currentProgress);
    const timerIntervalRef = useRef(null);
    
    // Refs for unmount sync
    const isPlayingRef = useRef(isPlaying);
    const localProgressRef = useRef(localProgress);
    
    // Find the creature definition based on the type assigned at creation
    const creatureInfo = Object.values(CREATURE_TYPES).find(c => c.id === habit.creatureType) || CREATURE_TYPES['Health'];
    const creatureStage = getCreatureStage(habit.streak);
    
    useEffect(() => {
        isPlayingRef.current = isPlaying;
        localProgressRef.current = localProgress;
    }, [isPlaying, localProgress]);

    // Unmount cleanup: sync to context if timer was running
    useEffect(() => {
        return () => {
            if (isPlayingRef.current) {
                updateHabitProgress(habit.id, localProgressRef.current);
            }
        };
    }, [habit.id, updateHabitProgress]);

    // Sync local progress if global context changes (e.g., loaded from save)
    useEffect(() => {
        if (!isPlaying) {
            setLocalProgress(habit.currentProgress);
        }
    }, [habit.currentProgress, isPlaying]);

    useEffect(() => {
        if (isPlaying) {
            timerIntervalRef.current = setInterval(() => {
                setLocalProgress(prev => {
                    const next = prev + 1;
                    if (next >= habit.timerDuration) {
                        setIsPlaying(false);
                        updateHabitProgress(habit.id, next); // Sync to context when finished
                        return next;
                    }
                    return next;
                });
            }, 1000);
        } else {
            clearInterval(timerIntervalRef.current);
        }
        return () => clearInterval(timerIntervalRef.current);
    }, [isPlaying, habit.timerDuration, habit.id, updateHabitProgress]);

    const handleIncrementCounter = () => {
        if (habit.currentProgress < habit.counterGoal) {
            updateHabitProgress(habit.id, habit.currentProgress + 1);
        }
    };

    const toggleTimer = () => {
        if (localProgress < habit.timerDuration) {
            if (isPlaying) {
                // Pausing: sync progress back to global context
                updateHabitProgress(habit.id, localProgress);
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleSwipeRight = () => {
        updateHabitStatus(habit.id, 'done');
    };

    const handleSwipeTopRight = () => {
        updateHabitStatus(habit.id, 'todo');
    };

    const handleSwipeLeft = () => {
        updateHabitStatus(habit.id, 'failed');
    };

    return (
        <Draggable draggableId={habit.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={{ ...provided.draggableProps.style, padding: 0, border: 'none', background: 'transparent' }}
                    className={`habit-card-wrapper ${snapshot.isDragging ? 'is-dragging' : ''}`}
                >
                    <SwipeableItem
                        onSwipeRight={handleSwipeRight}
                        onSwipeTopRight={handleSwipeTopRight}
                        onSwipeLeft={handleSwipeLeft}
                        leftIcon={<X size={24} />}
                        rightIcon={<Check size={24} />}
                        topRightIcon={<RotateCcw size={24} />}
                        leftBgColor="#FF6B6B" // Red to Fail
                        rightBgColor="#1DD1A1" // Green to Complete
                    >
                        <div className={`habit-card status-${habit.status}`}>
                            <div className="habit-content-area" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '15px' }}>
                                
                                {/* Left Side: Text and Tracking */}
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div className="habit-card-header" style={{ marginBottom: '15px' }}>
                                        <h4>{habit.name}</h4>
                                        <span className="habit-streak"><Flame size={14} /> {habit.streak}</span>
                                    </div>
                                    
                                    {/* Inline Progress Bar */}
                                    {habit.status !== 'done' && habit.frequencyType === 'counter' && (
                                        <div className="progress-inline-container">
                                            <span style={{ fontSize: '1.2rem' }}>+ 1</span>
                                            <span style={{ opacity: 0.8, fontSize: '0.9rem', fontWeight: '400' }}>{habit.currentProgress} / {habit.counterGoal} vezes</span>
                                        </div>
                                    )}

                                    {habit.status !== 'done' && habit.frequencyType === 'timer' && (
                                        <div className="progress-inline-container">
                                            <span style={{ fontSize: '1.1rem' }}>{formatTime(localProgress)}</span>
                                            <span style={{ opacity: 0.8, fontSize: '0.9rem', fontWeight: '400' }}>/ {formatTime(habit.timerDuration)} min</span>
                                        </div>
                                    )}

                                    {/* Creature Signature */}
                                    <div className="habit-creature-info" style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '6px',
                                        fontSize: '0.8rem',
                                        color: 'rgba(255,255,255,0.6)',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        padding: '4px 10px',
                                        borderRadius: '12px',
                                        width: 'fit-content',
                                        fontWeight: '500'
                                    }}>
                                        <span>{creatureInfo.emoji}</span>
                                        <span style={{ color: creatureInfo.color }}>{habit.creatureName || creatureInfo.name}</span>
                                        <span style={{ margin: '0 2px', opacity: 0.3 }}>|</span>
                                        <span>{creatureStage.icon} {creatureStage.stage}</span>
                                    </div>
                                </div>

                                {/* Right Side: Massive Glowing Action Button */}
                                {habit.status !== 'done' && habit.frequencyType === 'counter' && (
                                    <button 
                                        className="glowing-circle-btn" 
                                        onClick={handleIncrementCounter}
                                        onPointerDown={(e) => e.stopPropagation()}
                                    >
                                        <Plus size={32} strokeWidth={2.5} />
                                    </button>
                                )}

                                {habit.status !== 'done' && habit.frequencyType === 'timer' && (
                                    <button 
                                        className="glowing-circle-btn" 
                                        onClick={toggleTimer}
                                        onPointerDown={(e) => e.stopPropagation()}
                                        style={{ 
                                            borderColor: isPlaying ? 'rgba(255, 107, 107, 0.6)' : 'rgba(100, 255, 218, 0.6)',
                                            background: isPlaying ? 'radial-gradient(circle at 30% 30%, rgba(255, 107, 107, 0.2), transparent)' : '',
                                            boxShadow: isPlaying ? '0 0 20px rgba(255, 107, 107, 0.4), inset 0 0 10px rgba(255, 107, 107, 0.2)' : ''
                                        }}
                                    >
                                        {isPlaying ? <Pause size={28} color="#FF6B6B" /> : <Play size={28} />}
                                    </button>
                                )}
                            </div>

                            {/* Drag Handle Icon - vertical drag only unlocked here */}
                            <div
                                {...provided.dragHandleProps}
                                className="drag-handle-zone"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5, padding: '0 5px', cursor: 'grab' }}
                                onPointerDown={(e) => e.stopPropagation()}
                            >
                                <GripVertical size={20} />
                            </div>
                        </div>
                    </SwipeableItem>
                </div>
            )}
        </Draggable>
    );
};

export default HabitCard;
