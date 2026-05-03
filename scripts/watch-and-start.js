const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const mediaDir = path.join(__dirname, '../public/media');
const generatorScript = path.join(__dirname, 'generate-media-index.js');

// Function to run the generator
function runGenerator() {
    console.log('[Media Watcher] Changes detected. Updating media index...');
    const child = spawn('node', [generatorScript], { stdio: 'inherit', shell: true });

    child.on('close', (code) => {
        if (code === 0) {
            console.log('[Media Watcher] Index updated successfully.');
        }
    });
}

// Initial Run
console.log('[Media Watcher] Performing initial scan...');
runGenerator();

// Watch for changes
let debounceTimer;
console.log(`[Media Watcher] Watching for changes in ${mediaDir}...`);

try {
    fs.watch(mediaDir, { recursive: true }, (eventType, filename) => {
        if (filename && !filename.endsWith('.tmp')) { // Ignore temp files
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                runGenerator();
            }, 500); // 0.5s debounce to avoid double-triggers
        }
    });
} catch (err) {
    console.warn('[Media Watcher] Warning: Recursive watch not supported or failed. You may need to restart if adding new folders.');
}

// Start the React App (using the renamed script)
console.log('[Media Watcher] Starting React App...');
const reactApp = spawn('npm', ['run', 'react-start'], { stdio: 'inherit', shell: true });

reactApp.on('close', (code) => {
    process.exit(code);
});
