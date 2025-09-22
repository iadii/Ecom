# Poshak Email Marketing Backend

A Node.js/Express backend for AWS SES bulk email marketing with campaign management, subscriber handling, and real-time analytics.

## 🚀 Features

- **AWS SES Integration**: Professional bulk email sending with 1000-2000 emails per campaign
- **Campaign Management**: Create, manage, and track email campaigns
- **Subscriber Management**: Import/export, segmentation, and bulk operations
- **Real-time Analytics**: Delivery rates, open rates, click tracking
- **Rate Limiting**: Built-in email throttling and queue management
- **Database**: SQLite with production-ready schema
- **Security**: JWT authentication, CORS protection, input validation

## 📋 Prerequisites

- Node.js 16+ 
- NPM or Yarn
- AWS Account with SES access
- Domain verification (for production use)

## ⚙️ Installation

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Initialize Database**:
   ```bash
   npm run init-db
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

## 🔧 Environment Configuration

### Required Environment Variables

```env
# AWS SES Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key

# Email Settings
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=Your Company

# Server Configuration  
PORT=3001
FRONTEND_URL=http://localhost:5175
NODE_ENV=development

# Security
JWT_SECRET=your_super_secret_jwt_key

# Rate Limiting
EMAIL_RATE_LIMIT=10
MAX_RECIPIENTS_PER_BATCH=50
BATCH_DELAY_MS=100
```

## 🔐 AWS SES Setup

### 1. Create IAM User
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail",
        "ses:GetSendQuota",
        "ses:GetSendStatistics"
      ],
      "Resource": "*"
    }
  ]
}
```

### 2. Verify Domain
1. Add domain in SES Console
2. Add DNS TXT record for verification
3. Configure DKIM (recommended)

### 3. Production Access
Request production access through SES console to remove sandbox limitations.

## 📚 API Endpoints

### Email Service
- `POST /api/email/configure` - Configure AWS SES
- `POST /api/email/test-connection` - Test SES connection
- `POST /api/email/send-test` - Send test email
- `POST /api/email/send-bulk` - Send bulk campaign
- `GET /api/email/statistics` - Get SES statistics

### Campaigns
- `GET /api/campaigns` - List campaigns
- `POST /api/campaigns` - Create campaign
- `GET /api/campaigns/:id` - Get campaign
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign
- `GET /api/campaigns/:id/stats` - Campaign analytics
- `GET /api/campaigns/:id/preview` - Preview campaign

### Subscribers
- `GET /api/subscribers` - List subscribers
- `POST /api/subscribers` - Create subscriber
- `POST /api/subscribers/import` - Import CSV
- `GET /api/subscribers/export/csv` - Export CSV
- `PUT /api/subscribers/:id` - Update subscriber
- `DELETE /api/subscribers/:id` - Delete subscriber

## 📊 Usage Examples

### Configure AWS SES
```javascript
const response = await fetch('/api/email/configure', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    region: 'us-east-1',
    accessKeyId: 'AKIA...',
    secretAccessKey: 'secret...',
    fromEmail: 'noreply@company.com',
    fromName: 'Company Name'
  })
});
```

### Send Bulk Campaign
```javascript
const response = await fetch('/api/email/send-bulk', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    campaignId: 'campaign-123',
    segments: ['newsletter', 'customers']
  })
});
```

### Import Subscribers
```javascript
const formData = new FormData();
formData.append('csvFile', file);

const response = await fetch('/api/subscribers/import', {
  method: 'POST',
  body: formData
});
```

## 🗄️ Database Schema

### Campaigns
- Campaign management and tracking
- Template content and settings
- Send statistics and analytics

### Subscribers  
- Contact information and preferences
- Segmentation and custom fields
- Subscription status tracking

### Email Logs
- Individual email tracking
- Delivery and engagement metrics
- Error logging and debugging

## 🚀 Production Deployment

### Using Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

### Using PM2
```bash
npm install -g pm2
pm2 start server.js --name "poshak-email-api"
pm2 startup
pm2 save
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=/var/lib/poshak/database.sqlite
AWS_REGION=us-east-1
# ... other production variables
```

## 📈 Monitoring & Scaling

### Health Check
```bash
curl http://localhost:3001/health
```

### Performance Monitoring
- CPU and memory usage
- Database query performance
- Email sending rates
- API response times

### Scaling Considerations
- Horizontal scaling with load balancer
- Database migration to PostgreSQL
- Redis for session management
- Queue system for high-volume sending

## 🔧 Troubleshooting

### Common Issues

1. **AWS SES Sandbox Mode**
   - Request production access
   - Verify recipient emails in sandbox

2. **Domain Not Verified**
   - Check DNS records
   - Wait for propagation (up to 24 hours)

3. **High Bounce Rate**
   - Clean email lists
   - Implement double opt-in
   - Monitor sender reputation

4. **Rate Limiting**
   - Adjust `EMAIL_RATE_LIMIT` setting
   - Check SES sending limits
   - Implement retry logic

### Debug Mode
```bash
DEBUG=* npm run dev
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## 📞 Support

- Email: support@poshak.com
- Documentation: /docs
- Issues: GitHub Issues