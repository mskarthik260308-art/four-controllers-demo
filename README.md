# Four Controllers — Professional Portfolio & Command Center

> **Four Controllers** is an ultra-modern, high-performance digital collective portfolio website featuring a **live team strength counter** and an **interactive Admin Command Center** to add, edit, and remove team members, manage projects, and oversee inbound inquiries.

---

## ⚡ Key Highlights & Features

1. **Brand Identity: Four Controllers**
   - Sleek, cyber-minimalist luxury aesthetic with deep dark canvas (`#06080F`), ambient glassmorphism (`backdrop-filter: blur`), electric cyan & indigo accents, and modern typography (*Outfit*, *Plus Jakarta Sans*, *JetBrains Mono*).
   - Responsive across mobile, tablet, laptop, and ultra-wide desktop monitors.

2. **Live Dynamic Team Counter Feature**
   - **Header Counter Pill**: Displays the live number of active controllers in real-time.
   - **Hero Telemetry Card**: Prominent large animated counter with an interactive avatar stack preview of controllers.
   - **Force Strength Banner**: Highlights `Force Total: [ N ] Specialists` with live status indicators.
   - **Reactive Synchronization**: Any member added, edited, or removed in the Admin Portal automatically updates the team counter everywhere without requiring a manual page refresh.

3. **Core Sections on Public Website**
   - **Hero Section**: High-impact value proposition, telemetry metrics, and dual CTAs.
   - **The Controllers (Team Section)**: Comprehensive cards with avatars, controller codes (`CTRL-01` to `CTRL-05+`), roles, bio, technology pills, social profiles, and status dots.
   - **Technical Mastery & Capabilities**: Progress bars with proficiency percentages covering Full-Stack, AI & ML, Spatial UI, and Cloud SRE.
   - **Featured Work & Deliveries**: Categorized portfolio cards with tag filters (AI & Machine Learning, Fintech, Creative & UI/UX, Cloud & Security) and direct links to live solutions & GitHub source code.
   - **Honors & Achievements**: Industry recognitions and hackathon championships.
   - **Contact Transmission Hub**: Working contact form with instant validation, toast feedback, and automatic logging to the Admin Inquiries panel.

4. **Full Administrative Command Center (`/admin.html`)**
   - **Security Authentication**: Passcode protection (Default Master PIN: `admin123` or quick demo unlock).
   - **Team Controllers Management (Add/Edit/Remove)**:
     - Form to add new members with name, role, department, designation badge, avatar URL (or 8 preset professional avatar selectors), bio, and skills.
     - Live deletion confirmation that immediately re-calculates the team count.
   - **Projects Manager**: Add, edit, and delete portfolio deliveries with custom images, tags, and links.
   - **Capabilities & Skills Editor**: Adjust proficiency percentages and register new tech stacks.
   - **Achievements Manager**: Log honors, award years, and impact statements.
   - **Inquiries Inbox**: Read messages submitted via the public contact form, mark as read, or delete.
   - **Global Configuration**: Customize brand name, tagline, hero text, contact info, and admin master PIN.
   - **Data Portability**: One-click JSON backup export and restore capabilities, plus a factory default reset button.

---

## 🚀 Quick Start Guide

### Option 1: Direct Batch Launcher (Windows)
Double-click `start-server.bat` in the project root.

### Option 2: Command Line
```bash
node server.js
```
The application will be running at:
- **Public Portfolio**: [http://localhost:3000/](http://localhost:3000/)
- **Admin Command Center**: [http://localhost:3000/admin.html](http://localhost:3000/admin.html)

### Admin Credentials
- **Default PIN**: `admin123` (or click the *⚡ Quick Demo Unlock* button)
- *Note: You can change the master PIN at any time inside the Admin Settings tab.*

---

## 📁 Project Structure

```
fourcontrollers/
├── index.html          # Public Portfolio Website
├── admin.html          # Administrative Command Center & Team Manager
├── server.js           # Lightweight zero-dependency Node static server
├── start-server.bat    # Windows one-click launcher
├── package.json        # Project metadata and run scripts
├── README.md           # Documentation
├── css/
│   ├── style.css       # Core design tokens, layout, glassmorphism, responsive styles
│   ├── admin.css       # Admin dashboard, data tables, modals, and control panels
│   └── animations.css  # Ambient orbs, pulse lights, counter animations, float effects
└── js/
    ├── store.js        # Central state store with LocalStorage persistence & live event bus
    ├── app.js          # Public portfolio rendering, filters, forms, and live sync
    └── admin.js        # Admin portal CRUD operations, auth gate, and form handlers
```

---

## 🔒 Data Persistence & Security

All data is stored in the browser's persistent `localStorage`. If you modify data on `admin.html` in one tab, the `storage` and `fc:datachange` event listeners immediately propagate the changes to `index.html` across all open windows.
