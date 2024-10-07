# Full Stack Application (React + Node js)
## Backend: AdonisJS Folder Structure

The typical AdonisJS application has a clean structure to manage different components like routing, controllers, models, etc.

```
.
├── app/                    # Contains controllers, models, and services
│   ├── Controllers/
│   ├── Middleware/
│   ├── Models/
│   └── Services/
├── bin/                    # Binary files or executable scripts
├── config/                 # Configuration files for AdonisJS
├── database/               # Database migrations, seeders, and factories
│   ├── migrations/
│   └── seeds/
├── providers/              # IoC Container service providers
├── public/                 # Static files (CSS, JS, images, etc.)
├── start/                  # Initial setup for routes, kernels, and providers
├── tests/                  # Test files for the application
├── uploads/                # Directory to store uploaded files
├── ace.js                  # Adonis CLI entry file
├── adonisrc.ts             # Adonis configuration file
├── entrypoint.sh           # Shell script for container deployment
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── nuget.exe               # Executable file (possible for .NET or other dependencies)
```

## Frontend: React with Material UI Folder Structure

```
src/
├── api/                    # Backend API URLs and request functions
├── assets/                 # Images and other static assets
├── components/             # Reusable components for the application
├── features/               # Contains slices like authSlice
│   └── authSlice.js
├── layouts/                # Different layouts for roles (admin, client, advisor)
├── pages/                  # All the application pages
├── routes/                 # Public and private routes configuration
├── store/                  # Redux store and global state management
├── utils/                  # Utility functions or constants
├── App.css                 # Global styles for the app
├── App.jsx                 # Main React component file
├── index.css               # Global CSS
└── main.jsx                # Application entry point
```

## Installation Instructions

1. Clone the repository:
```bash
git clone https://github.com/your-repo-url.git
```
2. Navigate to the backend and frontend directories and install dependencies:
- For backend:
```bash
cd backend
node ace migration:run
npm install
```
- For frontend:
```bash
cd frontend
npm install
```
3. Configure environment variables for both the backend and frontend by creating .env files and setting up the necessary environment variables as per your development and production needs.
4. To start the backend server (AdonisJS):
```bash
npm run dev
```
5. To start the frontend server (React):
```bash
npm run dev
```

## Backend Overview

- **Controllers**:
  - **advice_firms_controller.ts**:
    - **getAdvisors**: Fetches all advisors for an advice firm.
    - **getClients**: Retrieves all clients associated with a specific advice firm.
    - **getAdministrator**: Fetches the administrator of an advice firm.
    - **createPortfolio**: Allows users (advisors or clients) to create a financial portfolio.

  - **dashboard_controller.ts**:
    - **getStats**: Retrieves key statistics for the dashboard, including user metrics, portfolios, etc.
    - **getGraphData**: Fetches data required to render various graphs in the dashboard (e.g., performance, user activity).

  - **user_controller.ts**:
    - **login**: Handles user login functionality with validation and session creation.
    - **register**: User registration and account creation, including validation.
    - **sendOTP**: Uses **Twilio** to send OTP (One-Time Password) for two-factor authentication.
    - **verifyOTP**: Verifies the OTP entered by the user.
    - **sendMail**: Sends verification and notification emails using **SendGrid**.
    - **forgotPassword**: Sends a password reset link via email.
    - **resetPassword**: Allows users to reset their password using the token sent via email.

- **Middleware**:
  - **auth_middleware**: Middleware that manages authentication, ensuring that only authenticated users can access certain routes.
  - **force_json_response_middleware**: Ensures that the responses are always returned in JSON format.
  - **guest_middleware**: Middleware that restricts access to certain routes only for unauthenticated users (e.g., login, signup pages).

- **Validators**:
  - **advisor_portal**: Contains validation rules for actions related to the advisor portal, such as advisor data input or form submission.
  - **signup**: Contains validation rules for user sign-up or registration.

- **Config**:
  - **auth.ts**: Configuration for authentication settings, such as JWT or session management.
  - **bodyparser.ts**: Configures how the body of incoming requests is parsed, e.g., for handling JSON or URL-encoded data.
  - **cors.ts**: Configuration for handling Cross-Origin Resource Sharing (CORS), which dictates which domains can access the API.
  - **handle_error_response.ts**: Custom error handling logic, possibly defining how errors are formatted and returned to the client.
  - **database.ts**: Configures database connections, including credentials using PostgreSQL.

- **Providers**:
  - **access_token_cron_provider.ts**: Possibly a service that runs a cron job to manage or clean up expired access tokens.
  - **adviser_dashboard_stats_cron.ts**: Cron job provider that collects and stores dashboard stats for advisers.
  - **model_structure_provider.ts**: Likely a service that provides or validates the structure of models or data schema.
  - **save_dashboard_data_provider.ts**: Saves dashboard-related data, potentially used to cache or pre-calculate data for faster loading.

## Client Side Overview

- **API Folder**:
  - **adviceFirmHandler.js**: This file likely contains functions for handling API requests related to advisory services.
  - **auth.js**: Handles authentication-related API calls, such as login, signup, OTP verification, or session management.
  - **clientHandler.js**: This could include retrieving client portfolios, profiles, or other user-related data from the backend.
  - **dashboardHandler.js**: Deals with API requests that populate the dashboard with relevant statistics, charts, or summary data for different roles like admin, advisor, or client.

- **Components**:
  - **CustomLoading.jsx**: A reusable loading component that can be displayed while fetching data or during asynchronous tasks.
  - **Navbar.jsx**: User registration and account creation, including validation.
  - **LogoutWarningPopup.jsx**: A component that shows a warning popup when the user attempts to log out, asking for confirmation.
  - **subcomponents**: Contains reusable components like input fields, buttons, pagination, and other small UI elements.

- **Features**:
  - **authSlice.js**: A Redux slice responsible for managing user authentication state. It contains the initial state and actions related to user login, logout, and user-specific data like portfolios and client overviews.

- **Layout**:
  - **ClientLayout.jsx**: Layout structure specifically for client-facing pages, determining how the UI is structured for clients.
  - **SuperAdminLayout.jsx**: Layout for the super admin role, likely containing specific UI elements and navigation relevant to super admins.

- **Utils**:
  - **authenticationCheck.js**: A utility file that validates form fields, possibly containing logic for checking if required fields are filled, formatting errors, or authenticating user credentials.
  - **dateFormatter.js**: Utility for formatting dates into different formats (DD-MM-YYYY). This is useful when displaying date-related information in the application.
  - **generalFunctions.js**: A utility file that holds general-purpose functions like number formatting, CSV file generation, PDF creation, etc., that can be used across the app for various tasks.

## Conclusion
This project integrates AdonisJS for the backend and React with Material UI for the frontend, creating a full-stack application with a clean and modular folder structure. The backend is designed to handle various functionalities such as authentication, dashboard management, and user interactions, while adhering to AdonisJS best practices. The frontend is built with React, using Material UI components and Redux for state management, ensuring a responsive and user-friendly interface.

Feel free to explore and contribute to the repository. Happy coding! 🎉