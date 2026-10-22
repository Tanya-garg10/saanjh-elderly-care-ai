# Saanjh (सांझ) — AI-Powered Voice-First Elderly Care & Family Coordination

> **"Care that stays close, even when family can't."**

[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)](#)
[![React](https://img.shields.io/badge/Framework-React%2019-61dafb)](#)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38b2ac)](#)
[![Privacy](https://img.shields.io/badge/Core%20Differentiator-Consent%20Before%20Care-65866E)](#)

## 1. Problem Statement

Millions of senior citizens live independently in cities across India and globally while their adult children work in other cities or countries. Existing digital health solutions present steep hurdles:

- **Overcomplicated interfaces:** Small text, confusing hierarchical menus, and cluttered dashboards alienate elderly users.
- **Language barriers:** Most healthcare software lacks natural conversational interaction in regional languages like Hindi.
- **Privacy friction vs. constant surveillance:** Current "family monitoring" apps treat seniors as surveillance subjects rather than autonomous individuals, generating resentment and breach of trust.

## 2. The Saanjh Solution

**Saanjh** reimagines elderly care through a voice-first, warm, and dignified experience grounded in our core ethos: **"Consent Before Care"**.

Rather than constant surveillance, Saanjh puts the senior in complete command:

1. **Voice-First & Multilingual:** Seniors can speak naturally in **Hindi** or **English** (e.g. *"Meri agli medicine kab hai?"* or *"When is my next appointment?"*).
2. **Simplified Daily Routine:** Clear medicine schedules, large touch targets, one-tap "Mark as Taken" confirmations, and daily wellbeing reflections.
3. **Consent-Gated Family Coordination:** Seniors decide exactly which categories of information are shared with family (Medicine status, Wellbeing summaries, Appointments, Timeline). If permission is withheld, family dashboards respect that choice unconditionally.
4. **Accessible Healthcare UX:** Warm sage green and cream palette, high contrast mode, dynamic font scaling (Standard, Large, Extra Large), and calming audio feedback.

## 3. Core Differentiator: Consent Before Care

In typical tracking apps, all data is shared by default. In Saanjh:

- **Default-OFF Sharing:** Optional data sharing defaults to strictly private (`false`).
- **Single Source of Truth:** The Family Dashboard queries the senior's active consent configuration.
- **Granular Control:** Medicine status, wellbeing summaries, appointments, and activity logs have independent toggles.
- **Private Audio:** Voice assistant conversation transcripts and audio recordings are **never shared** with family members.
- **Audit Logging:** Every grant or revocation is recorded transparently in the senior's Privacy Center audit log.

## 4. Key Working Features (Current MVP)

| Feature | Status | Description |
|---|---|---|
| **1. One-Tap Help** | ✅ Working (Demo Flow) | Prominent, high-visibility "I Need Help" button on Senior Dashboard. Confirmation modal displays configured emergency contacts, one-tap demo alert trigger with active status tracking, simulated call option, and resolution controls. Transparent non-emergency disclaimer. |
| **2. Offline-First Experience** | ✅ Working (Local) | All medicine schedules, appointments, and wellbeing records persist in `localStorage`. Live network detection with an honest Online/Offline badge and explanatory popover distinguishing local browser data from cloud sync. |
| **3. Routine Change Insights** | ✅ Working (Rule-based) | Transparent, non-diagnostic analysis of check-ins and medication records. Displays neutral observations ("Routine change worth checking") with exact reasons and dates once ≥3 logs exist. Strictly consent-gated in Family Dashboard. |
| **4. Hinglish Voice Assistant** | ✅ Working (Speech & NLP) | Natural language voice interaction recognizing English, pure Hindi, and Hinglish phrases (e.g., *"Aaj ki dawai batao"*, *"Next appointment kab hai?"*, *"Mujhe help chahiye"*, *"Privacy change karni hai"*). Web Speech API recognition & synthesis with instant fallback to text. Graceful mic denial handling. |
| **5. Granular Consent & Revocation** | ✅ Working | Detailed per-category sharing toggles (Medicines, Wellbeing Summaries, Appointments, Activity Log). Explicit breakdown of what is shared vs. what is NEVER shared (private notes and voice transcripts). Real-time reflection across Senior & Family dashboards. |
| **6. Accessibility Mode** | ✅ Working | Visible toggle in Topbar & Settings. Provides enlarged 19px typography, high contrast borders, large ≥52px touch-friendly targets, and reduced motion overrides. Persisted in settings. |
| **Welcome & Persona Switcher** | ✅ Working | Seamless switching between Senior persona (*Meera Sharma*, age 74) and Family persona (*Ananya Sharma*, daughter). |
| **Medicine Routine CRUD** | ✅ Working | Add, edit, delete, time slot filter (Morning / Afternoon / Evening / Night), reminder times, and large touch "Mark as Taken" button. |
| **Doctor Appointments** | ✅ Working | Clinic location, date & time, doctor name, prep notes, upcoming vs. past visit separation. |
| **Daily Wellbeing Check-ins** | ✅ Working | 3 accessible feelings (*Feeling Well*, *Feeling Okay*, *Need Support*), optional private notes, weekly distribution breakdown. |
| **Family Care Dashboard** | ✅ Working | Strictly consent-gated overview showing shared adherence percentage, wellbeing status, routine insights (if consented), and authorized activity timeline. |
| **Privacy & Consent Center** | ✅ Working | Prominent "Your privacy. Your choice." interface with granular toggles, instant access revocation, and consent change audit trail. |

## 5. Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 8 |
| **Styling** | Tailwind CSS v4 (customized: Sage Green `#65866E`, Deep Forest `#294B3A`, Warm Cream `#F8F7F1`, Soft Peach `#F3DCCB`) |
| **Animations** | Motion (Framer Motion successor) |
| **Icons** | Lucide React |
| **Voice & Speech** | Web Speech API (`webkitSpeechRecognition` & `speechSynthesis`) with Hindi (`hi-IN`) and Indian English (`en-IN` / `en-US`) calibration |
| **AI / LLM** | `@google/genai` SDK (Gemini API, server-side proxy ready) |
| **Backend Proxy** | Express.js + dotenv (for API key protection) |
| **Data Persistence** | Client-side `localStorage` engine with default initialization and schema validation |

## 6. Project Structure

```
saanjh/
├── index.html                  # HTML entry point with Plus Jakarta Sans & Noto Sans Devanagari
├── metadata.json               # Applet configuration & permissions
├── package.json                # Project dependencies
├── vite.config.ts              # Vite configuration
├── .env.example                # Environment variable template
├── src/
│   ├── main.tsx                # React root mount
│   ├── App.tsx                 # View router and layout orchestration
│   ├── index.css               # Design system, theme variables & accessibility classes
│   ├── types/
│   │   └── index.ts            # Complete TypeScript contracts & interfaces
│   ├── data/
│   │   ├── demoData.ts         # Fictional sample dataset (Meera Sharma & Ananya Sharma)
│   │   └── translations.ts     # Comprehensive English & Hindi bilingual localization
│   ├── services/
│   │   ├── storage.ts          # Resilient localStorage persistence layer
│   │   ├── voiceService.ts     # Web Speech API recognition & speech synthesis
│   │   └── assistantService.ts # Context-aware natural language intent processor
│   ├── context/
│   │   └── AppContext.tsx      # Global store, CRUD actions, single source of consent truth
│   ├── components/
│   │   ├── AppLayout.tsx       # Responsive app shell & banner
│   │   ├── Sidebar.tsx         # Accessible navigation & role switcher
│   │   ├── Topbar.tsx          # Dynamic greetings, accessibility & notification drawer
│   │   ├── StatCard.tsx        # Visual metric cards
│   │   ├── MedicineCard.tsx    # Large-button medicine card with adherence confirmation
│   │   ├── AppointmentCard.tsx # Doctor visit card with clinic directions & notes
│   │   ├── ConsentToggle.tsx   # Granular privacy switch with recipient info
│   │   ├── EmptyState.tsx      # Friendly empty states with clear CTAs
│   │   ├── Modal.tsx           # Accessible dialog with keyboard trapping
│   │   ├── Toast.tsx           # Non-intrusive feedback toasts
│   │   └── VoiceAssistantModal.tsx # Interactive voice chat room with live waveform
│   └── pages/
│       ├── Welcome.tsx         # Landing screen with role selection
│       ├── SeniorDashboard.tsx # Today's overview, 1-click wellbeing & schedule
│       ├── Medicines.tsx       # Medicine CRUD & time-of-day filters
│       ├── Appointments.tsx    # Doctor visit management
│       ├── Wellbeing.tsx       # Daily check-in & trend analysis
│       ├── FamilyDashboard.tsx # Consent-restricted family view
│       ├── PrivacyCenter.tsx   # Granular privacy controls & audit log
│       ├── VoiceAssistant.tsx  # Dedicated voice assistant view
│       └── Settings.tsx        # Accessibility, language & data reset
```

## 7. How to Run Locally

### Prerequisites

- Node.js 18+ or 20+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd saanjh

# Install dependencies
npm install

# Copy environment variables and add your Gemini API key (optional for demo)
cp .env.example .env

# Start development server
npm run dev
```

Open `http://localhost:3000` in **Google Chrome** or **Microsoft Edge** (recommended for native Web Speech API support).

> **Note:** The app runs fully in demo mode without a Gemini API key. Set `VITE_GEMINI_API_KEY` in `.env` to enable live AI-powered voice responses.

### Production Build

```bash
npm run build
npm run preview
```

## 8. Future Roadmap

- [ ] **Secure Firebase Authentication & Cloud Firestore:** Encrypted user accounts and multi-user family linkage.
- [ ] **Server-Side Gemini API Integration:** Multi-turn conversational reasoning, medication interaction safety checks, and automatic speech transcription.
- [ ] **WhatsApp & SMS Push Reminders:** Optional fallback reminders for seniors without active browser tabs (via Twilio / WhatsApp Business API).
- [ ] **WebRTC Voice Bridge:** Direct 1-tap private voice calls between senior and family coordinator.
- [ ] **Smart Wearables Integration:** Sync with blood pressure monitors and step trackers with senior authorization.

## Built with ❤️ for dignity, autonomy, and family peace of mind.

> *"Saanjh" (सांझ) means twilight in Hindi — the quiet, golden hour when family gathers. We built this for every elder waiting for that call.*

