# 🚀 MERN App Deployment Guide

## Prerequisites

1. **GitHub Account** - [github.com](https://github.com)
2. **Render Account** - [render.com](https://render.com) (Free tier available)
3. **MongoDB Atlas Account** - [mongodb.com/atlas](https://mongodb.com/atlas) (Free tier available)

## Step 1: Set up MongoDB Atlas (Database)

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Sign up for free account
   - Create a new project

2. **Create a Free Cluster**
   - Click "Build a Database" → "M0 Cluster" (Free)
   - Choose any provider/region
   - Create cluster (takes 1-3 minutes)

3. **Set up Database Access**
   - Go to "Database Access" → "Add New Database User"
   - Username: `mernuser`
   - Password: Choose a strong password
   - Built-in Role: `Read and write any database`

4. **Network Access**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - **⚠️ For production, restrict to your hosting IP**

5. **Get Connection String**
   - Go to "Clusters" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## Step 2: Push Code to GitHub

Your code is already committed locally. Now push to GitHub:

```bash
# Create a new repository on GitHub.com
# Then run these commands:

git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - **Root Directory**: `backend` (if your backend is in a subfolder)

3. **Configure Service**
   - **Name**: `mern-predictive-maintenance`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Environment Variables**
   - `NODE_ENV`: `production`
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `PORT`: (Render sets this automatically)

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)

## Step 4: Access Your App

Once deployed, you'll get a URL like:
`https://mern-predictive-maintenance.onrender.com`

## Demo Accounts

- **Admin**: `admin` / `admin123`
- **Manager**: `manager` / `manager123`
- **Operator**: `operator` / `operator123`

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure your `server.js` exports properly
- Check build logs in Render dashboard

### Database Connection Issues
- Verify MongoDB Atlas connection string
- Check network access settings
- Ensure database user credentials are correct

### App Won't Load
- Check that static files are being served correctly
- Verify PORT environment variable usage
- Check server logs in Render dashboard

## Alternative Hosting Options

### Railway (Alternative to Render)
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repo
3. Set environment variables
4. Deploy automatically

### Vercel (Frontend + Backend)
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repo
3. Configure as Node.js app
4. Set environment variables

## Cost

- **Render**: Free tier (750 hours/month)
- **MongoDB Atlas**: Free tier (512MB storage)
- **GitHub**: Free

## Need Help?

- Render Docs: [docs.render.com](https://docs.render.com)
- MongoDB Atlas Docs: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- MERN Deployment Guide: Check the README.md in backend folder

---

🎉 **Your MERN app is now live!**