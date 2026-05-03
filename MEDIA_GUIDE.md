# Automatic Media Management

Your website now automatically detects media files!

## ✨ How It Works

The website scans your `public/media/` folder and automatically shows all your photos, videos, stories, and poems.

## 📁 Folder Structure

```
public/media/
├── photos/
│   ├── Tokyo/          (your photo folders)
│   └── Chennai/
├── videos/
│   └── Tokyo/          (your video folders)
├── stories/            (story images)
└── poems/              (poem images)
```

## 🔄 After Adding/Removing Files

Whenever you add or remove photos/videos/poems, run this command:

```bash
npm run scan-media
```

This will update the website to show your latest media!

## 🎯 What You Need To Do

1. **Add your files** to the appropriate folders in `public/media/`
2. **Run the scan** with `npm run scan-media`
3. **Refresh** your browser to see the changes

## Currently Detected

- **Photos**: Chennai (1 photo), Tokyo (1 photo)
- **Videos**: Tokyo (1 video)
- **Stories**: 0
- **Poems**: 0

No more manual coding required! Just add files and run `npm run scan-media`!
