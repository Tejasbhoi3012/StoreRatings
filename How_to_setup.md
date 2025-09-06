## Setup Instructions

### 1. Install Dependencies
Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd client
npm install
```

### 2. Environment Variables
An `.env` file is already provided in the **backend** folder.  
You only need to update the **PostgreSQL password** to match your local database credentials.

```env
PORT=5000
DATABASE_URL=postgres://postgres:your_local_postgres_password@localhost:5432/store_ratings

JWT_SECRET=3c9d6c7e4a8b4d19f53f6a37c52d8a92c1d2f64e9b8f4a87a1b7c9d2f3e6a5b1
JWT_EXPIRES_IN=7d
```

⚠️ Replace `your_local_postgres_password` with your own **PostgreSQL password**.  
The default password (`Tejas@3012`) is only a placeholder and should be changed.  

---

## Database Setup

1. Make sure PostgreSQL is installed and running.  
2. Open the PostgreSQL shell (psql) and run the following commands:

```sql
-- Create the database
CREATE DATABASE store_ratings;

-- Create the users table
CREATE TABLE users (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL,
  email varchar(255) NOT NULL UNIQUE,
  passwordHash varchar(255) NOT NULL,
  address text,
  role varchar(10) NOT NULL DEFAULT 'user',
  createdAt timestamptz DEFAULT now(),
  updatedAt timestamptz DEFAULT now()
);

-- Create the stores table
CREATE TABLE stores (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL,
  email varchar(255),
  address text,
  ownerId integer REFERENCES users(id),
  createdAt timestamptz DEFAULT now(),
  updatedAt timestamptz DEFAULT now()
);

-- Create the ratings table
CREATE TABLE ratings (
  id serial PRIMARY KEY,
  value integer NOT NULL CHECK (value >= 1 AND value <= 5),
  userId integer REFERENCES users(id) ON DELETE CASCADE,
  storeId integer REFERENCES stores(id) ON DELETE CASCADE,
  createdAt timestamptz DEFAULT now(),
  updatedAt timestamptz DEFAULT now()
);
```

---

## 3. Default Admin Credentials
The system comes with a default admin account:

- **Email:** `admin@mail.com`  
- **Password:** `admin123`  

> ⚠️ It is recommended to change the default admin password after the first login.

---

## 4.Run the Project

Backend:
```
cd backend
npm run dev
```

Frontend:
```
cd client
npm run dev
```

---

