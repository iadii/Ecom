# Development Guide

## Project Structure Overview

The Poshak e-commerce platform is now organized as a full-stack application with separate frontend and backend directories:

- **Frontend**: React application built with Vite
- **Backend**: Node.js/Express API server with AWS SES integration

## Development Workflow

### Option 1: Run Both Services Simultaneously (Recommended)

Install concurrently for easier development:
```bash
npm install
npm run dev
```

This will start both frontend (localhost:5173) and backend (localhost:3001) simultaneously.

### Option 2: Run Services Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install  
npm run dev
```

## Initial Setup

### 1. Install All Dependencies
```bash
npm run install:all
```

### 2. Configure Backend Environment
```bash
cd backend
cp .env.example .env
# Edit .env with your AWS SES credentials
```

### 3. Initialize Database
```bash
cd backend
npm run init-db
```

### 4. Start Development
```bash
# From root directory
npm run dev
```

## Frontend Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Key Files
- `src/contexts/EmailContext.jsx` - Email  state management
- `src/services/apiService.js` - Backend API communication
- `src/components/email/` - Email  components

### API Integration
The frontend communicates with the backend through the `apiService`:
```javascript
// Example: Send bulk email
const result = await apiService.sendBulkEmail({
  campaignId: 'campaign-123',
  recipientIds: ['sub1', 'sub2'],
  segments: []
});
```

## Backend Development

### Available Scripts
- `npm run dev` - Start with nodemon (auto-restart)
- `npm start` - Production start
- `npm run init-db` - Initialize SQLite database

### Key Directories
- `routes/` - API endpoint handlers
- `services/` - Business logic (email service, etc.)
- `models/` - Database models and queries
- `middleware/` - Express middleware

### Email Service
The backend provides email functionality through AWS SES:
```javascript
// Configure email service
POST /api/email/configure

// Send bulk emails
POST /api/email/send-bulk

// Test connection
POST /api/email/test-connection
```

## Database

### SQLite Schema
The backend uses SQLite with the following main tables:
- `subscribers` - Email subscriber information
- `campaigns` - Email campaign data
- `campaign_sends` - Individual email send records
- `email_logs` - Delivery and interaction logs

### Database Operations
```bash
# Initialize database
npm run init-db

# Database file location
backend/database.sqlite
```

## Email  Integration

### AWS SES Setup
1. Create AWS account and navigate to SES
2. Verify your sending email address
3. Create SMTP credentials (not API keys!)  
4. Update backend/.env with SMTP credentials

### Environment Variables
```bash
# backend/.env
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=your_smtp_username
AWS_SECRET_ACCESS_KEY=your_smtp_password
AWS_SES_FROM_EMAIL=your_verified_email@domain.com
AWS_SES_FROM_NAME=Your Brand Name
```

## API Endpoints

### Email Management
- `POST /api/email/configure` - Configure SMTP settings
- `POST /api/email/send-bulk` - Send bulk campaigns  
- `POST /api/email/send-test` - Send test emails
- `GET /api/email/statistics` - Get email analytics

### Campaign Management  
- `GET /api/campaigns` - List campaigns
- `POST /api/campaigns` - Create campaign
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign

### Subscriber Management
- `GET /api/subscribers` - List subscribers
- `POST /api/subscribers` - Add subscriber
- `POST /api/subscribers/import` - Import CSV
- `DELETE /api/subscribers/:id` - Remove subscriber

## Testing

### Frontend Testing
```bash
cd frontend
npm run lint  # ESLint checks
```

### Backend Testing
```bash
cd backend
# Test email connection
node test-verified-email.js

# Test specific functionality
node diagnostic-test.js
```

## Production Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway)
```bash
cd backend
# Set environment variables
# Deploy backend folder
```

## Troubleshooting

### Common Issues

1. **Port conflicts**
   - Frontend: Change port in `frontend/vite.config.js`
   - Backend: Set PORT in `backend/.env`

2. **CORS errors**
   - Backend CORS is configured for localhost:5173
   - Update in `backend/server.js` if needed

3. **Database issues**
   - Delete `backend/database.sqlite` and run `npm run init-db`

4. **Email authentication**
   - Ensure you're using SMTP credentials (not API keys)
   - Verify email address in AWS SES console

### Debug Mode
Enable debug logging:
```bash
# Backend
DEBUG=* npm run dev

# Check email service logs
tail -f backend/logs/email.log
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Test both frontend and backend
4. Submit pull request

## Support

For technical issues:
- Check this development guide
- Review API documentation in code comments
- Create GitHub issue with detailed description