import React, { useRef } from 'react';
import { useMarineEngine } from '../../context/MarineEngineContext';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import './MarineView.css';

// Isometric Grid
const IsometricGrid = () => {
    return (
        <gridHelper args={[20, 20, '#1DD1A1', 'rgba(29, 209, 161, 0.2)']} position={[0, -0.5, 0]} />
    );
};

// Simple placeholder entity representing our fish/turtles
const MarineEntity = ({ type, position, color }) => {
    const meshRef = useRef();

    useFrame((state) => {
        if (!meshRef.current) return;
        // Simple swimming animation
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.2;
    });

    let GeoArgs = [0.5, 16, 16]; // sphere
    if (type === 'shark' || type === 'whale') GeoArgs = [1, 32, 32];
    if (type === 'crab') GeoArgs = [0.4, 0.4, 0.4]; // box for crab

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={meshRef} position={position}>
                {type === 'crab' ? <boxGeometry args={GeoArgs} /> : <sphereGeometry args={GeoArgs} />}
                <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
            </mesh>
        </Float>
    );
};

const MarineView3D = () => {
    const { aquariumCreatures, theme } = useMarineEngine();

    // Map themes to background light colors
    const ambientColor = theme === 'deep-sea' ? '#0a192f' : '#64FFDA';

    // Spread animals somewhat randomly on the grid
    const spreadAnimals = aquariumCreatures.map((creature, i) => {
        // pseudo-random but stable positioning
        const x = (i * 2.5) % 8 - 4;
        const z = (i * 1.5) % 8 - 4;
        const y = creature.type === 'crab' ? -0.2 : Math.random() * 2 + 0.5;

        // map status color
        let color = '#fff';
        if (creature.type === 'turtle') color = '#1DD1A1';
        if (creature.type === 'crab') color = '#FF6B6B';
        if (creature.type === 'fish') color = '#FF9F43';
        if (creature.type === 'shark') color = '#8892B0';
        if (creature.type === 'whale') color = '#64FFDA';

        return { ...creature, position: [x, y, z], color };
    });

    return (
        <div className="marine-background-3d">
            <Canvas camera={{ position: [8, 8, 8], fov: 40 }}>
                {/* Lighting to feel underwater */}
                <ambientLight intensity={0.6} color={ambientColor} />
                <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
                <pointLight position={[-5, 5, -5]} intensity={0.5} color="#1DD1A1" />

                {/* Environment */}
                <color attach="background" args={['#0a192f']} />
                {theme === 'deep-sea' && <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />}
                <fog attach="fog" args={['#0a192f', 5, 15]} />

                {/* The Isometric Ground */}
                <IsometricGrid />

                {/* Our Animals */}
                {spreadAnimals.map((animal) => (
                    <MarineEntity
                        key={animal.id}
                        type={animal.type}
                        color={animal.color}
                        position={animal.position}
                    />
                ))}

                {/* Controls - Limit rotation to keep it looking somewhat isometric */}
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2.5}
                />
            </Canvas>

        </div>
    );
};

export default MarineView3D;
