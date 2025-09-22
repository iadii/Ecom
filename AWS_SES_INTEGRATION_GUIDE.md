# AWS SES Integration Guide for Poshak Email Marketing

## Overview
Amazon Simple Email Service (SES) is the recommended solution for bulk email sending in the Poshak project. It provides excellent deliverability, cost-effectiveness, and can handle 1000-2000 emails per campaign efficiently.

## 🚀 Why AWS SES?

### Benefits for Bulk Email Marketing:
- **High Volume**: Send up to 200 emails/day (sandbox) or unlimited (production)
- **Excellent Deliverability**: 99%+ delivery rates with good sender reputation
- **Cost Effective**: $0.10 per 1000 emails sent
- **Built-in Analytics**: Delivery, bounce, and complaint tracking
- **Reputation Management**: Automatic IP warming and reputation monitoring
- **Compliance**: Built-in DKIM signing and SPF support

## 📋 Step-by-Step Setup Guide

### Step 1: AWS Account Setup
1. **Create AWS Account**: Sign up at [aws.amazon.com](https://aws.amazon.com)
2. **Access SES Console**: Navigate to Amazon SES in the AWS Console
3. **Choose Region**: Select your preferred region (e.g., us-east-1, eu-west-1)

### Step 2: Domain Verification
1. **Add Domain**: In SES Console → Domains → Verify a New Domain
2. **Enter Domain**: Add your sending domain (e.g., `poshak.com`)
3. **DNS Configuration**: Add the provided DNS records to your domain:
   ```
   Type: TXT
   Name: _amazonses.yourdomain.com
   Value: [Verification Token from AWS]
   ```
4. **Wait for Verification**: Usually takes 5-30 minutes

### Step 3: DKIM Setup (Recommended)
1. **Enable DKIM**: In your verified domain settings
2. **Add DNS Records**: Add the 3 CNAME records provided by AWS:
   ```
   [selector1]._domainkey.yourdomain.com → [aws-dkim-value]
   [selector2]._domainkey.yourdomain.com → [aws-dkim-value]
   [selector3]._domainkey.yourdomain.com → [aws-dkim-value]
   ```

### Step 4: IAM User Creation
1. **IAM Console**: Navigate to IAM → Users → Add User
2. **User Details**:
   - Username: `ses-smtp-user`
   - Access Type: Programmatic access
3. **Permissions**: Attach policy `AmazonSESFullAccess` or create custom policy:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "ses:SendEmail",
           "ses:SendRawEmail"
         ],
         "Resource": "*"
       }
     ]
   }
   ```
4. **Save Credentials**: Download Access Key ID and Secret Access Key

### Step 5: SMTP Credentials Generation
1. **SES Console**: Go to SMTP Settings
2. **Create Credentials**: Click "Create My SMTP Credentials"
3. **IAM User**: Use the user created in Step 4
4. **Download**: Save the SMTP username and password

### Step 6: Configure Poshak Email Marketing
1. **Navigate**: Go to Email Marketing → Settings in Poshak
2. **Select AWS SES**: Choose AWS SES from provider options
3. **SMTP Configuration**:
   ```
   Host: email-smtp.[region].amazonaws.com
   Port: 587
   Security: TLS
   Username: [SMTP Username from Step 5]
   Password: [SMTP Password from Step 5]
   From Email: noreply@yourdomain.com
   From Name: Poshak
   ```
4. **Test Connection**: Use the built-in test feature

## 🔧 Configuration Examples

### US East (N. Virginia) - us-east-1
```
Host: email-smtp.us-east-1.amazonaws.com
Port: 587
```

### EU (Ireland) - eu-west-1
```
Host: email-smtp.eu-west-1.amazonaws.com
Port: 587
```

### Asia Pacific (Mumbai) - ap-south-1
```
Host: email-smtp.ap-south-1.amazonaws.com
Port: 587
```

## 📊 Production Access Request

### Sandbox Limitations:
- 200 emails per day
- 1 email per second
- Can only send to verified email addresses

### Production Benefits:
- Unlimited sending (within account limits)
- Can send to any email address
- Higher sending rate (up to 14 emails/second)

### How to Request:
1. **SES Console**: Navigate to Sending Statistics
2. **Request Production Access**: Click the request button
3. **Use Case Description**: Provide details about your email marketing needs
4. **Response Time**: Usually 24-48 hours

## 🛡️ Best Practices

### Domain Setup:
```dns
; SPF Record
poshak.com. IN TXT "v=spf1 include:amazonses.com ~all"

