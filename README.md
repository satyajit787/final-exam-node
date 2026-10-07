# Task Management App - Node.js Practical Exam

A clean and complete Task Management Web Application built with Node.js, Express, MongoDB, EJS, and JWT authentication in cookies with Role-Based Access Control (RBAC).

---

## 📁 Project Structure

```text
task-management-app/
│
├── models/
│   ├── User.js          # User schema with roles (user/admin) & task references
│   ├── Task.js          # Task schema with category and user refs
│   └── Category.js      # Category schema
│
├── controllers/
│   ├── authController.js # Register, Login (JWT in cookie), Logout
│   └── taskController.js # CRUD operations for tasks & role checks
│
├── middleware/
│   └── authMiddleware.js # JWT verification from cookies & Admin authorization
│
├── routes/
│   ├── authRoutes.js    # /register, /login, /logout
│   └── taskRoutes.js    # /tasks, /tasks/new, /tasks/edit/:id, /tasks/delete/:id, /tasks/all
│
├── views/
│   ├── partials/
│   │   ├── navbar.ejs   # Role-based navigation bar
│   │   └── taskItem.ejs # Single task item card component
│   ├── login.ejs        # Login page
│   ├── register.ejs     # Register page (choose User or Admin role)
│   ├── taskList.ejs     # Display task list
│   └── taskForm.ejs     # Add & Edit task form
│
├── public/
│   └── style.css        # Clean minimalist CSS
│
├── package.json
└── server.js            # Express server configuration
```

---

## 🚀 How to Run the Project

### 1. Install Dependencies
```bash
npm install
```

### 2. Start MongoDB
Make sure MongoDB server is running on `mongodb://127.0.0.1:27017`.

### 3. Start the Application
```bash
npm start
```
or
```bash
node server.js
```

### 4. Open in Browser
Visit `http://localhost:3000`

---

## 🔑 Features Implemented

1. **Project Setup**: Express, EJS view engine, Mongoose, Cookie Parser, Body Parser, JWT, Bcrypt.
2. **MongoDB Models**: `Task`, `User`, and `Category` with population references (`ref`).
3. **User Roles & Password Hashing**: `admin` and `user` roles with Bcrypt pre-save hashing.
4. **Authentication with JWT & Cookies**: Secure token generation stored in HTTP cookies, cleared on `/logout`.
5. **Role-Based Middlewares**: Protected routes and admin permission checks.
6. **Multiuser Support**: Users view only their tasks; admins can view all user tasks via `/tasks/all`.
7. **CRUD Operations**: Complete Create, Read, Update, Delete for tasks with ownership validation.
8. **EJS Views & Navbar**: Clean minimalist UI with `navbar.ejs` changing options based on whether the logged-in user is `user` or `admin`.
