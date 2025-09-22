# Poshak E-commerce Platform

## Project Structure

This project is organized into separate frontend and backend applications:

```
Libas/
├── frontend/          # React.js frontend application
│   ├── src/           # React components, contexts, services
│   ├── public/        # Static assets
│   ├── package.json   # Frontend dependencies
│   └── vite.config.js # Vite configuration
├── backend/           # Node.js/Express backend API
│   ├── models/        # Database models
│   ├── routes/        # API route handlers
│   ├── services/      # Business logic services
│   ├── middleware/    # Express middleware
│   ├── server.js      # Main server file
│   └── package.json   # Backend dependencies
└── README.md          # This file
```

## Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your AWS SES credentials

# Initialize database
npm run init-db

# Start backend server
npm run dev
```

Backend will run on: http://localhost:3001

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: http://localhost:5173

## Features

### Email System
- **Bulk Email Campaigns** - Send newsletters to thousands of subscribers
- **AWS SES Integration** - Professional email delivery with high deliverability
- **Subscriber Management** - Import/export subscribers, segment management
- **Email Templates** - Rich HTML email templates with personalization
- **Analytics & Tracking** - Real-time campaign performance metrics
- **Rate Limiting** - Intelligent sending limits to avoid spam flags

### E-commerce Platform
- **Product Catalog** - Browse products with filtering and search
- **Shopping Cart** - Add/remove items, quantity management
- **User Authentication** - Login/register functionality
- **Responsive Design** - Mobile-first UI with Tailwind CSS

## Technology Stack

### Frontend
- **React 19** - Modern React with hooks and context
- **Vite** - Fast development build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **SQLite** - Lightweight database
- **AWS SES** - Email delivery service
- **Nodemailer** - Email sending library

## Development

### Running Both Services

For development, you'll need to run both frontend and backend:

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Environment Variables

Backend requires AWS SES credentials in `.env`:
```
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=your_smtp_username
AWS_SECRET_ACCESS_KEY=your_smtp_password
AWS_SES_FROM_EMAIL=your_verified_email@domain.com
```

## Deployment

### Backend Deployment
- Can be deployed to Heroku, Railway, or any Node.js hosting
- Requires environment variables for AWS SES
- Database will be created automatically on first run

### Frontend Deployment
- Build optimized bundle: `npm run build`
- Deploy to Vercel, Netlify, or any static hosting
- Update API base URL for production

## Developer

**Aditya Mishra**
- Email: mishraaditya3456@gmail.com
- LinkedIn: https://www.linkedin.com/in/iadii

---

**Note**: This project requires AWS SES setup for email functionality. See `AWS_SES_INTEGRATION_GUIDE.md` for detailed setup instructions.