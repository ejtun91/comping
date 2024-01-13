# Angular User Management App

Welcome to the Angular User Management App! This application is developed using Angular CLI version 17.0.10 and Node.js version 20.10.0, with npm as the package manager (version 9.6.2).

## Setup

To get started, follow these steps:

1. **Install Dependencies:**

   ```bash
   npm install
   ```

2. **Run the Dev Server and Express Server:**
   ```bash
   npm run start
   ```

## Usage

The application supports two primary roles: Admin and Manager. Additionally, there is an optional Regular User role with limited functionality.

### Admin

- Can perform CRUD operations on users.
- REALM-ADMIN Cannot be deleted while USER ADMIN can.

### Manager

- Can view the user list and individual user details.
- Cannot modify user details.

### Regular User

- Limited functionality.
- Can view their own profile.

## NGRX Effects and State Management

The app utilizes NGRX effects for handling CRUD operations and HTTP requests, coupled with reducers for state management.

### Legacy Code

Certain sections of the code are marked with "LEGACY." This code serves as an alternative in case the Keycloak module is not available. It is designed to handle the authentication login screen.

## Downloading PDF Locally

To download the PDF locally, run the following command to spin the express server:

```bash
npm run start
```
