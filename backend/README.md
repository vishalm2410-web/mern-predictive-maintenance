# MERN Backend Server

A complete Express.js backend server for a MERN (MongoDB, Express, React, Node.js) application.

## Features

- Express.js server with CORS support
- MongoDB integration with Mongoose
- RESTful API structure
- Error handling middleware
- User model and CRUD operations
- Environment configuration with .env
- Ready-to-use routes structure

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Nodemon** - Auto-restart during development
- **CORS** - Cross-origin resource sharing

## Installation

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (template provided) and configure:
   ```
   MONGO_URI=mongodb://localhost:27017/mern-app
   PORT=5000
   NODE_ENV=development
   ```

4. Ensure MongoDB is running on your local machine or update the MONGO_URI for a remote database
## Deployment

### Option 1: Render (Recommended - Free Tier Available)

1. **Create a Render account** at [render.com](https://render.com)

2. **Connect your GitHub repository**:
   - Go to Dashboard → New → Web Service
   - Connect your GitHub repo
   - Select the backend folder if it's in a subfolder

3. **Configure the service**:
   - **Name**: mern-backend
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: backend (if your backend is in a subfolder)

4. **Set Environment Variables**:
   - `NODE_ENV`: production
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `PORT`: Will be set automatically by Render

5. **Deploy**: Click "Create Web Service"

### Option 2: Railway

1. **Create a Railway account** at [railway.app](https://railway.app)

2. **Connect your repository** and deploy

3. **Set environment variables** in Railway dashboard

### Option 3: Heroku

1. **Install Heroku CLI**

2. **Login and create app**:
   ```bash
   heroku login
   heroku create your-app-name
   ```

3. **Set environment variables**:
   ```bash
   heroku config:set MONGO_URI="your-mongodb-atlas-uri"
   heroku config:set NODE_ENV="production"
   ```

4. **Deploy**:
   ```bash
   git push heroku main
   ```

## Environment Variables

Create a `.env` file in the backend root:

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mern-app?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development
```

## API Endpoints

- `GET /api/equipment` - Get all equipment
- `GET /api/alerts` - Get all alerts
- `GET /api/maintenance` - Get maintenance history
- `GET /api/metrics` - Get system metrics

## Database Setup

The application uses MongoDB. For production:

1. **Create MongoDB Atlas account** (free tier available)
2. **Create a cluster**
3. **Get connection string** and update MONGO_URI
4. **Whitelist IP addresses** (0.0.0.0/0 for testing)
## Running the Server

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in .env)

## API Endpoints

### Health Check
- **GET** `/api/health` - Check if server is running

## Project Structure

```
backend/
├── models/          # Database models (User.js, etc.)
├── routes/          # API routes (users.js, etc.)
├── server.js        # Main server file
├── package.json     # Dependencies
├── .env             # Environment variables
├── .gitignore       # Git ignore rules
└── README.md        # Documentation
```

## Adding More Routes

1. Create a new file in `routes/` folder
2. Define your routes using Express Router
3. Import and use in `server.js`:
   ```javascript
   const yourRoutes = require('./routes/your-routes');
   app.use('/api/your-endpoint', yourRoutes);
   ```

## Notes

- Remember to connect your frontend to this backend
- Update the MongoDB URI if using MongoDB Atlas
- Add proper validation and authentication in production
- Consider adding JWT for secure authentication

## Troubleshooting

- **MongoDB Connection Error**: Ensure MongoDB is running locally or connection string is correct
- **Port Already in Use**: Change PORT in .env file
- **Dependencies Missing**: Run `npm install` again

---

For more information, refer to Express and Mongoose documentation.
