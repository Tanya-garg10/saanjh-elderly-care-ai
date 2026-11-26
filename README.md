<div align="center">

# 🌿 Saanjh – Voice-First AI Elderly Care & Family Coordination

### *Care that stays close, even when family can't.*

**Empowering seniors to live independently while staying connected with the people who care.**

</div>

---

## 📌 About Saanjh

**Saanjh** is a voice-first elderly care and family coordination platform designed to make everyday care simpler, more accessible, and more connected.

Many elderly people live independently while their family members stay in different cities or locations. Managing medicines, remembering doctor appointments, maintaining daily routines, and communicating wellbeing updates can become challenging.

Saanjh addresses these challenges through an accessible digital platform that brings essential care activities together while respecting the privacy, dignity, and independence of senior citizens.

Unlike conventional monitoring-focused solutions, Saanjh follows a **consent-first approach**, allowing seniors to decide what personal care information they want to share with their family members.

---

## 🎯 Problem Statement

Elderly people living independently often face difficulties with:

- Remembering daily medicines and schedules.
- Managing doctor appointments and medical records.
- Maintaining consistent daily routines.
- Communicating their wellbeing to distant family members.
- Using complicated digital applications.
- Maintaining privacy while receiving family support.

Families, meanwhile, may experience uncertainty about their loved ones' everyday care and struggle to coordinate responsibilities remotely.

There is a need for a simple, accessible, and privacy-conscious elderly care solution.

---

## 💡 Our Solution

Saanjh provides a unified elderly care experience through voice interaction, daily care management, wellbeing tracking, and consent-based family coordination.

The platform is designed around three principles:

- **Independence:** Help seniors manage their everyday activities.
- **Connection:** Make family coordination easier.
- **Privacy:** Keep seniors in control of their personal information.

---

## ✨ Key Features

### 1. 👵 Senior Dashboard
- Personalized dashboard for senior citizens.
- Daily activity overview.
- Medicine reminders and upcoming appointments.
- Quick access to important care activities.
- Simple navigation and senior-friendly interface.

### 2. 💊 Smart Medicine Management
- Add, edit, and manage medicines.
- Configure medicine schedules and dosage instructions.
- View upcoming reminders.
- Record user-confirmed medicine completion.
- Review medicine activity history.

### 3. 🩺 Doctor Appointment Management
- Schedule doctor appointments.
- Store doctor and clinic details.
- View upcoming and past appointments.
- Maintain appointment notes.
- Organize important medical visit information.

### 4. 🎙️ Voice-First AI Assistant
- Natural voice-based interaction powered by Gemini AI.
- Support for English, Hindi, and Hinglish.
- Ask questions about daily schedules.
- Access relevant medicine and appointment information.
- Text-based fallback for unsupported voice environments.

### 5. 💚 Daily Wellbeing Check-ins
- Record daily wellbeing and mood.
- Add optional personal notes.
- Maintain check-in history.
- Review personal wellbeing trends.

### 6. 👨‍👩‍👧 Family Dashboard
- Dedicated family member interface.
- View senior care updates that have been permitted.
- Review shared appointments and wellbeing information.
- Stay connected with everyday care activities.

### 7. 🔐 Privacy & Consent Center
- Individual information-sharing preferences.
- Control visibility of medicine updates.
- Manage appointment information sharing.
- Control wellbeing and activity updates.
- Revoke sharing permissions at any time.

> **Privacy Principle:** Family access strictly follows the permissions granted by the senior.

### 8. 🆘 One-Tap Help
- Easily accessible help-request option.
- Create an instant help request.
- Add an optional reason or message.
- Review help-request status.

### 9. 📊 Smart Routine Insights
- Identify changes in recorded daily activities.
- Review missed check-ins.
- View routine completion summaries.
- Understand changes through transparent observations.

### 10. ♿ Accessibility Features
- Clear, readable typography.
- Senior-friendly navigation.
- Larger interface controls and touch targets.
- High-contrast color palettes.
- Reduced-motion support.
- Voice-enabled hands-free navigation.

### 11. 📅 Smart Daily Routine Planner
- Organize daily activities.
- View medicine schedules and appointments in one place.
- Manage personal reminders.
- Track completed activities.

### 12. 👨‍👩‍👧 Family Care Circle
- Coordinate caregiving responsibilities across family members.
- Organize family visits.
- Assign care-related tasks.
- View task completion status.

### 13. 📄 Health Document Vault
- Organize prescriptions and medical documents.
- Categorize documents cleanly.
- Store document descriptions and dates.
- Manage document-sharing preferences.

### 14. 🩺 AI Doctor Visit Preparation
- Prepare for upcoming doctor appointments.
- Organize user-reported symptoms and concerns.
- Auto-generate relevant questions to discuss with the doctor.
- Generate an editable appointment preparation summary.

### 15. 📝 Voice Notes to Smart Tasks
- Convert spoken or typed notes into structured tasks.
- Extract available date and time information.
- Review and confirm tasks before saving.
- Simplify everyday task management.

