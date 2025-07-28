# Notes-Management-System

A full-featured Notes Manager web application built using the **MERN** stack (MongoDB, Express, React, Node.js). This app supports:

- ✅ User Registration & Login with JWT Authentication  
- 🧾 Create, Read, Update, Delete Notes  
- 🏷️ Add tags to notes  
- 🔐 Auth-protected routes  
- 🎨 Responsive and modern UI using Tailwind CSS

- 
## ⚙️ Setup Instructions

### 🔧 Backend Setup

1. Go to the backend folder:

```bash
cd server
npm install

Create a .env file inside server/ folder and add
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

npm run dev

💻 Frontend Setup

cd client
npm install
npm run dev
