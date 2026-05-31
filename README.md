# Task Manager Web ✨

A modern Next.js frontend for personal task management, interfacing with a Ruby on Rails GraphQL API.

## 🛠 Tech Stack & Architecture
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **UI & Styling:** React 19, Tailwind CSS, Lucide React
- **Data Fetching:** Apollo Client for GraphQL operations
- **State & Auth:** React Context + `js-cookie` (JWT management)

## 🏗 Design Decisions
- **Apollo Client:** Chosen for robust caching and normalized data store, which minimizes unnecessary network requests and makes UI updates instantaneous after mutations.
- **Client-Side Auth (Cookies):** JWT tokens are stored securely in cookies rather than `localStorage` to improve security and allow Next.js middleware to protect routes server-side before rendering.
- **Optimistic UI Updates:** Forms and task interactions use local state seamlessly, providing a snappy experience.

## 🚀 Setup & Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a local env file:
   ```bash
   cp .env.example .env.local
   ```
   Set the API URL in `.env.local` (default is the local Rails server):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/graphql
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at [http://localhost:3001](http://localhost:3001) (or 3000 if not in use).

## ✨ Features
- **User Authentication:** Secure Sign up / Sign in flow.
- **CRUD Operations:** Create, view, update, and delete tasks seamlessly.
- **Advanced Filtering:** Filter tasks instantly by Status (Pending, In Progress, Completed) and Priority.
- **Inline Editing:** Quick status updates directly from the task card.
- **Summary Dashboard:** Overview of total and filtered tasks.
- **Enhanced UI/UX:** Features skeleton loading states, friendly empty states, and dynamic toast notifications for user feedback.
- **Responsive Layout:** Mobile-first Tailwind design ensuring usability on all devices.

## 🧪 Testing
- **Framework:** Jest & React Testing Library
- **Running Tests:** `npm run test` (or `npm run test:watch` for watch mode)
- Includes unit tests for key components ensuring UI correctness and interaction handling.

## 🤖 AI Tools Used
Claude AI and GitHub Copilot were utilized during development to accelerate feature building, enforce best practices, and conduct initial code reviews.
