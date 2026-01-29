# Song Planner Dashboard — Frontend

A modern, responsive dashboard for analysing song usage data across a network of churches. The application simplifies complex data analysis workflows and enables easy comparison between churches, activities, and time periods.

<a href="https://youtu.be/UsUPkk5hFJ0">
  <img src="https://github.com/user-attachments/assets/3d370984-5016-493d-863a-2774217da09a" width="600" alt="RAG Demo">
</a>

▶ *Click the image to watch a short demo*


**Live Demo:**  
👉 https://song-planner-dashboard.vercel.app/

**Demo login:**
- **Username:** `user1`
- **Password:** `password1`

## Overview

Before this project, song usage data could only be analysed through traditional data analysis methods, which made comparisons and exploratory analysis time-consuming and inaccessible to non-technical users.

This frontend provides an intuitive dashboard that allows users to:
- Compare song usage across churches in a network
- Analyse which songs were introduced or last used within a specific time range
- Filter and explore data visually through charts and tables
- Access data according to fine-grained permission rules

The focus of the frontend is **clarity**, **usability**, and **performance**, turning raw usage data into actionable insights.

## Tech Stack

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

- **Responsive design**
  - Optimised for desktop, tablet, and mobile devices

- **Graceful loading and error states**
  - Spinners and user-friendly feedback during async operations

## Architecture & Design Decisions

### Authentication via HTTP-only Cookies

Midway through development, authentication was refactored from using authorization headers to **HTTP-only cookies** for improved security.

This change:
- Reduces exposure to XSS attacks
- Aligns better with browser security best practices
- Uses rotating refresh tokens for session longevity

To support this setup on Vercel and avoid third-party cookie issues (particularly on mobile and tablet browsers), vercel.json **rewrites** were introduced to ensure requests are treated as same-site.

### Component-Driven Design

React was chosen to encourage:
- Strong separation of concerns
- Reusable UI patterns (e.g. tables, charts, layout components)
- Easier long-term maintenance as the application grows

Dynamic tables are implemented once and reused across multiple views, with configurable columns, filters, and sorting.

### Type Safety with TypeScript

TypeScript is used throughout the project to:
- Catch integration issues early when working with API responses
- Improve developer confidence during refactors
- Make component contracts explicit and self-documenting

### Styling with Tailwind CSS

Tailwind was selected over frameworks like Bootstrap to:
- Maintain full control over the design system
- Avoid heavy opinionated styles
- Create a consistent, custom look and feel

Utility-first styling also enables rapid iteration and easy visual adjustments.

### Data Visualisation

Chart.js is used for bar and pie charts to provide:
- Smooth animations
- Clear data representation
- A polished, professional user experience

Charts are tightly integrated with filters and time-based queries to support exploratory analysis.

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

- Add automated tests
- Add semantic/thematic song searches (using LLM integration on the backend)