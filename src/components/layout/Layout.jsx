import React, { useState, useRef } from 'react';
import BottomNav from './BottomNav';
import MarineView3D from '../aquarium/MarineView3D';
import { useNavigation } from '../../context/NavigationContext';
import './Layout.css';

const Layout = ({ children }) => {
    const [isPeeking, setIsPeeking] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const startY = useRef(0);
    const { activeView } = useNavigation();

    const handleTouchStart = (e) => {
        // Only initiate dragging if the glass pane is scrolled all the way to the top
        const mainContent = document.querySelector('.marine-main-content');
        if (mainContent && mainContent.scrollTop > 5) return;
        
        startY.current = e.touches ? e.touches[0].clientY : e.clientY;
        setIsDragging(true);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const deltaY = clientY - startY.current;

        // Allow dragging in both directions, but add resistance
        // If peeking (down), dragging up is negative delta.
        // If open (up), dragging down is positive delta.
        if (isPeeking) {
            // Already down. Can drag up fully, or drag down slightly with high resistance
            if (deltaY < 0) {
                setDragOffset(Math.max(-window.innerHeight * 0.45, deltaY)); // Drag up to open
            } else {
                setDragOffset(deltaY * 0.2); // Resistance dragging further down
            }
        } else {
            // Already up. Can drag down fully, or drag up slightly with high resistance
            if (deltaY > 0) {
                setDragOffset(Math.min(window.innerHeight * 0.45, deltaY)); // Drag down to peek
            } else {
                setDragOffset(deltaY * 0.2); // Resistance dragging further up
            }
        }
    };

    const handleTouchEnd = (e) => {
        if (!isDragging) return;
        setIsDragging(false);
        const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
        const deltaY = clientY - startY.current;
        
        setDragOffset(0);

        // Snap logic based on drag distance and direction
        const snapThreshold = 50; // pixels to trigger a state change
        
        if (isPeeking) {
            // We were peeking. Did we drag UP enough to open?
            if (deltaY < -snapThreshold) {
                setIsPeeking(false); 
            }
            // If deltaY > 0, we dragged down further, it will just snap back to peek
        } else {
            // We were open. Did we drag DOWN enough to peek?
            if (deltaY > snapThreshold) {
                setIsPeeking(true);
            }
            // If deltaY < 0, we dragged up further, it will just snap back to open
        }
    };

    return (
        <div className="marine-app-container">
            <MarineView3D />
            
            {/* TOP HUD (Espécies and Ambiente) - Only visible on the Aquarium view */}
            {activeView === 'aquarium' && (
                <div style={{
                    position: 'absolute',
                    top: '40px',
                    left: '0',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '15px',
                    zIndex: 10,
                    pointerEvents: 'none' /* Let clicks pass through if needed */
                }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        padding: '8px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minWidth: '100px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }}>
                        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>Espécies:</span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>3</span>
                    </div>
                    
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        padding: '8px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minWidth: '120px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }}>
                        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' }}>Ambiente:</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--ocean-accent)' }}>Águas Rasas</span>
                    </div>
                </div>
            )}

            <div id="tabs-portal"></div>
            <div className="layout-content-wrapper">
                <main 
                    className="marine-main-content"
                    style={{ 
                        transform: `translateY(calc(${isPeeking ? '45vh' : '0px'} + ${dragOffset}px))`,
                        transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                >
                    {/* Visual drag handle to hint interaction - THIS IS THE ONLY DRAG ZONE NOW */}
                    <div 
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onMouseDown={handleTouchStart}
                        onMouseMove={handleTouchMove}
                        onMouseUp={handleTouchEnd}
                        onMouseLeave={handleTouchEnd}
                        style={{
                            width: '100px',
                            height: '6px',
                            background: 'rgba(255,255,255,0.4)',
                            borderRadius: '5px',
                            margin: '0 auto 15px auto',
                            cursor: 'grab',
                            padding: '10px 0', /* Give it a slightly bigger invisible touch target */
                            backgroundClip: 'content-box'
                        }}
                    ></div>
                    
                    {children}
                </main>
                <BottomNav />
            </div>
        </div>
    );
};

export default Layout;
