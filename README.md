# FocusMirror

See how well you are really concentrating, and rest at the right time, using only your smartphone.

FocusMirror uses the front camera to estimate your focus level while you study or work, suggests breaks when it detects fatigue, and tracks your sessions, streaks and weekly trends. All analysis runs on the device; video is never stored or sent anywhere.

> **Status:** early development. The app shell, sign-in, home dashboard, settings and camera preview work. Focus detection from the camera is not implemented yet, so sessions are currently created from the Admin screen.

## Features

- **Sign in** with email and password (Supabase Auth); the app is locked until you sign in
- **Home dashboard**: usage-streak calendar, last session summary, and a 7-day focus chart
- **Start session**: live front-camera preview with permission handling
- **Settings**: profile, password, daily goal, fatigue sensitivity, camera calibration, notifications, theme (light/dark/system), language, data export and history clearing
- **Admin tools**: adjust the streak and make up sessions for testing
- **English and Japanese**, following the device language or a chosen one

## Tech stack

- [Expo](https://expo.dev) SDK 57 with [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing, native tabs)
- React Native, TypeScript, React Compiler
- [Supabase](https://supabase.com) for authentication
- `expo-camera`, `expo-notifications`, `expo-haptics`, `react-native-reanimated`
- AsyncStorage for on-device data (sessions, streak, preferences)

## Getting started

### Prerequisites

- Node.js (LTS)
- [Expo Go](https://expo.dev/go) on your phone, or an Android emulator / iOS simulator
- A free [Supabase](https://supabase.com) project

### 1. Install

```bash
git clone https://github.com/knot1342/FocusMirror.git
cd FocusMirror
npm install
```

### 2. Configure Supabase

Copy the example env file and fill in your project's values:

```bash
cp .env.example .env.local
```

| Variable | Where to find it |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Project Settings → Data API → Project URL (base URL only, e.g. `https://abcd.supabase.co`) |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API Keys → publishable (or legacy `anon`) key |

Never use the `service_role` / secret key in the app. `.env.local` is git-ignored.

### 3. Create a user

In the Supabase dashboard:

1. **Authentication → Users → Add user → Create new user**, tick **Auto Confirm User**.
2. Optional: **Authentication → Sign In / Providers** → turn off **Allow new users to sign up** if only your own accounts should exist.

### 4. Run

```bash
npx expo start
```

Then scan the QR code with Expo Go, or press `a` (Android), `i` (iOS) or `w` (web). After changing `.env.local`, restart with `npx expo start --clear`.

The camera needs a real device; simulators and the web build show no preview.

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start the Expo dev server |
| `npm run android` / `ios` / `web` | Start and open on a platform |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Type-check |
| `npx expo install <package>` | Add a package at the version matching the Expo SDK |

## Project structure

```
src/
├── app/                 # Screens (Expo Router)
│   ├── _layout.tsx      # Root stack, auth guard, theme and language providers
│   ├── index.tsx        # Sign-in screen
│   ├── (tabs)/          # Bottom tabs: home, results, session
│   ├── settings.tsx     # Settings and its sub-screens (theme, daily-goal, calibrate, ...)
│   └── admin.tsx        # Admin tools
├── components/          # Home cards, settings list, side menu, themed primitives
├── hooks/               # Stores: auth, sessions, streak, preferences, account, theme
├── lib/                 # Supabase client, notifications, session sounds
├── i18n/                # Translations (en, ja) and language provider
└── constants/theme.ts   # Colors, accent, spacing
```

## Privacy

Camera frames are processed on the device only. Sessions, streak and preferences are stored locally with AsyncStorage; only sign-in goes through Supabase. Settings → Export my data shares everything stored on the device as JSON.

## Roadmap

- On-device focus detection (face, gaze and posture) during sessions
- Session reports on the Result tab
- Rest reminders and posture warnings during sessions
- Syncing sessions to Supabase across devices
