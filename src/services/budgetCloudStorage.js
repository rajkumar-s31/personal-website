const LOCAL_STORAGE_KEY = "personal-budget-entries-v1";
const CLOUD_CONNECTED_KEY = "personal-budget-cloud-connected-v1";
const CLOUD_TOKEN_KEY = "personal-budget-cloud-token-v1";
const CLOUD_FILE_ID_KEY = "personal-budget-cloud-file-id-v1";
const DRIVE_SCOPE = [
    "https://www.googleapis.com/auth/drive.appdata",
    "openid",
    "email",
    "profile",
].join(" ");
const DRIVE_FILE_NAME = process.env.REACT_APP_GOOGLE_DRIVE_FILE_NAME || "budget-data.json";
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

let gisScriptPromise = null;
let tokenClient = null;
let accessToken = null;
let tokenExpiryMs = 0;

function readLocalEntries() {
    try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeLocalEntries(entries) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
}

function setCloudConnected(isConnected) {
    if (isConnected) {
        localStorage.setItem(CLOUD_CONNECTED_KEY, "1");
        return;
    }

    localStorage.removeItem(CLOUD_CONNECTED_KEY);
}

function wasCloudConnected() {
    return localStorage.getItem(CLOUD_CONNECTED_KEY) === "1";
}

function persistToken(token, expiryMs) {
    localStorage.setItem(CLOUD_TOKEN_KEY, JSON.stringify({
        accessToken: token,
        tokenExpiryMs: expiryMs,
    }));
}

function clearPersistedToken() {
    localStorage.removeItem(CLOUD_TOKEN_KEY);
}

function restorePersistedToken() {
    try {
        const raw = localStorage.getItem(CLOUD_TOKEN_KEY);
        if (!raw) {
            return false;
        }

        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed.accessToken !== "string" || typeof parsed.tokenExpiryMs !== "number") {
            clearPersistedToken();
            return false;
        }

        if (Date.now() >= parsed.tokenExpiryMs - 30_000) {
            clearPersistedToken();
            return false;
        }

        accessToken = parsed.accessToken;
        tokenExpiryMs = parsed.tokenExpiryMs;
        return true;
    } catch {
        clearPersistedToken();
        return false;
    }
}

function persistFileId(fileId) {
    if (!fileId) {
        localStorage.removeItem(CLOUD_FILE_ID_KEY);
        return;
    }

    localStorage.setItem(CLOUD_FILE_ID_KEY, fileId);
}

export function isCloudConfigured() {
    return Boolean(GOOGLE_CLIENT_ID);
}

function loadGisScript() {
    if (window.google && window.google.accounts && window.google.accounts.oauth2) {
        return Promise.resolve();
    }

    if (gisScriptPromise) {
        return gisScriptPromise;
    }

    gisScriptPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Google Identity Services"));
        document.head.appendChild(script);
    });

    return gisScriptPromise;
}

async function ensureToken(interactive) {
    if (!isCloudConfigured()) {
        throw new Error("Google client id not configured");
    }

    if (accessToken && Date.now() < tokenExpiryMs - 30_000) {
        return accessToken;
    }

    if (restorePersistedToken()) {
        return accessToken;
    }

    await loadGisScript();

    if (!tokenClient) {
        tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: DRIVE_SCOPE,
            callback: () => {},
        });
    }

    return new Promise((resolve, reject) => {
        tokenClient.callback = (response) => {
            if (response.error) {
                reject(new Error(response.error));
                return;
            }

            accessToken = response.access_token;
            const expiresInSeconds = Number(response.expires_in || 3600);
            tokenExpiryMs = Date.now() + (expiresInSeconds * 1000);
            persistToken(accessToken, tokenExpiryMs);
            resolve(accessToken);
        };

        tokenClient.error_callback = () => {
            reject(new Error("token_request_failed"));
        };

        tokenClient.requestAccessToken({
            // Use a true silent request on refresh so it does not trigger a popup.
            prompt: interactive ? "consent" : "none",
        });
    });
}

async function authFetch(url, options = {}) {
    const headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`,
    };

    const response = await fetch(url, {
        ...options,
        headers,
        cache: options.cache || "no-store",
    });

    if (!response.ok) {
        if (response.status === 401) {
            accessToken = null;
            tokenExpiryMs = 0;
            clearPersistedToken();
        }
        const errorText = await response.text().catch(() => "");
        throw new Error(`Drive request failed: ${response.status}${errorText ? ` - ${errorText}` : ""}`);
    }

    return response;
}

function escapeDriveQueryText(text) {
    return text.replace(/'/g, "\\'");
}

async function findDriveFileId() {
    const query = encodeURIComponent(`name='${escapeDriveQueryText(DRIVE_FILE_NAME)}' and 'appDataFolder' in parents and trashed=false`);
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&spaces=appDataFolder&fields=files(id,name,modifiedTime)&orderBy=modifiedTime desc&pageSize=10`;
    const response = await authFetch(url);
    const payload = await response.json();
    const files = Array.isArray(payload.files) ? payload.files : [];
    if (files.length === 0) {
        persistFileId("");
        return null;
    }

    // Always use the newest file so different browsers converge to one source of truth.
    const selected = files[0];
    persistFileId(selected.id);
    return selected.id;
}