---

## 🖥️ User Roles

| Role | Purpose |
|---|---|
| **Senior Citizen** | Manage daily care, reminders, appointments, and wellbeing independently |
| **Family Member** | View permitted updates and coordinate caregiving support |

---

## 🔄 How Saanjh Works

1. **Dashboard Access:** The senior opens Saanjh and accesses their personalized dashboard.
2. **Daily Overview:** They review daily medicines and upcoming appointments.
3. **Wellbeing Check-in:** They complete a quick mood and wellbeing check-in.
4. **Voice Interaction:** They interact with the AI voice assistant for queries or notes.
5. **Privacy Controls:** They manage what information is shared with family members.
6. **Family Collaboration:** Family members view permitted updates and coordinate care tasks.

---

## 🎨 UI/UX Design Philosophy

Saanjh follows a human-centered design approach tailored for older adults.

- **Warm & Calming Palette:** Warm ivory and muted sage-green tones to feel approachable, not clinical.
- **Clutter-Free Interface:** Minimal, clean layouts with strong visual hierarchy.
- **Accessible Typography & Touch Targets:** Large, legible text and easy-to-click buttons.
- **Multimodal Support:** Full support for both voice input and touch/keyboard input.
- **Responsive Layout:** Optimized across desktop, tablet, and mobile displays.

---

## 🛠️ Technology Stack

| Category | Technology | Description |
|---|---|---|
| **Frontend** | React 19, TypeScript | Reactive modern UI framework |
| **Build Tool** | Vite | Lightning-fast module bundler & dev server |
| **Styling** | Tailwind CSS v4, Motion | Modern utility styling & smooth micro-animations |
| **AI / LLM** | Google Gemini API (`@google/genai`) | Voice reasoning, appointment prep, and task extraction |
| **Icons** | Lucide React | Clean, senior-friendly icons |
| **Charts** | Recharts | Visual wellbeing & routine insight charts |
| **Voice / Speech** | Web Speech API | Speech recognition & speech synthesis |
| **Storage** | LocalStorage / State Management | Persistent local preferences and demo records |
| **Version Control** | Git & GitHub | Source code management |

---

## 🏗️ System Architecture

```text
                    SAANJH
                       │
          ┌────────────┴────────────┐
          │                         │
     Senior Portal              Family Portal
          │                         │
          └────────────┬────────────┘
                       │
                Core Application
                       │
       ┌───────────────┼───────────────┐
       │               │               │
   Care Manager    Voice Assistant   Privacy Center
   (Reminders &    (Gemini-Powered   (Granular Sharing
   Appointments)    Multimodal)        Permissions)
       │               │               │
       └───────────────┼───────────────┘
                       │
               Insights & Data
         (Recharts & Local Storage)
```

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) (v18+ recommended)
- `npm` or `pnpm`
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/saanjh-elderly-care-ai.git
cd saanjh-elderly-care-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Open in Browser

Visit:
```text
http://localhost:3000
```
*(or the local port shown in your terminal)*

### 6. Build for Production

```bash
npm run build
```

---

## 🎬 Demo Walkthrough

Recommended demonstration flow:

1. **Explore the Landing View:** Overview of Saanjh's core mission.
2. **Senior Dashboard:** Check daily schedule, medicine reminders, and upcoming doctor visits.
3. **Smart Medicine Management:** Mark medicine as taken and view schedules.
4. **Voice Assistant:** Ask questions in Hindi/English about medications or routines.
5. **Wellbeing Check-in:** Log today's mood and record notes.
6. **Privacy & Consent Settings:** Toggle sharing permissions for family members.
7. **Family Dashboard:** Switch to family view and verify only permitted records are visible.
8. **Care Circle Coordination:** View assigned tasks and caregiver notes.

---

## 🔒 Privacy, Safety & Limitations

- **Human Confirmation:** Medicine logs and routine updates are confirmed by the user; this is not an automated medical diagnostic device.
- **Privacy First:** Data sharing follows strict consent preferences set by the senior user.
- **Non-Emergency Disclaimer:** Saanjh is a daily care and coordination companion, not a substitute for professional healthcare, emergency 911/112 services, or licensed medical advice.

---

## 🔮 Roadmap & Future Enhancements

- [ ] Expanded regional language support (Tamil, Telugu, Bengali, Marathi, Gujarati).
- [ ] Direct WhatsApp / SMS notifications for family care circle alerts.
- [ ] Secure cloud synchronization with end-to-end encrypted medical vaults.
- [ ] Smart wearable device integration for heart rate and fall detection telemetry.
- [ ] Offline-first PWA (Progressive Web App) support.

---

## ❤️ Vision

> **"Care that stays close, even when family can't."**  
> Saanjh is built to empower seniors with independence, preserve their dignity through privacy, and give families peace of mind.

---

<p align="center">
  <b>Built with care, for the people who cared for us. 🌿</b>
</p>
