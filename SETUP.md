# EXP GRINDER — Setup & Deploy Guide

## What You'll Get
- Full game at **expgrinder.com** (or any domain)
- User login (email + Google OAuth)
- Auto-saved game state per user
- Free hosting on Vercel + Supabase

---

## Step 1: Create a Supabase Project (5 min)

1. Go to [supabase.com](https://supabase.com) and sign up (free)
2. Click **"New Project"**
3. Name it `exp-grinder`, set a database password (save it!), pick a region close to you
4. Wait for the project to finish creating (~1 min)

### Get your API keys:
1. Go to **Settings → API** in the sidebar
2. Copy **Project URL** (looks like `https://abcd1234.supabase.co`)
3. Copy **anon public** key (long string starting with `eyJ...`)
4. Save both — you'll need them in Step 3

### Run the database schema:
1. Go to **SQL Editor** in the sidebar
2. Click **"New Query"**
3. Paste the entire contents of `database-schema.sql`
4. Click **"Run"** — you should see "Success"

### Enable Google Login (optional but recommended):
1. Go to **Authentication → Providers** in the sidebar
2. Find **Google** and toggle it ON
3. You'll need a Google OAuth Client ID:
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create a new project (or use existing)
   - Go to **Credentials → Create Credentials → OAuth Client ID**
   - Type: Web Application
   - Authorized redirect URI: `https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback`
   - Copy the **Client ID** and **Client Secret**
4. Paste them into Supabase Google provider settings
5. Click **Save**

### Configure Auth redirect:
1. Go to **Authentication → URL Configuration**
2. Set **Site URL** to `http://localhost:3000` (change to your domain later)
3. Add `http://localhost:3000/auth/callback` to **Redirect URLs**

---

## Step 2: Set Up the Project Locally (3 min)

1. Unzip the project:
   ```bash
   unzip exp-grinder-project.zip
   cd exp-grinder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env.local` file:
   ```bash
   cp .env.local.example .env.local
   ```

4. Edit `.env.local` and paste your Supabase keys:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-key-here
   ```

5. Run locally:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) — you should see the login page!

---

## Step 3: Deploy to Vercel (3 min)

1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "EXP Grinder initial deploy"
   ```
   - Create a new repo on [github.com](https://github.com/new) called `exp-grinder`
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/exp-grinder.git
   git branch -M main
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) and sign up (free, use your GitHub account)

3. Click **"Add New Project"** → Import your `exp-grinder` repo

4. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL` → your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → your Supabase anon key

5. Click **"Deploy"** — wait ~1 min

6. Your game is live at `https://exp-grinder.vercel.app`!

---

## Step 4: Custom Domain (optional)

### Using expgrinder.com:
1. Buy the domain from [Namecheap](https://namecheap.com), [Google Domains](https://domains.google), or any registrar
2. In Vercel dashboard → your project → **Settings → Domains**
3. Add `expgrinder.com`
4. Update your domain's DNS to point to Vercel (they'll show you the records)
5. Update Supabase auth settings:
   - **Site URL**: `https://expgrinder.com`
   - **Redirect URLs**: add `https://expgrinder.com/auth/callback`

---

## Project Structure
```
exp-grinder/
├── app/
│   ├── layout.tsx          # Root layout (fonts, global styles)
│   ├── page.tsx            # Main page (auth check → game)
│   ├── login/
│   │   └── page.tsx        # Login/signup page
│   └── auth/
│       └── callback/
│           └── page.tsx    # Google OAuth redirect handler
├── components/
│   └── XPGrinder.jsx      # The full game (224KB)
├── lib/
│   └── supabase.ts         # Supabase browser client
├── middleware.ts            # Session refresh middleware
├── database-schema.sql     # Run this in Supabase SQL Editor
├── .env.local.example      # Copy to .env.local and fill in keys
├── package.json
├── next.config.js
└── tsconfig.json
```

---

## How Save/Load Works
- Game auto-saves to Supabase every **30 seconds**
- Players can also click **💾 SAVE** in the header manually
- On login, the saved state is loaded automatically
- Each user gets their own row in the `players` table
- New users automatically get a fresh starting state (4,000 coins, empty inventory)

---

## Troubleshooting

### "Invalid login credentials"
- Make sure you confirmed your email (check spam folder)

### Google login doesn't work
- Check that the redirect URI in Google Cloud Console matches your Supabase project
- Make sure Google provider is enabled in Supabase Authentication settings

### Game doesn't save
- Open browser console (F12) and check for errors
- Verify your Supabase URL and anon key are correct in `.env.local`
- Check that the `players` table exists in Supabase (run `database-schema.sql` again)

### Build fails on Vercel
- Make sure environment variables are set in Vercel project settings
- Check the build logs for specific errors

---

## Cost
- **Vercel**: Free (hobby plan, unlimited deploys)
- **Supabase**: Free (500MB database, 50,000 monthly active users, 5GB bandwidth)
- **Domain**: ~$10/year if you want a custom domain

You can run this for **thousands of users** completely free!
