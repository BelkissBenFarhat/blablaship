# BlaBlaSHip Deployment Guide

This guide will help you deploy the BlaBlaSHip application to GitHub, Vercel, and Render.

## Prerequisites

- GitHub account
- Vercel account
- Render account
- PostgreSQL database (we recommend using Neon Database for serverless PostgreSQL)

## Step 1: Push Code to GitHub

1. Create a new GitHub repository
2. Initialize git and push your code:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/blablaship.git
   git push -u origin main
   ```

## Step 2: Set Up Database

1. Sign up for [Neon Database](https://neon.tech/)
2. Create a new PostgreSQL database
3. Copy the connection string which will look like: `postgresql://username:password@host:port/database`

## Step 3: Deploy Backend to Render

1. Log in to [Render](https://render.com/)
2. Create a new Web Service
3. Connect to your GitHub repository
4. Configure the service:
   - **Name**: blablaship-api
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Environment Variables**:
     - `NODE_ENV`: production
     - `PORT`: 10000
     - `SESSION_SECRET`: (generate a random string)
     - `DATABASE_URL`: (your PostgreSQL connection string)
     - `CORS_ORIGINS`: https://your-frontend-domain.vercel.app

5. Click "Create Web Service"
6. After deployment, note the URL of your backend service (e.g., https://blablaship-api.onrender.com)

## Step 4: Deploy Frontend to Vercel

1. Log in to [Vercel](https://vercel.com/)
2. Create a new project
3. Connect to your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Environment Variables**:
     - `VITE_API_URL`: https://blablaship-api.onrender.com/api

5. Click "Deploy"
6. After deployment, Vercel will provide you with a domain (e.g., https://blablaship.vercel.app)

## Step 5: Update CORS Settings

1. Go back to your Render dashboard
2. Update the `CORS_ORIGINS` environment variable to include your Vercel domain
3. Redeploy the backend service

## Step 6: Run Database Migrations

If this is your first time deploying with a PostgreSQL database:

1. Connect to your Render service's shell
2. Run the migration script: `npm run db:migrate`

## Troubleshooting

### Database Connection Issues

- Verify your `DATABASE_URL` is correct
- Make sure your database allows connections from your Render service
- Check for SSL requirements in your connection string

### CORS Errors

- Ensure your `CORS_ORIGINS` includes your frontend domain
- Check for trailing slashes in URL configurations

### Session Issues

- Make sure your `SESSION_SECRET` is properly set
- Verify cookie settings match your domain configuration

## Local Development After Deployment

To switch back to local development:

1. Create a local `.env` file with:
   ```
   NODE_ENV=development
   PORT=5000
   ```

2. Run `npm run dev` to start the development server

## Updating Your Deployment

After making changes to your code:

1. Push changes to GitHub
2. Vercel and Render will automatically detect changes and redeploy

## Custom Domain Setup

### Vercel Custom Domain

1. Go to your Vercel project settings
2. Click on "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

### Render Custom Domain

1. Go to your Render service settings
2. Click on "Custom Domain"
3. Add your domain
4. Follow the DNS configuration instructions

## Security Considerations

- Keep your `SESSION_SECRET` secure and unique
- Don't commit `.env` files to your repository
- Use HTTPS for all connections
- Regularly update dependencies