# Stories Feature

## How to Add Stories to Your Homepage

Stories work like Instagram stories - circular thumbnails at the top that viewers can click to view fullscreen.

### Story Folder
Place your story images here:
`public/media/stories/`

### Adding Stories

Open `src/pages/Home.jsx` and update the `stories` array:

```javascript
const stories = [
    {
        title: "Tokyo Trip",
        image: "/media/stories/tokyo-story.jpg",      // Full-size image
        thumbnail: "/media/stories/tokyo-thumb.jpg",  // Thumbnail (optional, will show icon if not provided)
        description: "Exploring Tokyo in 2024"         // Optional caption
    },
    {
        title: "New Project",
        image: "/media/stories/project.jpg",
        description: "Working on something exciting!"
    },
    // Add more stories...
];
```

### Image Recommendations
- **Thumbnails**: 80x80px square images
- **Story Images**: 1080x1920px (9:16 ratio) for best display
- **Formats**: .jpg, .png, .webp

### Features
- ✨ Circular thumbnails with accent border
- 📱 Fullscreen story viewer
- ⬅️➡️ Navigate between stories
- 📊 Progress bars showing current story
- ❌ Close button to exit
- 📝 Title and description overlay

Stories will automatically appear at the top of your homepage!
