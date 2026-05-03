import { useState, useEffect } from "react";
import Section from "../components/Section";
import Stories from "../components/Stories";

export default function ExtraCurricular() {
    const [selectedPhotoAlbum, setSelectedPhotoAlbum] = useState(null);
    const [selectedVideoCollection, setSelectedVideoCollection] = useState(null);
    const [selectedPoemGallery, setSelectedPoemGallery] = useState(null);

    // Dynamic media state
    const [mediaIndex, setMediaIndex] = useState({
        photos: {},
        videos: {},
        stories: [],
        poems: [],
        archive: { photos: [], videos: [] }
    });
    const [loading, setLoading] = useState(true);

    // Base path for media files (set by `homepage` in package.json)
    const basePath = process.env.PUBLIC_URL || '';

    // Fetch media index at runtime
    useEffect(() => {
        fetch(`${basePath}/mediaIndex.json`)
            .then(res => res.json())
            .then(data => {
                setMediaIndex(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load media index:", err);
                setLoading(false);
            });
    }, [basePath]);

    if (loading) {
        return <div style={{ padding: '80px', textAlign: 'center', opacity: 0.7 }}>Loading media...</div>;
    }

    // Stories - automatically loaded from mediaIndex
    const stories = (mediaIndex.stories || []).map(filename => ({
        title: filename.replace(/\.[^/.]+$/, ""), // Remove extension for title
        image: `${basePath}/media/stories/${filename}`,
        thumbnail: `${basePath}/media/stories/${filename}`
    }));

    // Photo albums - automatically loaded from mediaIndex
    const photoAlbums = Object.keys(mediaIndex.photos || {}).map(location => ({
        location,
        photoCount: mediaIndex.photos[location].length,
        photos: mediaIndex.photos[location]
    }));

    // Video collections - automatically loaded from mediaIndex  
    const videoCollections = Object.keys(mediaIndex.videos || {}).map(location => ({
        location,
        videoCount: mediaIndex.videos[location].length,
        videos: mediaIndex.videos[location]
    }));

    // Poems - automatically loaded from mediaIndex
    const poems = mediaIndex.poems || [];

    const FolderIcon = () => (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
    );

    const CameraIcon = () => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
        </svg>
    );

    const VideoIcon = () => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
    );

    const PhotoGallery = ({ album, onClose }) => {
        const [fullscreenImage, setFullscreenImage] = useState(null);

        return (
            <>
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, overflow: 'auto', padding: '40px' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <h2 style={{ color: 'white', margin: 0 }}>{album.location} Photos</h2>
                            <button onClick={onClose} className="btn ghost" style={{ color: 'white', borderColor: 'white' }}>Close</button>
                        </div>
                        {album.photoCount === 0 ? (
                            <div style={{ textAlign: 'center', color: 'white', padding: '60px' }}>
                                <p>No photos yet. Add images to:</p>
                                <code style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '4px' }}>
                                    public/media/photos/{album.location}/
                                </code>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                                {album.photos.map((photo, idx) => (
                                    <img
                                        key={idx}
                                        src={album.location === "Archive"
                                            ? `${basePath}/media/archive/photos/${photo}`
                                            : `${basePath}/media/photos/${album.location}/${photo}`}
                                        alt={`${album.location} ${idx + 1}`}
                                        onClick={() => setFullscreenImage(
                                            album.location === "Archive"
                                                ? `${basePath}/media/archive/photos/${photo}`
                                                : `${basePath}/media/photos/${album.location}/${photo}`
                                        )}
                                        style={{
                                            width: '100%',
                                            height: '300px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Fullscreen Image Viewer */}
                {fullscreenImage && (
                    <div
                        onClick={() => setFullscreenImage(null)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.95)',
                            zIndex: 2000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'zoom-out'
                        }}
                    >
                        <img
                            src={fullscreenImage}
                            alt="Fullscreen"
                            style={{
                                maxWidth: '95%',
                                maxHeight: '95%',
                                objectFit: 'contain',
                                borderRadius: '8px'
                            }}
                        />
                        <button
                            onClick={(e) => { e.stopPropagation(); setFullscreenImage(null); }}
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                color: 'white',
                                fontSize: '32px',
                                cursor: 'pointer',
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            ×
                        </button>
                    </div>
                )}
            </>
        );
    };

    const VideoGallery = ({ collection, onClose }) => {
        const [fullscreenVideo, setFullscreenVideo] = useState(null);

        return (
            <>
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, overflow: 'auto', padding: '40px' }}>
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <h2 style={{ color: 'white', margin: 0 }}>{collection.location} Videos</h2>
                            <button onClick={onClose} className="btn ghost" style={{ color: 'white', borderColor: 'white' }}>Close</button>
                        </div>
                        {collection.videoCount === 0 ? (
                            <div style={{ textAlign: 'center', color: 'white', padding: '60px' }}>
                                <p>No videos yet. Add videos to:</p>
                                <code style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '4px' }}>
                                    public/media/videos/{collection.location}/
                                </code>
                                <p style={{ marginTop: '16px', fontSize: '14px', opacity: 0.8 }}>
                                    Recommended format: MP4 or WebM for best browser compatibility
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '32px' }}>
                                {collection.videos.map((video, idx) => (
                                    <div key={idx} style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>
                                        <div style={{ position: 'relative' }}>
                                            <video
                                                controls
                                                preload="metadata"
                                                controlsList="nodownload nofullscreen"
                                                disablePictureInPicture
                                                style={{
                                                    width: '100%',
                                                    maxHeight: '500px',
                                                    borderRadius: '8px',
                                                    background: '#000',
                                                    objectFit: 'contain'
                                                }}
                                            >
                                                <source src={collection.location === "Archive" ? `${basePath}/media/archive/videos/${video}` : `${basePath}/media/videos/${collection.location}/${video}`} type="video/mp4" />
                                                <source src={collection.location === "Archive" ? `${basePath}/media/archive/videos/${video}` : `${basePath}/media/videos/${collection.location}/${video}`} type="video/quicktime" />
                                                Your browser does not support this video format. Try converting to MP4.
                                            </video>
                                            {/* Custom Fullscreen Button */}
                                            <button
                                                onClick={() => setFullscreenVideo(collection.location === "Archive" ? `${basePath}/media/archive/videos/${video}` : `${basePath}/media/videos/${collection.location}/${video}`)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '16px',
                                                    right: '16px',
                                                    background: 'rgba(0,0,0,0.7)',
                                                    border: '1px solid rgba(255,255,255,0.3)',
                                                    color: 'white',
                                                    padding: '8px 16px',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    zIndex: 10
                                                }}
                                            >
                                                ⛶ Fullscreen
                                            </button>
                                        </div>
                                        <div style={{ color: 'white', marginTop: '12px', fontSize: '14px', opacity: 0.7 }}>
                                            {video}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Custom Fullscreen Video Viewer */}
                {fullscreenVideo && (
                    <div
                        onClick={() => setFullscreenVideo(null)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.98)',
                            zIndex: 2000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <video
                            autoPlay
                            controls
                            controlsList="nodownload"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                maxWidth: '95vw',
                                maxHeight: '95vh',
                                objectFit: 'contain',
                                borderRadius: '8px'
                            }}
                        >
                            <source src={fullscreenVideo} type="video/mp4" />
                            <source src={fullscreenVideo} type="video/quicktime" />
                        </video>
                        <button
                            onClick={(e) => { e.stopPropagation(); setFullscreenVideo(null); }}
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                color: 'white',
                                fontSize: '32px',
                                cursor: 'pointer',
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            ×
                        </button>
                    </div>
                )}
            </>
        );
    };

    const PoemGallery = ({ poems, onClose }) => {
        const [fullscreenPoem, setFullscreenPoem] = useState(null);

        return (
            <>
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, overflow: 'auto', padding: '40px' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <h2 style={{ color: 'white', margin: 0 }}>Kavithaigal</h2>
                            <button onClick={onClose} className="btn ghost" style={{ color: 'white', borderColor: 'white' }}>Close</button>
                        </div>
                        {poems.length === 0 ? (
                            <div style={{ textAlign: 'center', color: 'white', padding: '60px' }}>
                                <p>No poems yet. Add images to:</p>
                                <code style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '4px' }}>
                                    public/media/poems/
                                </code>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                                {poems.map((poem, idx) => (
                                    <img
                                        key={idx}
                                        src={`${basePath}/media/poems/${poem}`}
                                        alt={`Poem ${idx + 1}`}
                                        onClick={() => setFullscreenPoem(`${basePath}/media/poems/${poem}`)}
                                        style={{
                                            width: '100%',
                                            height: '300px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Fullscreen Poem Viewer */}
                {fullscreenPoem && (
                    <div
                        onClick={() => setFullscreenPoem(null)}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.95)',
                            zIndex: 2000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'zoom-out'
                        }}
                    >
                        <img
                            src={fullscreenPoem}
                            alt="Fullscreen"
                            style={{
                                maxWidth: '95%',
                                maxHeight: '95%',
                                objectFit: 'contain',
                                borderRadius: '8px'
                            }}
                        />
                        <button
                            onClick={(e) => { e.stopPropagation(); setFullscreenPoem(null); }}
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                color: 'white',
                                fontSize: '32px',
                                cursor: 'pointer',
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            ×
                        </button>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className="stack">
            {selectedPhotoAlbum && <PhotoGallery album={selectedPhotoAlbum} onClose={() => setSelectedPhotoAlbum(null)} />}
            {selectedVideoCollection && <VideoGallery collection={selectedVideoCollection} onClose={() => setSelectedVideoCollection(null)} />}
            {selectedPoemGallery && <PoemGallery poems={poems} onClose={() => setSelectedPoemGallery(null)} />}

            {/* Stories Section - Always Visible */}
            <Section title="Stories" subtitle="Moments worth sharing">
                <Stories stories={stories} />
            </Section>

            <Section title="Photography" subtitle="Organized by location">
                <div className="cardGrid">
                    {photoAlbums.map((album) => (
                        <div
                            key={album.location}
                            className="card folderCard"
                            onClick={() => setSelectedPhotoAlbum(album)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div style={{ marginBottom: '16px', color: 'var(--text)' }}>
                                <FolderIcon />
                            </div>
                            <div className="h3">{album.location}</div>
                            <div className="muted small">
                                {album.photoCount === 0 ? 'Empty folder' : `${album.photoCount} photos`}
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Videography" subtitle="Video collections by location">
                <div className="cardGrid">
                    {videoCollections.map((collection) => (
                        <div
                            key={collection.location}
                            className="card folderCard"
                            onClick={() => setSelectedVideoCollection(collection)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div style={{ marginBottom: '16px', color: 'var(--text)' }}>
                                <FolderIcon />
                            </div>
                            <div className="h3">{collection.location}</div>
                            <div className="muted small">
                                {collection.videoCount === 0 ? 'Empty folder' : `${collection.videoCount} videos`}
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Kavithaigal" subtitle="Poetry in visual form">
                <div className="cardGrid">
                    <div
                        className="card folderCard"
                        onClick={() => setSelectedPoemGallery(true)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div style={{ marginBottom: '16px', color: 'var(--text)' }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10 9 9 9 8 9" />
                            </svg>
                        </div>
                        <div className="h3">All Poems</div>
                        <div className="muted small">
                            {poems.length === 0 ? 'No poems yet' : `${poems.length} poems`}
                        </div>
                    </div>
                </div>
            </Section>

            <Section title="Archives" subtitle="Archived creative works">
                <div className="grid2">
                    <div
                        className="card folderCard"
                        onClick={() => {
                            const archiveAlbum = {
                                location: "Archive",
                                photoCount: mediaIndex.archive.photos.length,
                                photos: mediaIndex.archive.photos
                            };
                            setSelectedPhotoAlbum(archiveAlbum);
                        }}
                        style={{ cursor: 'pointer', textAlign: 'center' }}
                    >
                        <div style={{ marginBottom: '16px', color: 'var(--text)' }}>
                            <CameraIcon />
                        </div>
                        <div className="h3">Photography</div>
                        <div className="muted small">
                            {mediaIndex.archive.photos.length === 0
                                ? 'No archived photos'
                                : `${mediaIndex.archive.photos.length} archived photos`}
                        </div>
                    </div>

                    <div
                        className="card folderCard"
                        onClick={() => {
                            const archiveCollection = {
                                location: "Archive",
                                videoCount: mediaIndex.archive.videos.length,
                                videos: mediaIndex.archive.videos
                            };
                            setSelectedVideoCollection(archiveCollection);
                        }}
                        style={{ cursor: 'pointer', textAlign: 'center' }}
                    >
                        <div style={{ marginBottom: '16px', color: 'var(--text)' }}>
                            <VideoIcon />
                        </div>
                        <div className="h3">Videography</div>
                        <div className="muted small">
                            {mediaIndex.archive.videos.length === 0
                                ? 'No archived videos'
                                : `${mediaIndex.archive.videos.length} archived videos`}
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
}
