# Fishbook - A Full-Stack Social Media

## Prerequisites

- A cloud MongoDB account
- A Cloudinary account

## Features

- User registration & login (with sessions/cookies)
- Post creation with images/videos
- Like and comment system (including nested comments)
- Profile page with user data and avatar
- Responsive and mobile-friendly UI

## Tech Stack

- **Frontend**: React, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: MongoDB w/ Cloudinary for storing images
- **Auth**: Cookie-based authentication

---

## Installation

### 1. Clone the Repository

```bash
cd %PATH%
git clone https://github.com/Galaxyrama/Fishbook.git
cd fishbook
```

### 2. Set up the Backend

```
cd backend
npm install
```

### 3. Set up the .env file
- Create a `.env` file inside of the backend folder

![image](https://github.com/user-attachments/assets/6b12543a-8acc-4c49-93ea-64409a70e2ff)

Insert this inside the .env file

PORT = 5175

MONGO_CONNECTION_STRING = your_database_url_here

SESSION_SECRET = your_secret_key

CLOUDINARY_CLOUD_NAME = your_cloudinary_name

CLOUDINARY_API_KEY = your_cloudinary_api_key

CLOUDINARY_SECRET = your_cloudinary_secret

### 4. Run the Backend

```
npm start
```

### 5. Set Up the Frontend

```
cd ../frontend
npm install
```

### 6. Run the Frontend

```
npm run dev
```

> [!IMPORTANT]
> The frontend and backend must run on separate terminals.
