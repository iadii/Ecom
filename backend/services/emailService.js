const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.ses = null;
    this.transporter = null;
    this.isConfigured = false;
    this.rateLimitDelay = parseInt(process.env.BATCH_DELAY_MS) || 100;
    this.maxBatchSize = parseInt(process.env.MAX_RECIPIENTS_PER_BATCH) || 50;
  }

  
  configure(config) {
    try {
      // Configure AWS SDK
      AWS.config.update({
        region: config.region || process.env.AWS_REGION,
        accessKeyId: config.accessKeyId || process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY
      });

      // Initialize SES
      this.ses = new AWS.SES();

      // Create SMTP transporter for AWS SES
      this.transporter = nodemailer.createTransporter({
        host: `email-smtp.${config.region || process.env.AWS_REGION}.amazonaws.com`,
        port: 587,
        secure: false,
        auth: {
          user: config.accessKeyId || process.env.AWS_ACCESS_KEY_ID,
          pass: config.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY
        }
      });

      this.isConfigured = true;
      console.log('✅ AWS SES configured successfully');
      
      return { success: true, message: 'AWS SES configured successfully' };
    } catch (error) {
      console.error('❌ AWS SES configuration failed:', error);
      this.isConfigured = false;
      return { success: false, message: error.message };
    }
  }

  /**
   * Test SES connection
   */
  async testConnection() {
    if (!this.isConfigured || !this.ses) {
      throw new Error('AWS SES not configured');
    }

    try {
      const result = await this.ses.getSendQuota().promise();
      const identity = await this.ses.listIdentities().promise();
      
      return {
        success: true,
        quota: {
          max24Hour: result.Max24HourSend,
          maxSendRate: result.MaxSendRate,
          sentLast24Hours: result.SentLast24Hours
        },
        verifiedIdentities: identity.Identities
      };
    } catch (error) {
      throw new Error(`SES connection test failed: ${error.message}`);
    }
  }

  /**
   * Send a single email
   */
  async sendEmail({ to, subject, htmlContent, textContent, fromEmail, fromName }) {
    if (!this.isConfigured || !this.transporter) {
      throw new Error('Email service not configured');
    }

    const mailOptions = {
      from: `${fromName || process.env.FROM_NAME} <${fromEmail || process.env.FROM_EMAIL}>`,
      to: to,
      subject: subject,
      html: htmlContent,
      text: textContent || this.htmlToText(htmlContent)
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      return {
        success: true,
        messageId: result.messageId,
        recipient: to
      };
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error);
      return {
        success: false,
        error: error.message,
        recipient: to
      };
    }
  }

  /**
   * Send bulk emails with rate limiting and progress tracking
   */
  async sendBulkEmails(campaign, recipients, progressCallback) {
    if (!this.isConfigured) {
      throw new Error('Email service not configured');
    }

    const results = {
      total: recipients.length,
      sent: 0,
      failed: 0,
      errors: [],
      startTime: new Date(),
      endTime: null
    };

    // Process recipients in batches
    const batches = this.chunkArray(recipients, this.maxBatchSize);
    
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      const batchPromises = batch.map(async (recipient) => {
        try {
          // Replace template variables
          const personalizedContent = this.replaceTemplateVariables(
            campaign.template.content,
            recipient
          );
          
          const personalizedSubject = this.replaceTemplateVariables(
            campaign.subject,
            recipient
          );

          const result = await this.sendEmail({
            to: recipient.email,
            subject: personalizedSubject,
            htmlContent: personalizedContent,
            fromEmail: campaign.fromEmail,
            fromName: campaign.fromName
          });

          if (result.success) {
            results.sent++;
          } else {
            results.failed++;
            results.errors.push({
              recipient: recipient.email,
              error: result.error
            });
          }

          // Progress callback
          if (progressCallback) {
            progressCallback({
              total: results.total,
              sent: results.sent,
              failed: results.failed,
              progress: Math.round(((results.sent + results.failed) / results.total) * 100)
            });
          }

          return result;
        } catch (error) {
          results.failed++;
          results.errors.push({
            recipient: recipient.email,
            error: error.message
          });
          return { success: false, error: error.message, recipient: recipient.email };
        }
      });

      // Wait for batch to complete
      await Promise.all(batchPromises);

      // Rate limiting delay between batches
      if (batchIndex < batches.length - 1) {
        await this.delay(this.rateLimitDelay);
      }
    }

    results.endTime = new Date();
    results.duration = results.endTime - results.startTime;

    return results;
  }

  /**
   * Replace template variables in content
   */
  replaceTemplateVariables(content, recipient) {
    let processedContent = content;
    
    // Replace common variables
    const variables = {
      '{{name}}': recipient.name || recipient.email.split('@')[0],
      '{{email}}': recipient.email,
      '{{firstName}}': recipient.firstName || recipient.name?.split(' ')[0] || 'Customer',
      '{{lastName}}': recipient.lastName || recipient.name?.split(' ').slice(1).join(' ') || '',
      '{{unsubscribeUrl}}': `${process.env.FRONTEND_URL}/unsubscribe?email=${encodeURIComponent(recipient.email)}`,
      '{{currentYear}}': new Date().getFullYear(),
      '{{currentDate}}': new Date().toLocaleDateString()
    };

    // Replace all variables
    Object.entries(variables).forEach(([placeholder, value]) => {
      processedContent = processedContent.replace(new RegExp(placeholder, 'g'), value);
    });

    // Replace any custom recipient data
    if (recipient.customData) {
      Object.entries(recipient.customData).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        processedContent = processedContent.replace(new RegExp(placeholder, 'g'), value);
      });
    }

    return processedContent;
  }

  /**
   * Verify an email domain with SES
   */
  async verifyDomain(domain) {
    if (!this.ses) {
      throw new Error('AWS SES not configured');
    }

    try {
      const result = await this.ses.verifyDomainIdentity({ Domain: domain }).promise();
      return {
        success: true,
        verificationToken: result.VerificationToken,
        domain: domain
      };
    } catch (error) {
      throw new Error(`Domain verification failed: ${error.message}`);
    }
  }

  /**
   * Get SES sending statistics
   */
  async getStatistics() {
    if (!this.ses) {
      throw new Error('AWS SES not configured');
    }

    try {
      const [quota, statistics] = await Promise.all([
        this.ses.getSendQuota().promise(),
        this.ses.getSendStatistics().promise()
      ]);

      return {
        quota: {
          max24Hour: quota.Max24HourSend,
          maxSendRate: quota.MaxSendRate,
          sentLast24Hours: quota.SentLast24Hours,
          remainingQuota: quota.Max24HourSend - quota.SentLast24Hours
        },
        statistics: statistics.SendDataPoints
      };
    } catch (error) {
      throw new Error(`Failed to get SES statistics: ${error.message}`);
    }
  }

  // Utility methods
  chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  htmlToText(html) {
    // Simple HTML to text conversion
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  }
}

// Export singleton instance
module.exports = new EmailService();