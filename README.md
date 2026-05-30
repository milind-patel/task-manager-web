# Task Manager Web

A Next.js frontend for personal task management.

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- React 19
- Apollo Client (GraphQL)
- Tailwind CSS
- js-cookie (JWT token management)
- lucide-react (icons)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create your local env file:
   ```bash
   cp .env.example .env.local
   ```

3. Set the API URL in `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000/graphql
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

## Features
- User authentication (Sign up / Sign in)
- Create, view, update, delete tasks
- Filter tasks by status and priority
- Quick inline status update from task card
- Summary dashboard with task counts
- Responsive design

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | GraphQL API endpoint | `http://localhost:3000/graphql` |

## AI Tools Used
Claude AI and GitHub Copilot were used to accelerate development and code review.
