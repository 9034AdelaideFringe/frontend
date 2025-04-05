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
- [Vitest](https://vitest.dev/) - Testing framework
- [GitHub Actions](https://github.com/features/actions) - CI/CD

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

## CI/CD

### CI/CD 流程

项目使用 GitHub Actions 实现自动化测试和部署。详细信息请参阅 [CICD_README.md](./CICD_README.md) 文件。

### CI 流程概述

1. 推送代码到 `main` 或 `develop` 分支时自动触发测试
2. 创建 PR 时自动运行测试并部署到预览环境
3. 合并到 `develop` 分支后自动部署到开发环境
4. 合并到 `main` 分支后自动部署到生产环境

## Testing

This project uses Vitest for unit and integration testing, with coverage reporting configured.

### Testing Commands

```bash
# Run all tests with coverage report
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage

# Start test UI
npm run test:ui
```

### Testing Guidelines

1. Component tests should be placed in the same directory as the component, named as `*.test.{js,jsx,ts,tsx}`
2. Test files should include multiple test cases covering the main functionality and edge cases
3. Use `@testing-library/react` to test component behavior
4. Use `vi.mock()` to mock external dependencies