async function readCloudEntries() {
    const fileId = await findDriveFileId();
    if (!fileId) {
        return null;
    }

    const response = await authFetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`);
    const payload = await response.json();
    return {
        fileId,
        entries: Array.isArray(payload.entries) ? payload.entries : [],
    };
}

async function uploadEntriesToDrive(entries, existingFileId) {
    const metadata = existingFileId
        ? {
            name: DRIVE_FILE_NAME,
            mimeType: "application/json",
        }
        : {
            name: DRIVE_FILE_NAME,
            parents: ["appDataFolder"],
            mimeType: "application/json",
        };

    const body = {
        entries,
        updatedAt: new Date().toISOString(),
    };

    const boundary = `budget_sync_${Date.now()}`;
    const delimiter = `--${boundary}`;
    const closeDelimiter = `--${boundary}--`;
    const multipartBody = [
        delimiter,
        "Content-Type: application/json; charset=UTF-8",
        "",
        JSON.stringify(metadata),
        delimiter,
        "Content-Type: application/json; charset=UTF-8",
        "",
        JSON.stringify(body),
        closeDelimiter,
        "",
    ].join("\r\n");

    const endpoint = existingFileId
        ? `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=multipart`
        : "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";

    const response = await authFetch(endpoint, {
        method: existingFileId ? "PATCH" : "POST",
        headers: {
            "Content-Type": `multipart/related; boundary=${boundary}`,
        },
        body: multipartBody,
    });

    const payload = await response.json();
    if (payload && payload.id) {
        persistFileId(payload.id);
    }
}

export async function getUserInfo() {
    if (!accessToken) {
        return null;
    }

    try {
        const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` },
            cache: "no-store",
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return {
            name: data.name || "",
            email: data.email || "",
            picture: data.picture || "",
        };
    } catch {
        return null;
    }
}

export async function connectCloudStorage() {
    if (!isCloudConfigured()) {
        return {
            source: "local",
            warning: "Google Drive is not configured. Add REACT_APP_GOOGLE_CLIENT_ID in env.",
        };
    }

    try {
        await ensureToken(true);
        setCloudConnected(true);
        return {
            source: "cloud",
            message: "Google Drive connected.",
        };
    } catch {
        accessToken = null;
        tokenExpiryMs = 0;
        clearPersistedToken();
        setCloudConnected(false);
        return {
            source: "local",
            warning: "Google Drive sign-in failed or was cancelled.",
        };
    }
}

export async function loadBudgetEntriesFromStorage() {
    const localEntries = readLocalEntries();

    if (!isCloudConfigured()) {
        return {
            entries: localEntries,
            source: "local",
            warning: "Google Drive not configured yet. Add REACT_APP_GOOGLE_CLIENT_ID.",
        };
    }

    try {
        await ensureToken(false);
    } catch {
        return {
            entries: localEntries,
            source: "local",
            warning: wasCloudConnected()
                ? "Auto cloud sync could not restore this session. Click Connect Cloud once to continue syncing."
                : "Cloud not connected. Click Connect Cloud to sync with Google Drive.",
        };
    }

    try {
        const cloud = await readCloudEntries();
        setCloudConnected(true);

        if (cloud && Array.isArray(cloud.entries)) {
            writeLocalEntries(cloud.entries);
            return {
                entries: cloud.entries,
                source: "cloud",
            };
        }

        if (localEntries.length > 0) {
            await uploadEntriesToDrive(localEntries, null);
            return {
                entries: localEntries,
                source: "cloud",
            };
        }

        return {
            entries: [],
            source: "cloud",
        };
    } catch {
        return {
            entries: localEntries,
            source: "local",
            warning: "Could not read from Google Drive. Showing local data.",
        };
    }
}

export async function saveBudgetEntriesToStorage(entries) {
    writeLocalEntries(entries);

    if (!isCloudConfigured()) {
        return {
            source: "local",
            warning: "Google Drive not configured yet. Data saved locally.",
        };
    }

    try {
        await ensureToken(false);
    } catch {
        return {
            source: "local",
            warning: wasCloudConnected()
                ? "Auto cloud sync could not restore this session. Click Connect Cloud once to continue syncing."
                : "Cloud not connected. Click Connect Cloud to save to Google Drive.",
        };
    }

    try {
        const existingFileId = await findDriveFileId();
        await uploadEntriesToDrive(entries, existingFileId);
        setCloudConnected(true);
        return {
            source: "cloud",
        };
    } catch (error) {
        return {
            source: "local",
            warning: `Google Drive save failed (${error?.message || "unknown error"}). Data is stored locally in this browser.`,
        };
    }
}
