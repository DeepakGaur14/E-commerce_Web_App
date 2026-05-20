# E-commerce Web App

A modern e-commerce storefront built with React, TypeScript, Vite, and Tailwind CSS. This app includes product listing, product detail pages, cart state management, and responsive UI components.

## Features

- Built with React + TypeScript
- Fast local development with Vite
- Tailwind CSS for styling
- Client-side routing with React Router
- Shared cart state using React Context
- Product detail pages and responsive layout

## Project Structure

- `src/main.tsx` — application entry point
- `src/App.tsx` — main app component and route layout
- `src/index.css` — global styles and Tailwind imports
- `src/components/Footer.tsx` — footer UI component
- `src/context/CartContext.tsx` — cart store and provider
- `src/pages/Home.tsx` — home/product listing page
- `src/pages/ProductDetail.tsx` — product detail page

## Setup & Run

### Prerequisites

- Node.js 18+ installed
- npm available in your terminal

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

Open the local URL printed in the terminal (usually `http://localhost:5173`) to view the app.

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Check TypeScript types

```bash
npm run typecheck
```

### Run ESLint

```bash
npm run lint
```

## Notes

- If you add or modify Tailwind configuration, restart the dev server.
- If the app uses Supabase or other external services, set any environment variables required in your `.env` file.

## License

This project is provided as-is. Customize and extend it for your e-commerce needs.
