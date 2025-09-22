const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');
const multer = require('multer');
const csv = require('csv-parser');
const { Readable } = require('stream');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  }
});

// Get all subscribers
router.get('/', async (req, res) => {
  try {
    const { 
      status, 
      segment, 
      search, 
      limit = 50, 
      offset = 0 
    } = req.query;
    
    const options = {
      limit: parseInt(limit),
      offset: parseInt(offset)
    };
    
    if (status) options.status = status;
    if (segment) options.segment = segment;
    if (search) options.search = search;

    const subscribers = await Subscriber.findAll(options);
    
    // Get total count for pagination
    const totalCount = await Subscriber.findAll({ status: options.status }).then(all => all.length);
    
    res.json({
      subscribers,
      pagination: {
        total: totalCount,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < totalCount
      }
    });
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({
      error: 'Failed to fetch subscribers',
      details: error.message
    });
  }
});

// Get subscriber by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const subscriber = await Subscriber.findById(id);
    
    if (!subscriber) {
      return res.status(404).json({
        error: 'Subscriber not found'
      });
    }

    res.json(subscriber);
  } catch (error) {
    console.error('Get subscriber error:', error);
    res.status(500).json({
      error: 'Failed to fetch subscriber',
      details: error.message
    });
  }
});

// Create new subscriber
router.post('/', async (req, res) => {
  try {
    const {
      email,
      first_name,
      last_name,
      name,
      phone,
      segments,
      custom_fields
    } = req.body;

    // Validation
    if (!email || !Subscriber.isValidEmail(email)) {
      return res.status(400).json({
        error: 'Valid email address is required'
      });
    }

    // Check if subscriber already exists
    const existing = await Subscriber.findByEmail(email);
    if (existing) {
      return res.status(409).json({
        error: 'Subscriber with this email already exists',
        existingId: existing.id
      });
    }

    const subscriber = new Subscriber({
      email,
      first_name,
      last_name,
      name: name || (first_name && last_name ? `${first_name} ${last_name}` : ''),
      phone,
      segments: segments ? JSON.stringify(segments) : '[]',
      custom_fields: custom_fields ? JSON.stringify(custom_fields) : '{}'
    });

    await subscriber.save();

    res.status(201).json({
      success: true,
      message: 'Subscriber created successfully',
      subscriber
    });
  } catch (error) {
    console.error('Create subscriber error:', error);
    res.status(500).json({
      error: 'Failed to create subscriber',
      details: error.message
    });
  }
});

// Update subscriber
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const subscriber = await Subscriber.findById(id);
    
    if (!subscriber) {
      return res.status(404).json({
        error: 'Subscriber not found'
      });
    }

    const {
      email,
      first_name,
      last_name,
      name,
      phone,
      status,
      segments,
      custom_fields
    } = req.body;

    // Update fields
    if (email && email !== subscriber.email) {
      if (!Subscriber.isValidEmail(email)) {
        return res.status(400).json({
          error: 'Valid email address is required'
        });
      }
      
      const existing = await Subscriber.findByEmail(email);
      if (existing && existing.id !== id) {
        return res.status(409).json({
          error: 'Another subscriber with this email already exists'
        });
      }
      
      subscriber.email = email;
    }

    if (first_name !== undefined) subscriber.first_name = first_name;
    if (last_name !== undefined) subscriber.last_name = last_name;
    if (name !== undefined) subscriber.name = name;
    if (phone !== undefined) subscriber.phone = phone;
    if (status) subscriber.status = status;
    
    if (segments) {
      subscriber.segments = JSON.stringify(segments);
    }
    
    if (custom_fields) {
      subscriber.custom_fields = JSON.stringify(custom_fields);
    }

    await subscriber.save();

    res.json({
      success: true,
      message: 'Subscriber updated successfully',
      subscriber
    });
  } catch (error) {
    console.error('Update subscriber error:', error);
    res.status(500).json({
      error: 'Failed to update subscriber',
      details: error.message
    });
  }
});

// Delete subscriber
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const subscriber = await Subscriber.findById(id);
    
    if (!subscriber) {
      return res.status(404).json({
        error: 'Subscriber not found'
      });
    }

    await subscriber.delete();

    res.json({
      success: true,
      message: 'Subscriber deleted successfully'
    });
  } catch (error) {
    console.error('Delete subscriber error:', error);
    res.status(500).json({
      error: 'Failed to delete subscriber',
      details: error.message
    });
  }
});

