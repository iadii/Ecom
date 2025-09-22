const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const { v4: uuidv4 } = require('uuid');

// Get all campaigns
router.get('/', async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    const options = {};
    
    if (status) options.status = status;
    if (limit) options.limit = parseInt(limit);

    const campaigns = await Campaign.findAll(options);
    res.json(campaigns);
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({
      error: 'Failed to fetch campaigns',
      details: error.message
    });
  }
});

// Get campaign by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findById(id);
    
    if (!campaign) {
      return res.status(404).json({
        error: 'Campaign not found'
      });
    }

    res.json(campaign);
  } catch (error) {
    console.error('Get campaign error:', error);
    res.status(500).json({
      error: 'Failed to fetch campaign',
      details: error.message
    });
  }
});

// Create new campaign
router.post('/', async (req, res) => {
  try {
    const {
      name,
      subject,
      template_id,
      template_content,
      from_email,
      from_name,
      scheduled_at
    } = req.body;

    // Validation
    if (!name || !subject || !template_content || !from_email) {
      return res.status(400).json({
        error: 'Missing required fields: name, subject, template_content, from_email'
      });
    }

    const campaign = new Campaign({
      id: uuidv4(),
      name,
      subject,
      template_id,
      template_content,
      from_email,
      from_name: from_name || 'Poshak',
      status: 'draft',
      scheduled_at
    });

    await campaign.save();

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      campaign
    });
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({
      error: 'Failed to create campaign',
      details: error.message
    });
  }
});

// Update campaign
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findById(id);
    
    if (!campaign) {
      return res.status(404).json({
        error: 'Campaign not found'
      });
    }

    // Don't allow editing of sent campaigns
    if (campaign.status === 'sent' || campaign.status === 'sending') {
      return res.status(400).json({
        error: 'Cannot edit campaigns that are sent or currently sending'
      });
    }

    const {
      name,
      subject,
      template_id,
      template_content,
      from_email,
      from_name,
      scheduled_at,
      status
    } = req.body;

    // Update fields
    if (name) campaign.name = name;
    if (subject) campaign.subject = subject;
    if (template_id !== undefined) campaign.template_id = template_id;
    if (template_content) campaign.template_content = template_content;
    if (from_email) campaign.from_email = from_email;
    if (from_name !== undefined) campaign.from_name = from_name;
    if (scheduled_at !== undefined) campaign.scheduled_at = scheduled_at;
    if (status) campaign.status = status;

    await campaign.save();

    res.json({
      success: true,
      message: 'Campaign updated successfully',
      campaign
    });
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({
      error: 'Failed to update campaign',
      details: error.message
    });
  }
});

// Delete campaign
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findById(id);
    
    if (!campaign) {
      return res.status(404).json({
        error: 'Campaign not found'
      });
    }

    // Don't allow deletion of sent campaigns
    if (campaign.status === 'sent' || campaign.status === 'sending') {
      return res.status(400).json({
        error: 'Cannot delete campaigns that are sent or currently sending'
      });
    }

    await campaign.delete();

    res.json({
      success: true,
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    console.error('Delete campaign error:', error);
    res.status(500).json({
      error: 'Failed to delete campaign',
      details: error.message
    });
  }
});

// Duplicate campaign
router.post('/:id/duplicate', async (req, res) => {
  try {
    const { id } = req.params;
    const originalCampaign = await Campaign.findById(id);
    
    if (!originalCampaign) {
      return res.status(404).json({
        error: 'Campaign not found'
      });
    }

    const duplicatedCampaign = new Campaign({
      id: uuidv4(),
      name: `${originalCampaign.name} (Copy)`,
      subject: originalCampaign.subject,
      template_id: originalCampaign.template_id,
      template_content: originalCampaign.template_content,
      from_email: originalCampaign.from_email,
      from_name: originalCampaign.from_name,
      status: 'draft'
    });

    await duplicatedCampaign.save();

    res.status(201).json({
      success: true,
      message: 'Campaign duplicated successfully',
      campaign: duplicatedCampaign
    });
  } catch (error) {
    console.error('Duplicate campaign error:', error);
    res.status(500).json({
      error: 'Failed to duplicate campaign',
      details: error.message
    });
  }
});

// Get campaign statistics
router.get('/:id/stats', async (req, res) => {
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
      metrics: {
        recipients: campaign.recipient_count,
        sent: campaign.sent_count,
        delivered: campaign.delivered_count,
        opened: campaign.opened_count,
        clicked: campaign.clicked_count,
        bounced: campaign.bounced_count,
        complained: campaign.complained_count
      },
      rates: {
        delivery: campaign.getDeliveryRate(),
        open: campaign.getOpenRate(),
        click: campaign.getClickRate(),
        bounce: campaign.getBounceRate()
      },
      timeline: {
        created: campaign.created_at,
        started: campaign.started_at,
        completed: campaign.completed_at,
        scheduled: campaign.scheduled_at
      },
      progress: campaign.getProgressPercentage()
    };

    res.json(stats);
  } catch (error) {
    console.error('Get campaign stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch campaign statistics',
      details: error.message
    });
  }
});

// Preview campaign content
router.get('/:id/preview', async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.query;
    
    const campaign = await Campaign.findById(id);
    
    if (!campaign) {
      return res.status(404).json({
        error: 'Campaign not found'
      });
    }

    // Generate preview with sample data
    const sampleData = {
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
      email: email || 'john.doe@example.com',
      unsubscribeUrl: `${process.env.FRONTEND_URL}/unsubscribe?email=${encodeURIComponent(email || 'john.doe@example.com')}`,
      currentYear: new Date().getFullYear(),
      currentDate: new Date().toLocaleDateString()
    };

    let previewContent = campaign.template_content;
    let previewSubject = campaign.subject;

    // Replace variables with sample data
    Object.entries(sampleData).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      previewContent = previewContent.replace(new RegExp(placeholder, 'g'), value);
      previewSubject = previewSubject.replace(new RegExp(placeholder, 'g'), value);
    });

    res.json({
      id: campaign.id,
      name: campaign.name,
      subject: previewSubject,
      content: previewContent,
      fromEmail: campaign.from_email,
      fromName: campaign.from_name,
      sampleData
    });
  } catch (error) {
    console.error('Campaign preview error:', error);
    res.status(500).json({
      error: 'Failed to generate campaign preview',
      details: error.message
    });
  }
});

module.exports = router;