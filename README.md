# Song Planner Dashboard — Frontend

A modern, responsive dashboard for analysing song usage data across a network of churches and assisting future song selection through AI tools.

<a href="https://youtu.be/UsUPkk5hFJ0">
  <img src="https://github.com/user-attachments/assets/3d370984-5016-493d-863a-2774217da09a" width="600" alt="RAG Demo">
</a>

▶ *Click the image to watch a short demo*


**Live Demo:**  
👉 https://song-planner-dashboard.vercel.app/

**Demo login:**
- **Username:** `user1`
- **Password:** `password1`


## The Problems This Project Solves

### Data Analysis

Before this project, analysing song usage data required ad-hoc scripts and spreadsheets, making comparisons slow and inaccessible to non-technical users. This application simplifies those workflows and enables easy comparison between churches, activities, and time periods.

The dashboard allows users to:
- Compare song usage across churches in a network
- Analyse which songs were introduced or last used within a specific time range
- Filter and explore data visually through charts and tables
- Access data according to fine-grained permission rules

### AI-Powered Semantic Search

Previously, song searches were limited to basic filtering such as lyrics, musical keys, or song categories. This application expands those capabilities with AI-powered search, enabling users to find songs based on **lyrical meaning** rather than exact keyword matches.

The dashboard allows users to:
- Retrieve Bible passages
- Auto-generate a summary of themes in the Bible passage
- Perform semantic song searches based on song themes or raw lyrics

*These AI capabilities are powered by a Retrieval-Augmented Generation (RAG) pipeline implemented in the backend API.*

## Related Repositories

- **Backend API (FastAPI + SQLAlchemy):**  
  https://github.com/lowrycode/song-planner-api

## Tech Stack (for frontend)

- **React 19** – Component-based UI and reusable abstractions
- **TypeScript** – Static typing to catch bugs before runtime
- **Tailwind CSS** – Fully custom, utility-first styling
- **TanStack React Table** – Powerful, flexible data tables
- **Chart.js + react-chartjs-2** – Professional, responsive data visualisations
- **React Router** – Client-side routing
- **Vercel** – Frontend hosting and deployment

## Key Features

- **Secure authentication**
  - Login via form
  - JWT access tokens with refresh token rotation
  - Tokens stored in HTTP-only cookies

- **Role-based access control**
  - Users must be approved by an admin before accessing data
  - Permissions can be restricted by:
    - Entire network
    - Individual churches
    - Specific activities or services

- **Data visualisation**
  - Bar charts and pie charts for usage trends
  - Clean, readable layouts for non-technical users

- **Reusable UI components**
  - Dynamic tables with sorting and filtering
  - Shared layout and visual components

- **UX Design**
  - Responsive on desktop, tablet, and mobile devices
  - Loading spinners and user-friendly feedback on errors

## Architecture & Design Decisions

### Authentication via HTTP-only Cookies

Authentication was refactored from authorization headers to **HTTP-only cookies** to improve security and align with modern browser best practices. The implementation uses **rotating refresh tokens** for session longevity.

To avoid third-party cookie restrictions (particularly on mobile and tablet browsers), **vercel.json rewrites** ensure requests are treated as same-site.

### Component-Driven Design

React enables clear **separation of concerns** and **reusable** UI patterns. Core components such as dynamic tables are implemented once and reused across multiple views with configurable columns, filters, and sorting.

### Type Safety with TypeScript

TypeScript improves reliability when integrating with API responses and makes component contracts explicit, reducing runtime errors and simplifying refactoring.

### Styling with Tailwind CSS

Tailwind was chosen over Bootstrap because it provides **full control** over the design system while still enabling **rapid development** and consistent styling across the application.

### Data Visualisation

Chart.js is used for interactive bar and pie charts that integrate directly with filtering and time-based queries to support exploratory analysis.

## Environment & Configuration

The frontend communicates with a separate REST API backend.

Environment variables are used to configure the API base URL, for example:

```bash
# Local development: .env file includes
VITE_API_BASE_URL=http://localhost:8000

# Deployed on vite using vercel.json for rewrites
VITE_API_BASE_URL=/api
```
No secrets are stored in the frontend.

## Local Development

```bash
npm install
npm run dev
```

The application will start in development mode with hot module reloading enabled.

## Planned Improvements

- Improve accessibility and keyboard navigation
- Add automated tests