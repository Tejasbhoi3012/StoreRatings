# FullStack Intern Coding Challenge

This project is a **FullStack Web Application** that allows users to submit ratings for stores registered on the platform. The application implements **role-based access control** with three different user roles: **System Administrator, Normal User, and Store Owner**.

---

## 🚀 Tech Stack

- **Backend**: Express.js / Loopback / NestJS (choose one)
- **Database**: PostgreSQL / MySQL
- **Frontend**: React.js

---

## 📌 Requirements

- Users can submit ratings for stores (range: **1 to 5**).
- A **single login system** for all users.
- Role-based functionalities:
  - **System Administrator**
  - **Normal User**
  - **Store Owner**

---

## 👥 User Roles & Functionalities

### 🔑 System Administrator
- Add new **stores**, **normal users**, and **admin users**.
- Access a **dashboard** showing:
  - Total number of users
  - Total number of stores
  - Total number of ratings
- Add new users with:
  - Name, Email, Password, Address
- View a list of stores with:
  - Name, Email, Address, Rating
- View a list of users with:
  - Name, Email, Address, Role
- Apply **filters** on listings (Name, Email, Address, Role).
- View detailed user information.
  - If user is a **Store Owner**, also display their Rating.
- Logout functionality.

---

### 👤 Normal User
- Register & log in.
- **Signup form fields**: Name, Email, Address, Password.
- Update password after login.
- View list of registered stores.
- Search for stores by **Name** or **Address**.
- Store listing includes:
  - Store Name, Address, Overall Rating, User’s Submitted Rating
  - Option to **submit** or **modify rating**
- Submit ratings (**1–5**).
- Logout functionality.

---

### 🏪 Store Owner
- Log in to the platform.
- Update password after login.
- Dashboard:
  - View list of users who rated their store.
  - See average rating of their store.
- Logout functionality.

---

## ✅ Form Validations

- **Name**: Min 20 chars, Max 60 chars
- **Address**: Max 400 chars
- **Password**: 8–16 chars, at least one uppercase & one special character
- **Email**: Standard email format validation

---

