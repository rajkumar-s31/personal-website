# Archive Folders

## Purpose

Use these folders to store photos and videos you want to hide from your main galleries but don't want to delete permanently.

## Structure

- `public/media/archive/photos/` - For archived photos
- `public/media/archive/videos/` - For archived videos

## How to Archive Media

1. **Move files** from active folders to archive:
   - From: `public/media/photos/Tokyo/old-photo.jpg`
   - To: `public/media/archive/photos/old-photo.jpg`

2. **Run the scan:**
   ```bash
   npm run scan-media
   ```

3. **Refresh browser** to see updated counts

## Accessing Archives

On your website, click the **Archives** section to view:
- **Photography** card - Shows all archived photos
- **Videography** card - Shows all archived videos

Archives are separate from your active media and won't show in the Photography or Videography sections.

## Current Status
- Archive Photos: 0 files
- Archive Videos: 0 files
