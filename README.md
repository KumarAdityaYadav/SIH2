# 🌸 StreeSure (स्त्री-श्योर) - AI-Assisted Women's Health & PCOS Care Ecosystem

> **Multilingual AI-Assisted Triage, 3D Anatomical Education, Voice Saathi, and Clinical Care Navigation Platform for PCOS / PCOD**

---

## 📌 Overview

**StreeSure** is an end-to-end digital health platform designed to democratize early screening, awareness, and lifestyle management for Polycystic Ovary Syndrome (PCOS/PCOD) across urban, semi-urban, and rural populations in India.

By pairing clinical guidelines (Rotterdam 2023 criteria) with **Google Gemini AI (`gemini-2.5-flash`)**, WebGL 3D interactive anatomical models, and multi-dialect voice assistants, StreeSure bridges the gap between fear, misinformation, and clinical care.

---

## ✨ Core Features

1. **🔬 Evidence-Based Clinical Risk Screening**:
   - 3-Minute non-invasive questionnaire assessing Rotterdam 2023 criteria (hyperandrogenism, ovulatory dysfunction, polycystic ovarian morphology).
   - Generates an instant Clinical Triage PDF Report with symptom severity scores and suggested lab investigations (LH/FSH ratio, Fasting Insulin, AMH, DHEA-S).

2. **🎙️ Voice Saathi AI (Multilingual Health Companion)**:
   - Voice-enabled medical conversational assistant powered by Google Gemini.
   - Supports **English, Hindi (हिन्दी), Bengali (বাংলা), Marathi (मराठी), Tamil (தமிழ்), and Telugu (తెలుగు)**.
   - Built-in speech synthesis, push-to-talk recognition, and structured action routing.

3. **🧬 Interactive 3D WebGL Anatomical Model**:
   - Interactive Three.js 3D rendering of healthy ovaries vs. polycystic ovaries (string-of-pearls appearance).
   - Real-time follicle inspection, cross-section toggles, and educational tooltips.

4. **📈 Daily Biometric Progress Tracker**:
   - Log daily telemetry: water intake, sleep duration, stress levels, daily steps, and symptom severity (acne, bloating, mood fluctuations).
   - Visual 30-day symptom reduction analytics and clinical export.

5. **🧘‍♀️ Low-Cortisol Exercise & Yoga Portal**:
   - Guided routines focusing on low-cortisol workouts: progressive resistance training (activating GLUT4 glucose transporters) and restorative pelvic yoga (*Supta Baddha Konasana*, *Malasana*).

6. **🌿 Evidence-Based Home Remedies Portal**:
   - Curated herbal formulations with clinical backing: Spearmint tea (anti-androgenic), overnight soaked fenugreek/methi seeds (insulin sensitivity), Ceylon cinnamon, and Ashwagandha.

7. **👥 Multi-Role Stakeholder Workflows**:
   - **Beneficiary / Woman**: Self-screening, cycle logs, and consultations.
   - **ASHA Health Worker (Sangini)**: Offline-first rural survey mode and community camp registration.
   - **Gynecologist / Doctor**: Doctor consultation dashboard (₹199 digital appointments), patient report review.
   - **NGO / Health Administrator**: Public health epidemiology charts and regional risk heatmaps.

8. **🔐 Secure Authentication & Mobile OTP Gateway**:
   - Password and passwordless mobile OTP sign-in/sign-up.
   - Evaluator 1-click profiles for quick hackathon demonstrations.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons, Canvas Confetti
- **3D Graphics**: Three.js / WebGL
- **Backend**: Node.js, Express, TypeScript (`tsx` dev runner, `esbuild` production bundler)
- **AI & LLM**: Google GenAI SDK (`@google/genai`) with `gemini-2.5-flash`
- **Localization**: Native multilingual dictionary covering 6 Indian languages

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) (version 9 or higher)
- A **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/streesure.git
   cd streesure
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY="your_actual_gemini_api_key_here"
   NODE_ENV="development"
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

5. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 📁 Project Structure

