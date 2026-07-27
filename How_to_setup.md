1|# FullStack Intern Coding Challenge
2|
3|This project is a **FullStack Web Application** that allows users to submit ratings for stores registered on the platform. The application implements **role-based access control** with three different user roles: **System Administrator, Normal User, and Store Owner**.
4|
5|---
6|
7|### **Backend Stack**
8|
9|The backend of the application is built using the following technologies:
10|
11|*   **Node.js**: Asynchronous event-driven JavaScript runtime.
12|*   **Express.js**: Web application framework for Node.js.
13|*   **MongoDB**: NoSQL database for storing application data.
14|14|*   **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
15|15|*   **JWT (JSON Web Tokens)**: For authentication and authorization.
16|16|*   **Bcrypt.js**: For hashing passwords.
17|17|*   **Joi**: For request body validation.
18|18|
19|19|---
20|20|
21|21|### **Client Stack**
22|22|
23|23|The client-side of the application is built using the following technologies:
24|24|
25|25|*   **React.js**: JavaScript library for building user interfaces.
26|26|*   **Vite**: Next-generation frontend tooling.
27|27|*   **Axios**: Promise-based HTTP client for the browser and Node.js.
28|28|*   **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
29|29|*   **React Router Dom**: Declarative routing for React.
30|30|
31|31|---
32|32|
33|33|### **Features**
34|34|
35|35|1.  **User Authentication and Authorization**: Secure user registration, login, and role-based access control.
36|36|2.  **Store Management**: Admins can add, update, and delete stores. Owners can manage their own stores.
37|37|3.  **Rating System**: Users can rate stores.
38|38|4.  **Admin Dashboard**: Centralized management for users and stores.
39|39|5.  **Owner Dashboard**: Owners can view and manage their stores and ratings.
40|40|6.  **User Dashboard**: Users can view store details and submit ratings.
41|41|
42|42|---
43|43|
44|44|## **Setup Instructions**
45|45|
46|46|Follow these steps to set up and run the project locally.
47|47|
48|48|### **Prerequisites**
49|49|
50|50|Make sure you have the following installed:
51|51|
52|52|*   **Node.js** (v14 or higher)
53|53|*   **npm** or **Yarn**
54|54|*   **MongoDB** instance (local or cloud-hosted)
55|55|
56|56|### **1. Clone the repository**
57|57|
58|58|```bash
59|59|git clone <repository-url>
60|60|cd StoreRatings
61|61|```
62|62|
63|63|### **2. Backend Setup**
64|64|
65|65|Navigate to the `backend` directory, install dependencies, and start the server.
66|66|
67|67|```bash
68|68|cd backend
69|69|npm install
70|70|# or yarn install
71|71|```
72|72|
73|73|Create a `.env` file in the `backend` directory with the following content:
74|74|
75|75|```
76|76|PORT=5000
77|77|MONGO_URI=your_mongodb_connection_string
78|78|JWT_SECRET=your_jwt_secret_key
79|79|```
80|80|
81|81|Replace `your_mongodb_connection_string` with your MongoDB connection URI and `your_jwt_secret_key` with a strong, random string.
82|82|
83|83|Run the backend server:
84|84|
85|85|```bash
86|86|npm start
87|87|# or yarn start
88|88|```
89|89|
90|90|The backend server will run on `http://localhost:5000`.
91|91|
92|92|### **3. Client Setup**
93|93|
94|94|Navigate to the `client` directory, install dependencies, and start the development server.
95|95|
96|96|```bash
97|97|cd ../client
98|98|npm install
99|99|# or yarn install
100|100|```
101|101|
102|102|Run the client development server:
103|103|
104|104|```bash
105|105|npm run dev
106|106|# or yarn dev
107|107|```
108|108|
109|109|The client application will run on `http://localhost:5173` (or another available port).
110|110|
111|111|---
112|112|
113|113|### **Default Admin User**
114|114|
115|115|For testing purposes, a default admin user is created when the backend starts if no users exist. You can log in with:
116|116|
117|117|*   **Email**: `admin@example.com`
118|118|*   **Password**: `password123`
119|119|
120|120|
121|121|---
122|122|
123|123|### **API Endpoints**
124|124|
125|125|A Postman collection is available [here](link-to-postman-collection) for testing the API endpoints.
126|126|

