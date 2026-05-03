const fs = require('fs');
const path = require('path');

const mediaDir = path.join(__dirname, '../public/media');
const outputFile = path.join(__dirname, '../public/mediaIndex.json');

function scanDirectory(dir) {
    try {
        const items = fs.readdirSync(dir);
        return items.filter(item => {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            return stat.isFile() && /\.(jpg|jpeg|png|gif|webp|mp4|webm|mov)$/i.test(item);
        });
    } catch (error) {
        return [];
    }
}

function scanFolders(baseDir) {
    try {
        const folders = fs.readdirSync(baseDir);
        return folders.filter(folder => {
            const fullPath = path.join(baseDir, folder);
            const stat = fs.statSync(fullPath);
            return stat.isDirectory();
        });
    } catch (error) {
        return [];
    }
}

// Generate media index
const mediaIndex = {
    photos: {},
    videos: {},
    stories: [],
    poems: [],
    archive: {
        photos: [],
        videos: []
    }
};

// Scan photo folders
const photosDir = path.join(mediaDir, 'photos');
if (fs.existsSync(photosDir)) {
    const photoFolders = scanFolders(photosDir);
    photoFolders.forEach(folder => {
        const files = scanDirectory(path.join(photosDir, folder));
        mediaIndex.photos[folder] = files; // Include even if empty
    });
}

// Scan video folders
const videosDir = path.join(mediaDir, 'videos');
if (fs.existsSync(videosDir)) {
    const videoFolders = scanFolders(videosDir);
    videoFolders.forEach(folder => {
        const files = scanDirectory(path.join(videosDir, folder));
        mediaIndex.videos[folder] = files; // Include even if empty
    });
}

// Scan stories
const storiesDir = path.join(mediaDir, 'stories');
if (fs.existsSync(storiesDir)) {
    mediaIndex.stories = scanDirectory(storiesDir);
}

// Scan poems
const poemsDir = path.join(mediaDir, 'poems');
if (fs.existsSync(poemsDir)) {
    mediaIndex.poems = scanDirectory(poemsDir);
}

// Scan archive photos
const archivePhotosDir = path.join(mediaDir, 'archive', 'photos');
if (fs.existsSync(archivePhotosDir)) {
    mediaIndex.archive.photos = scanDirectory(archivePhotosDir);
}

// Scan archive videos
const archiveVideosDir = path.join(mediaDir, 'archive', 'videos');
if (fs.existsSync(archiveVideosDir)) {
    mediaIndex.archive.videos = scanDirectory(archiveVideosDir);
}

// Write to file
fs.writeFileSync(outputFile, JSON.stringify(mediaIndex, null, 2));

console.log('✓ Media index generated!');
console.log(`  Photos: ${Object.keys(mediaIndex.photos).length} folders`);
console.log(`  Videos: ${Object.keys(mediaIndex.videos).length} folders`);
console.log(`  Stories: ${mediaIndex.stories.length} files`);
console.log(`  Poems: ${mediaIndex.poems.length} files`);
console.log(`  Archive Photos: ${mediaIndex.archive.photos.length} files`);
console.log(`  Archive Videos: ${mediaIndex.archive.videos.length} files`);