```
├── public/                 # Static assets and icons
├── src/
│   ├── components/         # Modular React components
│   │   ├── AuthModal.tsx          # Sign In / Sign Up & OTP Modal
│   │   ├── VoiceSaathiModal.tsx   # Multilingual Voice AI assistant
│   │   ├── Ovary3DModal.tsx       # 3D Three.js Ovarian Model
│   │   ├── ProgressTracker.tsx    # Daily symptom & biometric tracker
│   │   ├── ExercisePortal.tsx     # Low-cortisol workouts & yoga
│   │   ├── HomeRemediesPortal.tsx # Evidence-based natural remedies
│   │   ├── ScreeningModal.tsx     # Rotterdam 2023 risk assessment
│   │   ├── DoctorConsultModal.tsx # Gynecologist teleconsultation
│   │   └── ...
│   ├── data/               # Seed data & clinical reference criteria
│   ├── services/           # Translations & audio synthesis services
│   ├── types.ts            # Global TypeScript definitions
│   ├── App.tsx             # Main application component
│   └── main.tsx            # React application entry point
├── server.ts               # Express backend with Gemini API proxy
├── vite.config.ts          # Vite configuration
└── package.json            # Scripts and dependencies
```

---

## 🛡️ Medical Disclaimer

*StreeSure is an educational awareness, symptom tracking, and non-diagnostic risk screening tool based on the Rotterdam 2023 criteria. It does not provide formal medical diagnoses or replace direct clinical evaluation by a certified gynecologist or endocrinologist.*

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

## Phase 2 — Persistent backend

StreeSure now includes a small file-backed persistence adapter for the MVP. It stores users, health profiles and screening results under `server/data/streesure-db.json` and exposes:

- `POST /api/users`
- `GET /api/users/:userId/profile`
- `PUT /api/users/:userId/profile`
- `POST /api/users/:userId/screenings`
- `GET /api/users/:userId/screenings`

This adapter is intentionally dependency-free for local development. For production, replace it with PostgreSQL/Supabase and add proper authentication, authorization, encryption, audit logging and retention controls.

## Phase 4 — Care Coordination

StreeSure now includes a file-backed care-coordination layer for the MVP flow: beneficiary registration/consent -> ASHA case assignment -> doctor referral -> persisted consultation -> doctor notes sent back to the patient record.

Endpoints:
- `POST /api/care-cases`
- `GET /api/care-cases`
- `PATCH /api/care-cases/:caseId`
- `POST /api/consultations`
- `GET /api/consultations`
- `PATCH /api/consultations/:consultationId`

For production, replace file-backed storage with a secured database and enforce server-side authentication, role-based authorization, consent/audit logging, encryption, and minimum-necessary data access before handling real health information.

## Phase 5 — Smart Kit Device Integration (Research Prototype)

StreeSure now supports a browser-side Web Bluetooth provider in addition to the deterministic demo adapter.

### Device protocol contract

The prototype expects a BLE GATT service and characteristic (configurable through `.env`):
- `VITE_STREESURE_BLE_SERVICE_UUID`
- `VITE_STREESURE_BLE_CHARACTERISTIC_UUID`

The characteristic returns UTF-8 JSON, either as a single measurement or:

```json
{
  "measurements": [
    {
      "parameter": "GLUCOSE",
      "value": 98,
      "fastingStatus": "FASTING",
      "qualityStatus": "VALID",
      "firmwareVersion": "0.1.0"
    }
  ]
}
```

Supported parameters: `GLUCOSE`, `TRIGLYCERIDES`, `TOTAL_CHOLESTEROL`, `HDL`, `LDL`.

The app validates measurements locally and the backend performs a second plausibility validation before persistence at `POST /api/hardware/measurements`.

**Important:** this does not make the hardware clinically validated. The current BLE implementation is a software integration layer for a research prototype. Real firmware, sensor calibration, electrical safety, analytical validation, clinical validation, cybersecurity, and regulatory work are still required before clinical use.

## Phase 7 — Security, consent and privacy

Phase 7 adds request IDs, API rate limiting, security headers, explicit health-data consent records, audit events that avoid storing health payloads, data export and deletion endpoints, and optional AES-256-GCM encryption at rest for health profiles, screening results and hardware measurements.

For production, set `STREESURE_ENCRYPTION_KEY` to a strong secret and move the storage adapter from the development JSON store to a managed PostgreSQL/Supabase deployment with encrypted backups, least-privilege credentials, TLS, secret management, monitoring and a formal privacy/retention policy. The current file store remains a development adapter and must not be used as the final repository for real patient data.

## Phase 8: Production Database & Server Authentication

StreeSure now includes a provider-neutral database layer that can use Supabase PostgreSQL when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are configured. Without those variables it keeps the encrypted file-backed development store. The server also exposes password-based authentication with scrypt password hashing and HttpOnly session cookies. See `server/schema.sql` and `PHASE-8-DEPLOYMENT.md`.


## Phase 13 — Model evaluation & clinical safety

See `PHASE-13-MODEL-EVALUATION.md`. The application now validates required screening inputs before using the ML signal and exposes `POST /api/screening/safety`.
