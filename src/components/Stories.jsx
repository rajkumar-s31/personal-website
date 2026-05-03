import { useState } from "react";
import { createPortal } from "react-dom";

export default function Stories({ stories }) {
    const [selectedStory, setSelectedStory] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openStory = (index) => {
        setSelectedStory(stories[index]);
        setCurrentIndex(index);
    };

    const closeStory = () => {
        setSelectedStory(null);
        setCurrentIndex(0);
    };

    const nextStory = () => {
        if (currentIndex < stories.length - 1) {
            const next = currentIndex + 1;
            setCurrentIndex(next);
            setSelectedStory(stories[next]);
        } else {
            closeStory();
        }
    };

    const prevStory = () => {
        if (currentIndex > 0) {
            const prev = currentIndex - 1;
            setCurrentIndex(prev);
            setSelectedStory(stories[prev]);
        }
    };

    return (
        <>
            {/* Story Circles */}
            <div style={{
                display: 'flex',
                gap: '16px',
                overflowX: 'auto',
                padding: '16px 0',
                marginBottom: '32px'
            }}>
                {(!stories || stories.length === 0) ? (
                    /* Empty State */
                    <div style={{
                        width: '100%',
                        textAlign: 'center',
                        padding: '40px 20px',
                        background: 'var(--surface)',
                        borderRadius: '16px',
                        border: '2px dashed var(--border)'
                    }}>
                        <div style={{ marginBottom: '16px', color: 'var(--text)', display: 'flex', justifyContent: 'center' }}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                            </svg>
                        </div>
                        <div className="h3" style={{ marginBottom: '8px' }}>Vasee's in the workshop!</div>
                        <div className="muted">
                            Too busy building robots and designing cool stuff to update stories. <br />
                            Check back later for creative chaos!
                        </div>
                    </div>
                ) : (
                    stories.map((story, idx) => (
                        <div
                            key={idx}
                            onClick={() => openStory(idx)}
                            style={{
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                minWidth: '80px'
                            }}
                        >
                            <div style={{
                                width: '72px',
                                height: '72px',
                                borderRadius: '50%',
                                border: '3px solid var(--accent)',
                                padding: '3px',
                                background: 'var(--bg)'
                            }}>
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    background: 'var(--surface)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {story.thumbnail ? (
                                        <img
                                            src={story.thumbnail}
                                            alt={story.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                            <circle cx="12" cy="13" r="4" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <div style={{
                                fontSize: '12px',
                                color: 'var(--text)',
                                textAlign: 'center',
                                maxWidth: '80px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                {story.title}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Story Viewer - Rendered in a Portal to escape parent padding */}
            {selectedStory && createPortal(
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.95)',
                    zIndex: 9999, // High z-index to stay on top
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100vw', // Ensure full width
                    height: '100vh', // Ensure full height
                    overflow: 'hidden' // Prevent scrolling
                }}>
                    {/* Progress Bars */}
                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        right: '20px',
                        display: 'flex',
                        gap: '4px',
                        zIndex: 10
                    }}>
                        {stories.map((_, idx) => (
                            <div
                                key={idx}
                                style={{
                                    flex: 1,
                                    height: '3px',
                                    background: idx <= currentIndex ? 'white' : 'rgba(255, 255, 255, 0.3)',
                                    borderRadius: '2px'
                                }}
                            />
                        ))}
                    </div>

                    {/* Story Content */}
                    <div style={{
                        maxWidth: '500px',
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <img
                            src={selectedStory.image}
                            alt={selectedStory.title}
                            style={{
                                width: '100%',
                                maxHeight: '90vh',
                                objectFit: 'contain',
                                borderRadius: '12px'
                            }}
                        />

                        {/* Story Info */}
                        <div style={{
                            position: 'absolute',
                            bottom: '40px',
                            left: '20px',
                            right: '20px',
                            background: 'rgba(0, 0, 0, 0.7)',
                            padding: '16px',
                            borderRadius: '8px',
                            color: 'white',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                {selectedStory.title}
                            </div>
                            {selectedStory.description && (
                                <div style={{ fontSize: '14px', opacity: 0.9 }}>
                                    {selectedStory.description}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation */}
                    {currentIndex > 0 && (
                        <button
                            onClick={prevStory}
                            style={{
                                position: 'absolute',
                                left: '20px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'rgba(255, 255, 255, 0.2)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '48px',
                                height: '48px',
                                cursor: 'pointer',
                                color: 'white',
                                fontSize: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 10
                            }}
                        >
                            ‹
                        </button>
                    )}

                    {currentIndex < stories.length - 1 && (
                        <button
                            onClick={nextStory}
                            style={{
                                position: 'absolute',
                                right: '20px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'rgba(255, 255, 255, 0.2)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '48px',
                                height: '48px',
                                cursor: 'pointer',
                                color: 'white',
                                fontSize: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 10
                            }}
                        >
                            ›
                        </button>
                    )}

                    {/* Close Button */}
                    <button
                        onClick={closeStory}
                        style={{
                            position: 'absolute',
                            top: '40px',
                            right: '20px',
                            background: 'rgba(0,0,0,0.3)',
                            border: 'none',
                            color: 'white',
                            fontSize: '32px',
                            cursor: 'pointer',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 20
                        }}
                    >
                        ×
                    </button>
                </div>,
                document.body
            )}
        </>
    );
}
