# 📁 Files Manager Express

### **Curriculum**  
**Program:** 2025SU-TUL-FS-T4  
**Project Type:** Back-end Development (Node.js, MongoDB, Redis)  
**Instructor:** Tomas Martinez  
**Weight:** 1  

---

## 🧩 Project Overview

**Files Manager Express** is a Node.js back-end application that demonstrates how to build a simple but functional file management platform.  

It allows users to:
- Authenticate via tokens  
- Upload and manage files and folders  
- Change file permissions (publish/unpublish)  
- View and download files  
- Generate image thumbnails automatically  

This project serves as a comprehensive summary of key back-end development concepts, including:
- User authentication
- API design using Express.js
- Data persistence with MongoDB
- Caching and session management with Redis
- Background job processing with Bull
- File storage and management
- Pagination and data querying

---

## 🚀 Learning Objectives

By completing this project, you will learn how to:
1. Create an API using **Express.js**
2. Authenticate users securely using tokens
3. Store and manage data in **MongoDB**
4. Manage temporary data in **Redis**
5. Implement background processing with **Bull**
6. Handle file uploads, storage, and image thumbnail generation
7. Implement pagination for data retrieval

---

## ⚙️ Technologies Used

| Technology | Purpose |
|-------------|----------|
| **Node.js** | Server runtime environment |
| **Express.js** | Web application framework |
| **MongoDB** | Database for users and files |
| **Redis** | In-memory data store for caching & authentication tokens |
| **Bull** | Queue management for background processing |
| **image-thumbnail** | Thumbnail generation for images |
| **mime-types** | File type detection |
| **Mocha** | Testing framework |
| **Nodemon** | Development server automation |
| **ESLint** | Code linting and style enforcement |

---

## 📂 Project Structure


---

## 🧠 Key Features

### 1. **Authentication**
- Register users with **email** and **SHA1-hashed password**
- Login using **Basic Auth** and issue tokens stored in Redis
- Logout by invalidating tokens
- Retrieve current user info with `/users/me`

### 2. **File Management**
- Upload files, images, or folders
- Save file data locally under `/tmp/files_manager`
- Store metadata in MongoDB
- Access files through secure endpoints

### 3. **Permissions**
- Publish or unpublish files using:
  - `PUT /files/:id/publish`
  - `PUT /files/:id/unpublish`

### 4. **Background Processing**
- Uses **Bull** for generating thumbnails asynchronously
- Thumbnails automatically generated in 3 sizes: `500px`, `250px`, `100px`

### 5. **Pagination & Listing**
- List files with pagination and parent folder filtering:
  - `GET /files?parentId=0&page=0`

### 6. **File Access**
- Secure file serving with MIME-type handling
- Restricts access to private files unless authorized
- Supports query parameter `?size=` for thumbnail retrieval

---

## 🧪 API Endpoints Summary

| Method | Endpoint | Description |
|--------|-----------|-------------|
| **GET** | `/status` | Check if Redis and DB are alive |
| **GET** | `/stats` | Get total number of users and files |
| **POST** | `/users` | Create a new user |
| **GET** | `/connect` | Authenticate user and return a token |
| **GET** | `/disconnect` | Logout the current user |
| **GET** | `/users/me` | Get authenticated user details |
| **POST** | `/files` | Upload a file or create a folder |
| **GET** | `/files` | List user’s files (with pagination) |
| **GET** | `/files/:id` | Retrieve file metadata |
| **PUT** | `/files/:id/publish` | Make a file public |
| **PUT** | `/files/:id/unpublish` | Make a file private |
| **GET** | `/files/:id/data` | Retrieve file content or thumbnail |

---

## 🔧 Installation & Setup

### **Requirements**
- Ubuntu 18.04 LTS
- Node.js (v12.x.x)
- MongoDB
- Redis

### **Steps**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/atlas-atlas-files_manager.git
   cd atlas-atlas-files_manager



---

## 🧠 Key Features

### 1. **Authentication**
- Register users with **email** and **SHA1-hashed password**
- Login using **Basic Auth** and issue tokens stored in Redis
- Logout by invalidating tokens
- Retrieve current user info with `/users/me`

### 2. **File Management**
- Upload files, images, or folders
- Save file data locally under `/tmp/files_manager`
- Store metadata in MongoDB
- Access files through secure endpoints

### 3. **Permissions**
- Publish or unpublish files using:
  - `PUT /files/:id/publish`
  - `PUT /files/:id/unpublish`

### 4. **Background Processing**
- Uses **Bull** for generating thumbnails asynchronously
- Thumbnails automatically generated in 3 sizes: `500px`, `250px`, `100px`

### 5. **Pagination & Listing**
- List files with pagination and parent folder filtering:
  - `GET /files?parentId=0&page=0`

### 6. **File Access**
- Secure file serving with MIME-type handling
- Restricts access to private files unless authorized
- Supports query parameter `?size=` for thumbnail retrieval

---

## 🧪 API Endpoints Summary

| Method | Endpoint | Description |
|--------|-----------|-------------|
| **GET** | `/status` | Check if Redis and DB are alive |
| **GET** | `/stats` | Get total number of users and files |
| **POST** | `/users` | Create a new user |
| **GET** | `/connect` | Authenticate user and return a token |
| **GET** | `/disconnect` | Logout the current user |
| **GET** | `/users/me` | Get authenticated user details |
| **POST** | `/files` | Upload a file or create a folder |
| **GET** | `/files` | List user’s files (with pagination) |
| **GET** | `/files/:id` | Retrieve file metadata |
| **PUT** | `/files/:id/publish` | Make a file public |
| **PUT** | `/files/:id/unpublish` | Make a file private |
| **GET** | `/files/:id/data` | Retrieve file content or thumbnail |

---

## 🔧 Installation & Setup

### **Requirements**
- Ubuntu 18.04 LTS
- Node.js (v12.x.x)
- MongoDB
- Redis

### **Steps**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/atlas-atlas-files_manager.git
   cd atlas-atlas-files_manager


Install dependencies

npm install


Configure Environment Variables
Create a .env file or export variables manually:

export DB_HOST=localhost
export DB_PORT=27017
export DB_DATABASE=files_manager
export FOLDER_PATH=/tmp/files_manager
export PORT=5000


Start the server

npm run start-server


Start the worker (for thumbnails)

npm run start-worker

📸 Example Usage
# Register a user
curl -XPOST http://localhost:5000/users \
  -H "Content-Type: application/json" \
  -d '{"email": "bob@dylan.com", "password": "toto1234!"}'

# Authenticate user
curl -XGET http://localhost:5000/connect \
  -H "Authorization: Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE="

🧹 Linting

Code quality is enforced using ESLint:

npm run lint

🧾 License

This project is for educational purposes only as part of the 2025 Full Stack Back-End Curriculum.

👥 Authors

Student: Ahmad Nawabi

Instructor: Tomas Martinez

Program: Full Stack Back-End 2025SU-TUL-FS-T4


---

### 2️⃣ Create a ZIP structure on your computer

1. Open your project root folder `atlas-atlas-files_manager`.
2. Add the `README.md` file above.
3. Run the following in terminal (Linux/macOS) or PowerShell (Windows):
