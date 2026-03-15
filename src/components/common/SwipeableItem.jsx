import React, { useState, useRef } from 'react';
import './SwipeableItem.css';

const SWIPE_THRESHOLD = 80;
const Y_ACTIVATION_THRESHOLD = 25; // Lowered to make diagonal easier

const SwipeableItem = ({
    children,
    onSwipeLeft,
    onSwipeRight,
    onSwipeTopRight,
    leftBgColor = '#FF6B6B',
    rightBgColor = '#1DD1A1',
    topRightBgColor = '#8892B0',
    leftIcon,
    rightIcon,
    topRightIcon
}) => {
    const [translateX, setTranslateX] = useState(0);
    const [translateY, setTranslateY] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);

    // Store coordinates
    const startX = useRef(0);
    const startY = useRef(0);
    const isHorizontalSwipe = useRef(null);

    const handlePointerDown = (e) => {
        // Only react to primary button (e.g. left click or touch)
        if (e.pointerType === 'mouse' && e.button !== 0) return;

        startX.current = e.clientX;
        startY.current = e.clientY;
        isHorizontalSwipe.current = null;
        setIsSwiping(true);
    };

    const handlePointerMove = (e) => {
        if (!isSwiping) return;

        const currentX = e.clientX;
        const currentY = e.clientY;
        const diffX = currentX - startX.current;
        const diffY = currentY - startY.current;

        if (isHorizontalSwipe.current === null) {
            // Determine dominant axis on first move
            if (Math.abs(diffX) > Math.abs(diffY)) {
                isHorizontalSwipe.current = true;
            } else {
                isHorizontalSwipe.current = false;
                setIsSwiping(false);
                return;
            }
        }

        if (isHorizontalSwipe.current) {
            try { e.currentTarget.setPointerCapture(e.pointerId); } catch(err) {} 
            setTranslateX(diffX * 0.8);
            setTranslateY(diffY * 0.8);
        }
    };

    const handlePointerUp = (e) => {
        if (!isSwiping) return;
        setIsSwiping(false);
        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        } catch (err) {}

        const diffX = translateX;
        const diffY = translateY;

        if (diffX > SWIPE_THRESHOLD) {
            if (diffY < -Y_ACTIVATION_THRESHOLD && onSwipeTopRight) {
                onSwipeTopRight();
            } else if (onSwipeRight) {
                onSwipeRight();
            }
        } else if (diffX < -SWIPE_THRESHOLD) {
            if (onSwipeLeft) {
                onSwipeLeft();
            }
        }

        setTranslateX(0);
        setTranslateY(0);
    };

    // Calculate opacity
    const actionOpacity = Math.min(Math.abs(translateX) / SWIPE_THRESHOLD, 1);

    const isActiveRight = translateX > 0;
    const isActiveLeft = translateX < 0;

    const isTopRightActive = isActiveRight && translateY < -Y_ACTIVATION_THRESHOLD;

    const currentLeftBg = leftBgColor;
    const currentLeftIcon = leftIcon;

    const currentRightBg = isTopRightActive ? topRightBgColor : rightBgColor;
    const currentRightIcon = isTopRightActive ? (topRightIcon || rightIcon) : rightIcon;

    return (
        <div className="swipeable-container">
            <div className="swipeable-background">
                <div
                    className="swipeable-action left-action"
                    style={{
                        opacity: isActiveRight ? actionOpacity : 0,
                        backgroundColor: currentRightBg
                    }}
                >
                    {currentRightIcon && <span className="action-icon" style={{ transform: `scale(${actionOpacity})` }}>{currentRightIcon}</span>}
                </div>

                <div
                    className="swipeable-action right-action"
                    style={{
                        opacity: isActiveLeft ? actionOpacity : 0,
                        backgroundColor: currentLeftBg
                    }}
                >
                    {currentLeftIcon && <span className="action-icon" style={{ transform: `scale(${actionOpacity})` }}>{currentLeftIcon}</span>}
                </div>
            </div>

            <div
                className={`swipeable-content ${!isSwiping ? 'snap-back' : ''}`}
                style={{ 
                    transform: `translate(${translateX}px, 0px)`,
                    touchAction: 'pan-y' // Allow native vertical scrolling
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
            >
                {children}
            </div>
        </div>
    );
};

export default SwipeableItem;
