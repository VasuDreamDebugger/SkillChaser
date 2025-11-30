# SkillChaser (AuralisLMS)

A modern learning-management prototype combining an interactive React frontend with a Node.js API backend. SkillChaser demonstrates a polished learner + educator experience, including fast Tailwind-based UI, custom animated loading states, and interactive branding (animated "SkillChaser" title and runner). The project is intended as a deployable full-stack demo and starting point for online course platforms.

---

## Key Features

- Responsive React frontend (Vite) with Tailwind CSS utilities.
- Fun, page-specific loading animations to improve perceived performance (centralized in `LoadingEffects.jsx`).
- Animated interactive site brand: `SkillChaser` title with per-letter `Chaser` animation and runner emoji that reacts to user login and navigates to the Educator CTA.
- Student-facing pages: Home, Courses list, Course details, Player, My enrollments.
- Educator-facing pages: Dashboard, My Courses, Students enrolled, Add Course.
- Authentication/integration using Clerk for user sign-in and account management.
- Backend API (Express) with MongoDB persistence for Users, Courses, Purchases and CourseProgress.
- File uploads and image hosting via Cloudinary (configured in `server/configs/cloudinary.js`).
- Webhook handlers and server-side controllers for educator/user/course operations.
- Accessible controls and keyboard-friendly interactions for core actions.

## Tech Stack

- Frontend: React (Vite), Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: Clerk
- Media hosting: Cloudinary
- Deployment: Vercel (client) / Node runtime (server) or other Node hosting

## Repository Layout

- `client/` — React application

  - `src/components/` — UI components (Student & Educator areas)
  - `src/pages/` — Top-level pages (Home, Courses, Dashboard, etc.)
  - `src/components/Student/LoadingEffects.jsx` — centralized, reusable loading UIs
  - `index.html`, `vite.config.js`, `tailwind` config (project uses Tailwind utilities)

- `server/` — Express API
  - `server.js` — API entry point
  - `configs/` — DB, Cloudinary and multer setup
  - `controllers/` — course, educator, user controllers
  - `models/` — Mongoose models (Course, User, Purchase, CourseProgress)
  - `routes/` — route definitions (courseRoutes, educatorRoutes, userRoutes)

## Quick Start (development)

Prerequisites

- Node.js (>=16 recommended)
- npm or yarn
- MongoDB (local or cloud)
- Clerk account (for auth) and Cloudinary account (for media uploads)

Example steps (run in two terminals):

1. Start the server

```powershell
cd server
npm install
# set required environment variables (see below)
npm run dev
```

2. Start the client

```powershell
cd ../client
npm install
npm run dev
```

Open the client URL shown by Vite (usually `http://localhost:5173`) and the server URL (e.g. `http://localhost:5000`).

## Environment Variables

Server and client require environment variables. Check `server/configs` and `client/.env` (if present) for exact names. Typical variables include:

- `MONGODB_URI` — your MongoDB connection string
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — Cloudinary credentials
- `CLERK_FRONTEND_API` / other Clerk settings — for authentication integration (client)
- `JWT_SECRET` or other secret keys used by server (if present)
- `PORT` — server port (default 5000)

Note: The repository stores cloudinary/mongo configuration code in `server/configs`; please inspect those files to confirm variable names used by this code.

## Scripts

From `client/`:

- `npm run dev` — run Vite dev server
- `npm run build` — build production assets
- `npm run preview` — preview production build locally

From `server/`:

- `npm run dev` — run server in development (nodemon or similar)
- `npm start` — start server in production (if configured)

## Animations & Accessibility

- Animations are implemented using Tailwind utilities plus local inline CSS keyframes in components to avoid modifying the Tailwind config for prototypes.
- The `SkillChaser` title is keyboard-accessible and the runner behavior is non-blocking; `Chaser` letters and the runner pause on hover to help users inspect content and avoid motion sickness.

## Deployment

This repo is structured to deploy the `client/` to Vercel or any static host after building and to run the `server/` on a Node hosting platform (Heroku, Render, DigitalOcean App Platform, or a serverless setup if adapted).

A simple Vercel flow (client only):

- Set `client` as the project root in Vercel.
- Add client environment variables for Clerk (if needed).
- For combined deployments, deploy the server separately and set the client `BACKEND_URL` to the server's public URL.

## Contributing

- Fork the repo and open a PR for changes. Keep changes scoped and document additions in the README or new docs under `client/` or `server/`.
- Keep behavior backwards compatible and prefer small commits with clear messages.

## Troubleshooting

- If images or uploads fail, confirm Cloudinary env variables and cloud credentials are correct.
- If authentication fails, verify Clerk frontend keys and configuration.
- For DB errors verify `MONGODB_URI` and network accessibility.

## License

This repository includes original demo code; add a license file (e.g., `LICENSE`) appropriate to your project before publishing. If you want, I can generate a permissive license template (MIT) for you.

## Contact

For questions, file an issue or open a discussion on the GitHub repo.

---

Thank you — if you want I can:

- Add a short `CONTRIBUTING.md` and `ISSUE_TEMPLATE.md`.
- Create a simplified `.env.example` file listing the required variables for quick setup.
- Add a small `docs/` folder with screenshots and animated GIFs showing the `SkillChaser` runner behavior and page loading effects.
