# Adelaide Fringe React Application

A web application for the Adelaide Fringe festival that allows users to browse events, view event details, and manage user authentication. The application also includes an admin panel for event and ticket management and a user dashboard for personal account management.

## Features

### User Features
- Browse all events
- View featured events on homepage
- View detailed information about specific events
- User authentication (login/register)
- Personal dashboard with:
  - Overview of upcoming tickets
  - Ticket management
  - Profile settings
  - Favorite events
- Responsive design

### Admin Features
- Dashboard with event statistics and quick actions
- Event management (create, edit, delete events)
- Ticket management (view, mark as used/cancelled)
- Responsive admin interface

## Tech Stack

- [React](https://reactjs.org/) - Frontend library
- [React Router](https://reactrouter.com/) - For navigation between pages
- [Vite](https://vitejs.dev/) - Build tool and development server
- [CSS Modules](https://github.com/css-modules/css-modules) - For component-scoped styling

## Project Structure

```
my-react-app/
├── public/              # Static files
├── src/
│   ├── assets/          # Images, fonts, and other static assets
│   ├── components/      # Reusable UI components
│   │   ├── common/      # Common UI components used across the app
│   │   ├── layout/      # Layout components (Header, Footer, AdminLayout, etc.)
│   │   └── login/       # Authentication related components
│   ├── context/         # React context definitions
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   │   ├── admin/       # Admin pages (Dashboard, EventManagement, etc.)
│   │   └── ...          # User-facing pages (HomePage, EventsPage, etc.)
│   ├── routes/          # Routing configuration
│   ├── services/        # API and external service integrations
│   ├── store/           # State management
│   ├── styles/          # Global styles and theme variables
│   └── utils/           # Utility functions and helpers
├── App.jsx              # Main App component
└── main.jsx            # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd my-react-app
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run preview` - Locally preview the production build

## Deployment

To build the application for production, run:

```
npm run build
```

The build artifacts will be stored in the `dist/` directory, ready to be deployed to any static hosting service.

## Authentication

The application provides two types of users:

### Regular User
- Email: test@example.com
- Password: password123

### Admin User
- Email: admin@example.com
- Password: admin123

Admin users have access to the admin panel at `/admin`

## Project Status

This project is currently in development.

## License

This project is licensed under the MIT License.
