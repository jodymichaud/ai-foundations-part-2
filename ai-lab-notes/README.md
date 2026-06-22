# AI Lab Notes

AI Lab Notes is a beginner-friendly Vite and React web app for practicing basic web development and fictional QA-style documentation.

The app is intentionally small and local-only. It does not use external APIs, passwords, tokens, private data, real company data, paid services, or a backend database.

## What the App Includes

- A monthly task calendar that saves tasks in `localStorage`
- A fictional QA lab notes form with required fields and simple dropdowns
- A saved notes log stored in the browser
- Delete controls for individual notes
- A clear-all control for saved notes
- A med clean date tracker
- Beginner notes explaining Vite, React components, and `localStorage`

## Install Steps

Install Node.js first if it is not already installed.

Then install this project's dependencies:

```bash
npm install
```

## Run Steps

Start the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Build Steps

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## GitHub Push Steps

Check your changes:

```bash
git status
```

Stage your changes:

```bash
git add .
```

Commit your changes:

```bash
git commit -m "Build AI Lab Notes app"
```

Push to GitHub:

```bash
git push
```

## Vercel Deployment Steps

1. Push the project to GitHub.
2. Sign in to Vercel.
3. Create a new Vercel project from the GitHub repository.
4. Keep the default Vite settings.
5. Deploy the project.

Vercel can host the built frontend app. This project does not require a server, database, API key, password, token, or paid service to run.

## Safety and Privacy Notes

This app stores calendar tasks, med clean dates, and fictional lab notes in browser `localStorage`. The data stays in the browser on the current device unless you clear it.

Do not enter real company data, private information, passwords, tokens, customer details, or regulated lab records into this practice app.
