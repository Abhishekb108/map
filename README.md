# Full Stack Address Search Application

## Overview

This is a full-stack web application that allows users to search for addresses, display them on an interactive map with a marker, and view a searchable history of previously searched addresses. The app includes user authentication to ensure features are only accessible after logging in. The UI is responsive and follows the provided Figma design for layout, colors, fonts, and spacing. Bonus features like address autocomplete and user-friendly error messages are also implemented.

## Features

### Authentication:
- Login with email/password or Google Sign-In.
- Registration and "Forgot Password" functionality.
- Features are inaccessible without logging in.

### Core Functionality:
- Search bar with autocomplete suggestions using the Nominatim API.
- Interactive map with a marker using Leaflet to display searched addresses.
- Search history viewable in a toggleable sidebar, with options to revisit or delete entries.

### Responsive UI:
- Optimized for desktop, tablet, and mobile screens.
- Matches the Figma design for layout, colors, fonts, and spacing.

### Bonus Features:
- Autocomplete address suggestions.
- User-friendly error messages (e.g., session expiration, address not found).
- Search bar enhancements: clear button (✖) and recent searches on focus.

## Technologies Used

### Frontend
- **React**: For building the UI.
- **Leaflet & React-Leaflet**: For the interactive map.
- **Firebase Authentication**: For Google Sign-In.
- **Axios**: For API requests to the backend.
- **CSS**: Custom styles for responsive design.
- **Nominatim API**: For address search and autocomplete.

### Backend
- **Node.js & Express**: For the backend server and API routes.
- **MongoDB & Mongoose**: For storing user data and search history.
- **JWT (JSON Web Tokens)**: For secure authentication.
- **Bcrypt**: For password hashing.
- **Axios**: For verifying Google Sign-In tokens.

## Setup and Run Instructions

The project contains both the backend and frontend in a single repository. Follow these steps to run the application locally.

### Prerequisites
- Node.js (v14 or higher) and npm installed.
- MongoDB Atlas account (or a local MongoDB instance).
- Firebase Project for Google Sign-In (create one at [Firebase Console](https://console.firebase.google.com/)).
- Git installed to clone the repository.

#### 1. Clone the Repository

Clone the repository to your local machine:

git clone https://github.com/Abhishekb108/map.git
cd map

#### 2. Backend Setup


Navigate to the backend folder:

cd backend

## Install dependencies:

npm install



## Start the backend server:

node server.js

The backend should be running on http://localhost:5000.

Note: MongoDB values are hardcoded in server.js due to issues with .env file configuration. In a production environment, these should be stored securely in a .env file.

### 3. Frontend Setup



Open a new terminal and navigate to the frontend folder:

cd frontend


Install dependencies:

npm install

Configure Firebase for Google Sign-In:






## Start the frontend development server:

npm start

The frontend should open in your browser at http://localhost:3000.

4. Access the Application



Open http://localhost:3000 in your browser.



Register or log in using email/password or Google Sign-In.



Search for addresses, view them on the map, and manage your search history.

## Notes and Known Issues





Sign in with Apple: This feature is a placeholder (clicking the button shows an alert) because implementing it requires an Apple Developer account, which has a paid fee.



Forgot Password: The password reset link is logged to the console instead of being sent via email, as SMTP services (e.g., SendGrid, Nodemailer) charge a fee.



Hardcoded MongoDB Values: Due to errors with .env file configuration, MongoDB connection details are hardcoded in backend/server.js. In a production environment, these should be moved to a .env file for security.



Responsive Design: The UI is responsive, but some edge cases on very small screens (<320px) might need further optimization.

## GitHub Repository





Repository: https://github.com/Abhishekb108/map