; DMARC Record
_dmarc.poshak.com. IN TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@poshak.com"
```

### Email Content:
- Use verified "From" addresses only
- Include clear unsubscribe links
- Maintain good text-to-image ratio
- Avoid spam trigger words

### Monitoring:
- Check bounce rates (keep under 5%)
- Monitor complaint rates (keep under 0.1%)
- Track delivery statistics regularly
- Set up SNS notifications for bounces/complaints

## 💰 Cost Estimation

### Pricing (as of 2024):
- **First 62,000 emails/month**: FREE (when sent from EC2)
- **Additional emails**: $0.10 per 1,000 emails
- **Dedicated IP**: $24.95/month (optional)

### Example for Poshak:
```
Campaign Size: 2,000 emails
Monthly Campaigns: 15
Total Monthly Emails: 30,000
Cost: FREE (within free tier)
```

## 🔍 Monitoring & Analytics

### Available Metrics:
- **Send**: Total emails sent
- **Delivery**: Successfully delivered emails
- **Bounce**: Failed deliveries
- **Complaint**: Spam complaints
- **Reputation**: Sender reputation score

### Integration Options:
- CloudWatch dashboards
- SNS notifications
- API calls for real-time stats
- Configuration sets for advanced tracking

## 🚨 Troubleshooting

### Common Issues:

1. **Domain Not Verified**
   - Solution: Check DNS records and wait for propagation

2. **Still in Sandbox**
   - Solution: Request production access through SES console

3. **High Bounce Rate**
   - Solution: Clean email list, verify addresses

4. **Authentication Failed**
   - Solution: Regenerate SMTP credentials, check IAM permissions

## 📱 Production Implementation

### For Backend Integration:
```javascript
// Example Node.js implementation
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: 'email-smtp.us-east-1.amazonaws.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.AWS_SMTP_USERNAME,
    pass: process.env.AWS_SMTP_PASSWORD
  }
});

async function sendBulkEmail(recipients, template) {
  const mailOptions = {
    from: 'noreply@poshak.com',
    to: recipients,
    subject: template.subject,
    html: template.content
  };
  
  return await transporter.sendMail(mailOptions);
}
```

### Environment Variables:
```bash
AWS_SMTP_USERNAME=your_smtp_username
AWS_SMTP_PASSWORD=your_smtp_password
AWS_REGION=us-east-1
```

## 📞 Support Resources

- **AWS SES Documentation**: [docs.aws.amazon.com/ses](https://docs.aws.amazon.com/ses)
- **AWS Support**: Available through AWS Console
- **Community Forums**: AWS Developer Forums
- **Status Page**: [status.aws.amazon.com](https://status.aws.amazon.com)

## ✅ Pre-Launch Checklist

- [ ] Domain verified in SES
- [ ] DKIM configured and verified
- [ ] SPF record added to DNS
- [ ] DMARC policy configured
- [ ] Production access granted
- [ ] SMTP credentials generated
- [ ] Test emails sent successfully
- [ ] Bounce/complaint handling configured
- [ ] Monitoring and alerts set up
- [ ] Email templates tested
- [ ] Unsubscribe process implemented

This setup will enable Poshak to send professional, high-volume email campaigns with excellent deliverability through AWS SES.