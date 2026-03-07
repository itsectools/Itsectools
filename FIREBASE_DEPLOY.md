# Deploying ITSecTools to Firebase Hosting

This guide explains how to publish your Next.js application to **Firebase Hosting** and map your custom `itsectools.com` domain.

## Why Firebase Hosting?
Firebase supports modern **Next.js Features** (SSR/API Routes) automatically by deploying the server-side logic to **Cloud Functions for Firebase** (2nd Gen). You do NOT need to create a manual `index.html`.

---

## 1. Prerequisites (One-time Setup)

1.  **Create a New Project** in the [Firebase Console](https://console.firebase.google.com/).
    -   Click "Add Project" -> Name it `itsectools` (or similar).
    -   (Optional) Enable Analytics.
    -   Click "Continue/Create".

2.  **Enable Blaze (Pay-as-you-go) Plan** (Required for Cloud Functions/SSR).
    -   Go to **Project Overview** -> **Usage and Billing** -> **Modify Plan**.
    -   Select **Blaze**.
    -   *Note: Next.js hosting requires Cloud Functions, which requires the Blaze plan. However, the free tier limits are generous, and you typically won't be charged unless usage is high.*

3.  **Install Firebase CLI** on your machine:
    ```bash
    npm install -g firebase-tools
    ```

4.  **Login to Firebase**:
    ```bash
    firebase login
    ```
    *(Follow the browser prompt to authorize)*

---

## 2. Initialize Firebase in Your Project

Run the following command in your project root:

```bash
firebase experiments:enable webframeworks
firebase init hosting
```

**Follow the interactive prompts:**

1.  **? Please select an option:** -> `Use an existing project`
2.  **? Select a default Firebase project:** -> *Select the project you created in Step 1 (e.g., `itsectools`)*
3.  **? Detected an existing Next.js codebase in the current directory, should we use this?** -> `Yes`
4.  **? In which region would you like to host server-side content?** -> *Choose a region close to your users (e.g., `us-central1` or `europe-west1`)*
5.  **? Set up automatic builds and deploys with GitHub?** -> `No` (or Yes if you want CI/CD, but No keeps it simple for now)

This will create a `firebase.json` and `.firebaserc` file in your project.

---

## 3. Deploy to Production

Once initialized, deploying is simple. Run:

```bash
firebase deploy
```

**What happens:**
-   Firebase builds your Next.js app (`next build`).
-   Static assets (images, CSS) are uploaded to global CDN.
-   Server-side code (API routes like `/api/ngfw/test`) is deployed to Cloud Functions.
-   You will get a **Hosting URL** like `https://itsectools.web.app`.

---

## 4. Connect Your Domain (itsectools.com)

1.  Go to **Firebase Console** -> **Hosting**.
2.  Click **Add Custom Domain**.
3.  Enter `itsectools.com`.
4.  **Verify Ownership**: Firebase will ask you to add a **TXT record** to your DNS provider (GoDaddy, Namecheap, etc.).
5.  **Update A Records**: Once verified, Firebase will give you **A Records** (IP addresses). Add these to your DNS provider to point your domain to Firebase.
6.  **Wait for SSL**: Firebase will automatically provision a free SSL certificate (HTTPS) for your domain within 24 hours (usually much faster).

### Step-by-Step for GoDaddy:

1.  **Log in to GoDaddy.**
2.  Go to your **My Products** page.
3.  Next to `itsectools.com`, click **DNS**.
4.  **Add the TXT Verification Record:**
    *   Click **Add**.
    *   **Type:** `TXT`
    *   **Name:** `@`
    *   **Value:** Paste the verification code from Firebase (e.g., `google-site-verification=...`).
    *   **TTL:** `1 Hour`.
    *   Click **Add Record**.
    *   *Wait 5-10 minutes, then click "Verify" in the Firebase Console.*

5.  **Add the A Records (Point Domain):**
    *   *Delete any existing "A" records with Name "@" if they point to generic parked pages.*
    *   Click **Add**.
    *   **Type:** `A`
    *   **Name:** `@`
    *   **Value:** Enter the **first IP address** provided by Firebase (e.g., `199.36.158.100`).
    *   **TTL:** `1 Hour`.
    *   Click **Add Record**.
    *   Repeat specifically for the **second IP address** provided by Firebase.

---

## Troubleshooting

-   **"Error: Plan 'spark' does not support Cloud Functions"**: Ensure you upgraded to the **Blaze** plan in the Firebase Console.
-   **"Error: 404 Not Found"**: If deployment succeeds but pages are missing, ensure `firebase.json` is correctly set to `"source": "."` (automatic with webframeworks).
-   **"Error: Billing not enabled"**: Required for Cloud Functions.

## Managing Updates
Whenever you make changes to the code:
1.  Review locally: `npm run dev`
2.  Deploy updates: `firebase deploy`

Done! Your site is now live at `https://itsectools.com`.
