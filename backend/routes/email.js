const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');
const Campaign = require('../models/Campaign');
const Subscriber = require('../models/Subscriber');
const database = require('../models/database');

// Configure AWS SES
router.post('/configure', async (req, res) => {
  try {
    const { region, accessKeyId, secretAccessKey, fromEmail, fromName } = req.body;

    if (!region || !accessKeyId || !secretAccessKey || !fromEmail) {
      return res.status(400).json({
        error: 'Missing required configuration parameters'
      });
    }

    const result = emailService.configure({
      region,
      accessKeyId,
      secretAccessKey
    });

    if (result.success) {
      // Save configuration to database
      await database.run(`
        INSERT OR REPLACE INTO email_settings 
        (id, provider, aws_region, aws_access_key_id, aws_secret_access_key, from_email, from_name, is_configured)
        VALUES (1, 'ses', ?, ?, ?, ?, ?, true)
      `, [region, accessKeyId, secretAccessKey, fromEmail, fromName]);

      res.json({
        success: true,
        message: 'AWS SES configured successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.message
      });
    }
  } catch (error) {
    console.error('Configuration error:', error);
    res.status(500).json({
      error: 'Failed to configure email service',
      details: error.message
    });
  }
});

// Test email connection
router.post('/test-connection', async (req, res) => {
  try {
    const result = await emailService.testConnection();
    res.json(result);
  } catch (error) {
    console.error('Connection test error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Send a single test email
router.post('/send-test', async (req, res) => {
  try {
    const { to, subject, content, fromEmail, fromName } = req.body;

    if (!to || !subject || !content) {
      return res.status(400).json({
        error: 'Missing required fields: to, subject, content'
      });
    }

    const result = await emailService.sendEmail({
      to,
      subject,
      htmlContent: content,
      fromEmail,
      fromName
    });

    if (result.success) {
      res.json({
        success: true,
        message: `Test email sent successfully to ${to}`,
        messageId: result.messageId
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Send test email error:', error);
    res.status(500).json({
      error: 'Failed to send test email',
      details: error.message
    });
  }
});

// Send bulk email campaign
router.post('/send-bulk', async (req, res) => {
  try {
    const { campaignId, recipientIds, segments } = req.body;

    if (!campaignId) {
      return res.status(400).json({
        error: 'Campaign ID is required'
      });
    }

    // Get campaign details
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({
        error: 'Campaign not found'
      });
    }

    // Get recipients
    let recipients = [];
    
    if (recipientIds && recipientIds.length > 0) {
      // Get specific recipients by IDs
      for (const id of recipientIds) {
        const subscriber = await Subscriber.findById(id);
        if (subscriber && subscriber.status === 'active') {
          recipients.push(subscriber);
        }
      }
    } else if (segments && segments.length > 0) {
      // Get recipients by segments
      recipients = await Subscriber.getBySegments(segments);
    } else {
      // Get all active subscribers
      recipients = await Subscriber.findAll({ status: 'active' });
    }

    if (recipients.length === 0) {
      return res.status(400).json({
        error: 'No active recipients found'
      });
    }

    // Update campaign status and recipient count
    await campaign.updateStatus('sending', {
      recipient_count: recipients.length
    });

    // Set up progress tracking
    const progressData = {
      campaignId: campaign.id,
      total: recipients.length,
      sent: 0,
      failed: 0,
      progress: 0
    };

    // Send response immediately to avoid timeout
    res.json({
      success: true,
      message: 'Bulk email campaign started',
      campaignId: campaign.id,
      recipientCount: recipients.length,
      status: 'sending'
    });

    // Start bulk sending in background
    sendBulkEmailsInBackground(campaign, recipients);

  } catch (error) {
    console.error('Bulk email error:', error);
    res.status(500).json({
      error: 'Failed to start bulk email campaign',
      details: error.message
    });
  }
});

// Get campaign sending status
router.get('/campaign/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findById(id);
    
    if (!campaign) {
      return res.status(404).json({
        error: 'Campaign not found'
      });
    }

    const stats = {
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      progress: campaign.getProgressPercentage(),
      recipientCount: campaign.recipient_count,
      sentCount: campaign.sent_count,
      deliveredCount: campaign.delivered_count,
      openedCount: campaign.opened_count,
      clickedCount: campaign.clicked_count,
      bouncedCount: campaign.bounced_count,
      deliveryRate: campaign.getDeliveryRate(),
      openRate: campaign.getOpenRate(),
      clickRate: campaign.getClickRate(),
      bounceRate: campaign.getBounceRate(),
      startedAt: campaign.started_at,
      completedAt: campaign.completed_at
    };

    res.json(stats);
  } catch (error) {
    console.error('Campaign status error:', error);
    res.status(500).json({
      error: 'Failed to get campaign status',
      details: error.message
    });
  }
});

// Get email service statistics
router.get('/statistics', async (req, res) => {
  try {
    const sesStats = await emailService.getStatistics();
    const campaignStats = await Campaign.getStats();
    const subscriberStats = await Subscriber.getStats();

    res.json({
      ses: sesStats,
      campaigns: campaignStats,
      subscribers: subscriberStats
    });
  } catch (error) {
    console.error('Statistics error:', error);
    res.status(500).json({
      error: 'Failed to get statistics',
      details: error.message
    });
  }
});

// Background bulk email sending function
async function sendBulkEmailsInBackground(campaign, recipients) {
  try {
    console.log(`📧 Starting bulk email campaign: ${campaign.name} (${recipients.length} recipients)`);

    const results = await emailService.sendBulkEmails(
      {
        id: campaign.id,
        subject: campaign.subject,
        template: { content: campaign.template_content },
        fromEmail: campaign.from_email,
        fromName: campaign.from_name
      },
      recipients.map(subscriber => ({
        email: subscriber.email,
        name: subscriber.name,
        firstName: subscriber.first_name,
        lastName: subscriber.last_name,
        customData: subscriber.getCustomFields()
      })),
      async (progress) => {
        // Update campaign progress in database
        await campaign.updateStatus('sending', {
          sent_count: progress.sent,
          // Note: For demo, we're assuming sent = delivered
          // In production, you'd track these separately via SES webhooks
          delivered_count: progress.sent
        });
      }
    );

    // Update final campaign status
    await campaign.updateStatus('sent', {
      sent_count: results.sent,
      delivered_count: results.sent, // Simplified for demo
      bounced_count: results.failed
    });

    console.log(`✅ Bulk email campaign completed: ${campaign.name}`);
    console.log(`📊 Results: ${results.sent} sent, ${results.failed} failed`);

  } catch (error) {
    console.error(`❌ Bulk email campaign failed: ${campaign.name}`, error);
    
    // Update campaign status to indicate failure
    await campaign.updateStatus('cancelled', {
      sent_count: campaign.sent_count || 0
    });
  }
}

// Initialize email service with saved configuration on startup
router.get('/init', async (req, res) => {
  try {
    const settings = await database.get('SELECT * FROM email_settings WHERE id = 1');
    
    if (settings && settings.is_configured) {
      const result = emailService.configure({
        region: settings.aws_region,
        accessKeyId: settings.aws_access_key_id,
        secretAccessKey: settings.aws_secret_access_key
      });

      res.json({
        success: true,
        configured: result.success,
        provider: settings.provider,
        fromEmail: settings.from_email,
        fromName: settings.from_name
      });
    } else {
      res.json({
        success: true,
        configured: false,
        message: 'Email service not configured'
      });
    }
  } catch (error) {
    console.error('Email service initialization error:', error);
    res.status(500).json({
      error: 'Failed to initialize email service',
      details: error.message
    });
  }
});

module.exports = router;