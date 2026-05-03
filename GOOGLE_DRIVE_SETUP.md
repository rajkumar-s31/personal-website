# Google Drive Cloud Storage Setup (Budget)

## 1) Configure Google Cloud project
- Open Google Cloud Console.
- Select or create a project.
- Enable Google Drive API for that project.

## 2) Create OAuth Client ID
- Open APIs & Services -> Credentials.
- Create OAuth client ID for Web application.
- Add Authorized JavaScript origins:
  - http://localhost:3000
  - Your deployed website URL
- Copy the Client ID.

## 3) Add environment values
- In `.env.local`, set:
  - REACT_APP_GOOGLE_CLIENT_ID=<your_client_id>
  - REACT_APP_GOOGLE_DRIVE_FILE_NAME=budget-data.json

## 4) Restart app
- Restart the development server after env changes.
- Open Budget page.
- Click Connect Cloud.

## 5) How data is stored
- Data is saved as JSON in Google Drive `appDataFolder`.
- This folder is hidden from normal Drive UI and app-specific.
- Same Google account across browsers/devices will load the same budget data.
