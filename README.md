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
- Complete ticket purchase workflow:
  - Select event and ticket types
  - Add tickets to cart
  - View and manage shopping cart
  - Checkout process
- Ticket management features:
  - View active, used, and canceled tickets
  - Access digital tickets with QR codes
  - Download ticket information
  - Request refunds within eligible period
- Responsive design

### Admin Features

- Dashboard with event statistics and quick actions
- Event management (create, edit, delete events)
- Advanced ticket management:
  - Create and edit multiple ticket types per event
  - Set pricing and availability for each ticket type
  - View ticket sales and usage statistics
- Customer order management
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

### CI/CD Workflow

The project uses GitHub Actions for automated testing and deployment. For more details, refer to the [CICD_README.md](./CICD_README.md) file.

### CI Workflow Overview

1. Automatically triggers tests when code is pushed to the `main` or `develop` branches.
2. Runs tests and deploys to a preview environment when a pull request (PR) is created.
3. Automatically deploys to the development environment after merging into the `develop` branch.
4. Automatically deploys to the production environment after merging into the `main` branch.

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

## Database Schema

The application is built on a comprehensive database structure supporting ticket management, shopping cart functionality, and user authentication:

### Core Entities

- **Users**: Authentication and user profile information
- **Events**: Event details, venue information, and scheduling
- **TicketTypes**: Different ticket categories with pricing for each event
- **Tickets**: Individual digital tickets with QR codes and validity information
- **Cart**: Shopping cart items for users during the purchase process
- **Orders**: Completed transactions and purchase history

### Key Relationships

- Events have multiple ticket types (standard, VIP, student, etc.)
- Users can have multiple tickets and orders
- Orders can contain multiple tickets
- Tickets link to specific events and have status tracking (active, used, cancelled, expired)

## Key Workflows

### Ticket Purchase Flow

1. User browses events and selects an event of interest
2. User chooses ticket type and quantity
3. User adds tickets to shopping cart
4. User proceeds to checkout and completes payment
5. System generates digital tickets with unique QR codes
6. User receives confirmation and can access tickets in dashboard

### Ticket Management Flow

1. User can view all purchased tickets in "My Tickets" section
2. Active tickets display QR codes for venue entry
3. Users can download ticket PDFs or request refunds if eligible
4. Tickets automatically update status based on event date

## Development Roadmap

### Current Phase

- Ticket type management implementation
- Shopping cart functionality
- User ticket dashboard
- Refund processing

### Upcoming Features

- Mobile ticket display optimization
- Email notifications for purchases and refunds
- Social sharing integration
- Event recommendations based on user preferences
