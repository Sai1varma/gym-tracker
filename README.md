# 🏋️ GymLog — Gym Routine Tracker

A clean, minimal calendar-based gym tracker you can host for free on GitHub Pages. No backend, no login — your data lives in your browser's local storage.

## Features

- ✅ Log **workout days** with muscle group tags (Chest, Back, Shoulders, Arms, Legs, Core, Cardio, Full Body)
- ❌ Log **skipped days** with a reason (Sick, Travel, Rest day, etc.)
- 📝 Add free-text notes to any day
- 🔥 Live **streak counter** for consecutive workout days
- 📊 Monthly **consistency stats** (workouts, skips, percentage)
- 📅 Navigate between months
- 💾 All data stored locally in your browser — nothing sent to any server
- 📱 Fully **responsive** on mobile

---

## Setup on GitHub Pages (Step-by-Step)

### Step 1 — Create a GitHub Account
If you don't already have one, sign up at [github.com](https://github.com).

---

### Step 2 — Create a New Repository

1. Click the **+** icon (top-right) → **New repository**
2. Name it `gym-tracker` (or anything you like)
3. Set visibility to **Public**
4. Leave all other options as-is
5. Click **Create repository**

---

### Step 3 — Upload the Files

**Option A — Upload via browser (easiest):**

1. On your new repo page, click **uploading an existing file**
2. Drag and drop these three files:
   - `index.html`
   - `style.css`
   - `app.js`
3. Scroll down, add a commit message like `Add gym tracker files`
4. Click **Commit changes**

**Option B — Use Git (for developers):**

```bash
git clone https://github.com/YOUR_USERNAME/gym-tracker.git
cd gym-tracker
# Copy index.html, style.css, app.js into this folder
git add .
git commit -m "Add gym tracker"
git push origin main
```

---

### Step 4 — Enable GitHub Pages

1. In your repository, click the **Settings** tab (top menu)
2. In the left sidebar, click **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Under **Branch**, choose `main` and folder `/ (root)`
5. Click **Save**
6. Wait ~60 seconds, then refresh the page

Your site URL will appear at the top of the Pages settings — it looks like:
```
https://YOUR_USERNAME.github.io/gym-tracker/
```

Bookmark that link and open it on your phone too!

---

## How to Use

| Action | How |
|---|---|
| Log a workout | Click any day → pick ✅ Workout → select muscle groups → Save |
| Log a skip | Click any day → pick ❌ Skipped → select reason → Save |
| Edit an entry | Click a logged day → update fields → Save |
| Delete an entry | Click a logged day → click **Remove Entry** |
| Navigate months | Use the ← → arrows |

---

## Data & Privacy

All data is stored in your **browser's localStorage**. It never leaves your device. If you clear your browser data or switch browsers/devices, your entries will be gone. For a backup, you can open your browser's developer console and run:

```js
console.log(localStorage.getItem('gymlog_v1'));
```

Copy and save that JSON text somewhere safe to restore later.

---

## Tech Stack

Pure HTML, CSS, and vanilla JavaScript. No frameworks, no dependencies, no build tools.
