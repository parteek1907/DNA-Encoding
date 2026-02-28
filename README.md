# 🧬 DNA Encoding — Interactive DNA Data Storage Simulator

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**An interactive, full-stack educational simulator for DNA-based data storage — encode text into DNA sequences, visualize the helix, decode it back, and save your custom mappings.**

[Live Demo](#-deployment) · [Getting Started](#-getting-started) · [How It Works](#-how-it-works) · [Features](#-features)

</div>

---

## 📌 Project Overview

DNA Encoding is a modern Single Page Application (SPA) that simulates the emerging field of **DNA-based digital data storage**. It provides an interactive, educational environment where users can input any text and watch it transform into a DNA nucleotide sequence in real time, configure custom base mappings (e.g., which 2-bit binary chunk maps to A, T, C, or G), decode raw binary sequences back into readable text, save and reload simulation presets to a persistent database, and visualize the DNA strand through a live animated SVG helix.

This project was built as an academic assignment on DNA-based data storage and significantly extends the original brief, moving well beyond a basic HTML file into a production-grade, full-stack TypeScript application.

---

## 🧬 How It Works

The encoding and decoding pipeline follows a clean, deterministic algorithm.

### Encoding (Text → DNA)

**Text to Binary** — Each character is converted to its 8-bit ASCII binary representation. For example, the letter `A` becomes `01000001`.

**Binary Chunking** — The 8-bit string is split into four 2-bit chunks: `01`, `00`, `00`, `01`.

**DNA Mapping** — Each 2-bit chunk is mapped to a nucleotide base using the user-defined mapping dictionary. The default mapping is:

| 2-bit Chunk | DNA Base |
|:-----------:|:--------:|
| `00`        | A        |
| `01`        | C        |
| `10`        | G        |
| `11`        | T        |

**Sequence Assembly** — The resulting bases are assembled into a continuous DNA strand and rendered visually on screen.

### Decoding (Binary → Text)

Decoding reverses the process — the app reads the binary stream 8 bits at a time, converts each group back to its integer value, and resolves it to the corresponding ASCII character. The app enforces that no two bases share the same 2-bit mapping, ensuring every encoding is losslessly reversible.

---

## ✨ Features

**Dual Mode Simulator** — Switch between Encode (Text → DNA) and Decode (Binary → Text) modes from a single interface.

**Real-Time Base Mapping Configuration** — Edit the 2-bit-to-nucleotide mapping table with live validation that prevents two bases from sharing the same chunk.

**Animated DNA Visualization** — An interactive SVG-based DNAStrand component renders the synthesized sequence as a double helix using Framer Motion animations that respond instantly to input changes.

**Preset Saving & Loading** — Save any combination of text input and DNA mappings to the database. Load or delete past simulations from a dedicated modal at any time.

**Educational Insights Panel** — Real-time statistics including DNA sequence length, nucleotide composition, and dynamic status indicators that mirror real-world DNA synthesis tooling.

**In-Memory Fallback** — No database setup required. The app automatically falls back to an in-memory store if no `DATABASE_URL` is provided.

**Type-Safe Core Logic** — TypeScript enforces that all binary conversion and mapping operations only work with `A`, `C`, `G`, `T` literal types, eliminating an entire category of runtime bugs.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend Framework** | React 18 | Component-based UI with hooks |
| **Language** | TypeScript 5 | Full-stack type safety |
| **Styling** | Tailwind CSS + clsx | Utility-first responsive design |
| **UI Components** | shadcn/ui (Radix UI) | Accessible modals, inputs, buttons |
| **Animations** | Framer Motion | DNA helix rendering & transitions |
| **Routing** | wouter | Lightweight hook-based client routing |
| **Data Fetching** | TanStack React Query | Server state, caching, mutations |
| **Backend** | Node.js + Express | REST API & static file serving |
| **ORM** | Drizzle ORM | Type-safe PostgreSQL schema & queries |
| **Validation** | Zod | Runtime API request validation |
| **Bundler** | Vite | Frontend bundling & HMR |
| **Database** | PostgreSQL (optional) | Persistent simulation storage |

---

## 📁 Project Structure

```
dna-encoding/
├── client/
│   └── src/
│       ├── components/         # Reusable UI components
│       │   └── DNAStrand.tsx   # Animated SVG DNA helix component
│       ├── pages/
│       │   └── Simulator.tsx   # Main simulator page
│       ├── hooks/              # Custom React hooks
│       └── App.tsx             # Root app with routing
├── server/
│   ├── index.ts                # Express server entry point
│   ├── routes.ts               # API route definitions
│   ├── storage.ts              # DB / in-memory storage abstraction
│   └── db.ts                   # Drizzle ORM database connection
├── shared/
│   └── schema.ts               # Shared DB schema, Zod validators & TS types
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v20 or higher
- npm (bundled with Node.js)

### Installation & Local Run

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/dna-encoding.git
cd dna-encoding

# 2. Install all dependencies
npm install

# 3. Start the development server
npm run dev
```

Open your browser at **http://localhost:5000**. The app runs immediately using in-memory storage — no database required.

### Optional: Enable Persistent Storage (PostgreSQL)

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dna_encoding
```

Then push the schema:

```bash
npm run db:push
```

---

## 🌐 Deployment

This project includes a Node.js/Express backend and must be deployed to a platform that supports Node web services. Static-only hosts like GitHub Pages are not compatible.

### Render (Recommended — Free Tier)
1. Push your repository to GitHub.
2. Go to [render.com](https://render.com) and create a **New Web Service**.
3. Connect your GitHub repository.
4. Set **Build Command** to `npm install && npm run build` and **Start Command** to `npm start`.
5. Optionally add `DATABASE_URL` as an environment variable.
6. Click **Deploy**.

### Vercel
```bash
npm i -g vercel
vercel
```
Add `DATABASE_URL` in the Vercel dashboard under **Project Settings → Environment Variables**.

### Heroku
```bash
heroku login
heroku create dna-encoding-app
heroku config:set DATABASE_URL=your_postgres_url
git push heroku main
```

---

## 🎓 Academic Context

This project was developed as part of a university-level assignment exploring DNA-based digital data storage — a real and rapidly advancing field at the intersection of computer science and synthetic biology.

The original brief specified a single `dna_storage.html` file in vanilla HTML/CSS/JS. This submission expands significantly on that scope with the following justifications: React and TypeScript provide strict type-checking over the binary/DNA conversion logic; Framer Motion SVG rendering produces a more educationally valuable visual representation of the double helix; backend persistence allows saving and comparing multiple mapping configurations as a classroom resource; and shadcn/ui with Tailwind delivers a polished interface that reflects the scientific seriousness of the subject matter.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
Made with ❤️ for curious minds exploring the intersection of biology and computer science.

⭐ Star this repo if you found it useful!
</div>
