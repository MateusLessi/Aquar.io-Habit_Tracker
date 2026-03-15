import React from 'react';
import { useMarineEngine } from '../../context/MarineEngineContext';
import './MarineView.css';

const MarineView = () => {
    const { aquariumCreatures, ANIMAL_STAGES } = useMarineEngine();

    // Determine aquarium theme based on overall streak or count.
    // For now, static shallow-waters theme.

    return (
        <div className="marine-view-container glass-panel" data-theme="shallow-waters">
            <div className="aquarium-header">
                <h3>My Aquarium</h3>
                <span className="creature-count">{aquariumCreatures.length} Residents</span>
            </div>

            <div className="aquarium-tank">
                {/* Render each creature inside the tank */}
                {aquariumCreatures.map((creature, index) => (
                    <div
                        key={creature.id}
                        className={`creature-wrapper stage-${creature.stage.toLowerCase()}`}
                        style={{
                            animationDelay: `${index * 0.5}s`,
                            // Spread them around roughly
                            left: `${10 + (index * 25) % 80}%`,
                            top: `${20 + (index * 15) % 60}%`
                        }}
                    >
                        <div className="creature-icon">{creature.icon}</div>
                        <div className="creature-info-bubble">
                            <span className="creature-name">{creature.animalType}</span>
                            <span className="creature-habit">{creature.habitName}</span>
                            <span className="creature-streak">🔥 {creature.streak}</span>
                        </div>
                    </div>
                ))}

                {/* Decorative elements */}
                <div className="seaweed sl-1">🌿</div>
                <div className="seaweed sl-2">🌿</div>
                <div className="bubbles">
                    <div className="bubble"></div>
                    <div className="bubble"></div>
                    <div className="bubble"></div>
                </div>
            </div>
        </div>
    );
};

export default MarineView;