// Bulk import subscribers from CSV
router.post('/import', upload.single('csvFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'CSV file is required'
      });
    }

    const results = [];
    const errors = [];
    
    // Parse CSV from buffer
    const readable = Readable.from(req.file.buffer);
    
    return new Promise((resolve, reject) => {
      readable
        .pipe(csv({
          mapHeaders: ({ header }) => header.toLowerCase().trim()
        }))
        .on('data', (data) => {
          // Validate and clean data
          const cleanData = {
            email: data.email?.trim(),
            first_name: data.first_name?.trim() || data.firstname?.trim(),
            last_name: data.last_name?.trim() || data.lastname?.trim(),
            name: data.name?.trim(),
            phone: data.phone?.trim(),
            segments: data.segments ? data.segments.split(',').map(s => s.trim()) : [],
            custom_fields: {}
          };

          // Add any additional fields as custom fields
          Object.keys(data).forEach(key => {
            if (!['email', 'first_name', 'lastname', 'firstname', 'last_name', 'name', 'phone', 'segments'].includes(key)) {
              cleanData.custom_fields[key] = data[key];
            }
          });

          results.push(cleanData);
        })
        .on('end', async () => {
          try {
            const importResults = await Subscriber.bulkImport(results);
            
            res.json({
              success: true,
              message: 'CSV import completed',
              results: {
                totalRows: results.length,
                imported: importResults.imported,
                updated: importResults.updated,
                errors: importResults.errors
              }
            });
            resolve();
          } catch (error) {
            res.status(500).json({
              error: 'Import failed',
              details: error.message
            });
            reject(error);
          }
        })
        .on('error', (error) => {
          res.status(500).json({
            error: 'CSV parsing failed',
            details: error.message
          });
          reject(error);
        });
    });

  } catch (error) {
    console.error('Import subscribers error:', error);
    res.status(500).json({
      error: 'Failed to import subscribers',
      details: error.message
    });
  }
});

// Export subscribers to CSV
router.get('/export/csv', async (req, res) => {
  try {
    const { status, segment } = req.query;
    const options = {};
    
    if (status) options.status = status;
    if (segment) options.segment = segment;

    const subscribers = await Subscriber.findAll(options);
    
    // Generate CSV content
    const csvHeader = 'email,first_name,last_name,name,phone,status,segments,subscribed_at\n';
    const csvContent = subscribers.map(subscriber => {
      const segments = subscriber.getSegments().join(';');
      return [
        subscriber.email,
        subscriber.first_name || '',
        subscriber.last_name || '',
        subscriber.name || '',
        subscriber.phone || '',
        subscriber.status,
        segments,
        subscriber.subscribed_at
      ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
    }).join('\n');

    const csv = csvHeader + csvContent;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="subscribers_${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csv);

  } catch (error) {
    console.error('Export subscribers error:', error);
    res.status(500).json({
      error: 'Failed to export subscribers',
      details: error.message
    });
  }
});

// Unsubscribe subscriber
router.post('/:id/unsubscribe', async (req, res) => {
  try {
    const { id } = req.params;
    const subscriber = await Subscriber.findById(id);
    
    if (!subscriber) {
      return res.status(404).json({
        error: 'Subscriber not found'
      });
    }

    await subscriber.unsubscribe();

    res.json({
      success: true,
      message: 'Subscriber unsubscribed successfully'
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({
      error: 'Failed to unsubscribe subscriber',
      details: error.message
    });
  }
});

// Resubscribe subscriber
router.post('/:id/resubscribe', async (req, res) => {
  try {
    const { id } = req.params;
    const subscriber = await Subscriber.findById(id);
    
    if (!subscriber) {
      return res.status(404).json({
        error: 'Subscriber not found'
      });
    }

    await subscriber.resubscribe();

    res.json({
      success: true,
      message: 'Subscriber resubscribed successfully'
    });
  } catch (error) {
    console.error('Resubscribe error:', error);
    res.status(500).json({
      error: 'Failed to resubscribe subscriber',
      details: error.message
    });
  }
});

// Get subscriber statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Subscriber.getStats();
    
    // Calculate growth rate (simplified - last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const recentSubscribers = await Subscriber.findAll({
      status: 'active'
    });

    const recent30Days = recentSubscribers.filter(s => 
      new Date(s.created_at) >= thirtyDaysAgo
    ).length;

    const previous30Days = recentSubscribers.filter(s => 
      new Date(s.created_at) >= sixtyDaysAgo && 
      new Date(s.created_at) < thirtyDaysAgo
    ).length;

    const growthRate = previous30Days > 0 
      ? Math.round(((recent30Days - previous30Days) / previous30Days) * 100)
      : 0;

    res.json({
      ...stats,
      growth: {
        recent30Days,
        previous30Days,
        growthRate
      }
    });
  } catch (error) {
    console.error('Get subscriber stats error:', error);
    res.status(500).json({
      error: 'Failed to fetch subscriber statistics',
      details: error.message
    });
  }
});

module.exports = router;