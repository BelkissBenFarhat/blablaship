# BlaBlaSHip - Peer-to-Peer Delivery Platform

A platform connecting Tunisian diaspora with travelers for transporting personal items between Tunisia and abroad.

## Features

- User authentication (register, login, profile)
- Post trips with available luggage space
- Request packages for delivery
- Messaging between users
- User reviews and ratings
- Dashboard for managing trips and packages

## Technology Stack

- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui components
- **Backend**: Node.js, Express
- **Database**: PostgreSQL (configurable)
- **Authentication**: Passport.js with bcrypt password hashing

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (for production deployment)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/blablaship.git
   cd blablaship
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   - Copy `.env.example` to `.env`
   - Configure the required variables

4. Start the development server
   ```
   npm run dev
   ```

### Deployment

#### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
   - Environment Variables: See `.env.example`

#### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Configure the environment variables:
   - `VITE_API_URL`: URL of your backend service

## Project Structure

- `/client`: Frontend React application
- `/server`: Backend Express server
- `/shared`: Shared types and schemas between frontend and backend

## License

MIT