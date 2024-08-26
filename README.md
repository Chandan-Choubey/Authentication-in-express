# Team Management Application

## Description

This application is designed for managing teams and user roles. It includes features for user registration, team management, and role-based functionalities. The application consists of a backend API and a frontend built with React.

## Features

- User Registration with various roles: Super Admin, Admin, Manager, Normal User.
- Team management with functionalities to add/remove members and view team details.
- Role-based access control for different functionalities.
- Responsive and user-friendly UI built with React and Tailwind CSS.

## Backend

### API Endpoints

- **POST `/api/v1/users/register`**: Register a new user.
  - **Request Body:** `{ "name": string, "email": string, "password": string, "role": string }`
  - **Response:** User details or error message.

### Database Schema

- **User Schema:**
  - `name`: String
  - `email`: String
  - `password`: String (hashed)
  - `role`: String (Super Admin, Admin, Manager, Normal User)
  - `createdAt`: Date
  - `updatedAt`: Date

- **Team Schema:**
  - `name`: String
  - `members`: Array of user IDs
  - `createdAt`: Date
  - `updatedAt`: Date

## Frontend

### Components

#### `SignupPage`

- **Description:** A form for user registration.
- **State:** `userData` (object containing name, email, password, and role)
- **Handlers:**
  - `handleSubmit(e)`: Handles form submission, sends user data to the server, and logs the server response.

#### `ManagerPage`

- **Description:** Manages teams and their members.
- **Features:** Fetch teams and member details, display in a table, add or remove members.

### Forms and Fields

- **Name:**
  - `id`: `name`
  - `name`: `name`
  - `type`: `text`
  - **Required**

- **Email:**
  - `id`: `email`
  - `name`: `email`
  - `type`: `email`
  - **Required**

- **Password:**
  - `id`: `password`
  - `name`: `password`
  - `type`: `password`
  - **Required**

- **Role:**
  - `id`: `role`
  - `name`: `role`
  - `type`: `select`
  - **Options:** Super Admin, Admin, Manager, Normal User

## Installation

### Backend

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/your-repository.git
