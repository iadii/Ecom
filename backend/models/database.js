const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = null;
    this.dbPath = process.env.DATABASE_URL || path.join(__dirname, '../database.sqlite');
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Database connection failed:', err);
          reject(err);
        } else {
          console.log('✅ Connected to SQLite database');
          resolve();
        }
      });
    });
  }

  async initialize() {
    if (!this.db) {
      await this.connect();
    }

    // Enable foreign keys
    await this.run('PRAGMA foreign_keys = ON;');

    // Create tables
    await this.createTables();
    
    console.log('✅ Database initialized successfully');
  }

  async createTables() {
    const tables = [
      // Campaigns table
      `CREATE TABLE IF NOT EXISTS campaigns (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        subject TEXT NOT NULL,
        template_id TEXT,
        template_content TEXT,
        from_email TEXT NOT NULL,
        from_name TEXT NOT NULL,
        status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled')),
        recipient_count INTEGER DEFAULT 0,
        sent_count INTEGER DEFAULT 0,
        delivered_count INTEGER DEFAULT 0,
        opened_count INTEGER DEFAULT 0,
        clicked_count INTEGER DEFAULT 0,
        bounced_count INTEGER DEFAULT 0,
        complained_count INTEGER DEFAULT 0,
        scheduled_at DATETIME,
        started_at DATETIME,
        completed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Subscribers table
      `CREATE TABLE IF NOT EXISTS subscribers (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        first_name TEXT,
        last_name TEXT,
        name TEXT,
        phone TEXT,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced', 'complained')),
        segments TEXT, -- JSON array of segment names
        custom_fields TEXT, -- JSON object for additional fields
        subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        unsubscribed_at DATETIME,
        last_activity DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Email templates table
      `CREATE TABLE IF NOT EXISTS email_templates (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        subject TEXT,
        content TEXT NOT NULL,
        type TEXT DEFAULT 'custom' CHECK (type IN ('welcome', 'promotional', 'newsletter', 'transactional', 'custom')),
        variables TEXT, -- JSON array of available variables
        is_default BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Email logs table
      `CREATE TABLE IF NOT EXISTS email_logs (
        id TEXT PRIMARY KEY,
        campaign_id TEXT,
        subscriber_id TEXT,
        template_id TEXT,
        recipient_email TEXT NOT NULL,
        subject TEXT,
        status TEXT NOT NULL CHECK (status IN ('queued', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained', 'failed')),
        error_message TEXT,
        message_id TEXT,
        sent_at DATETIME,
        delivered_at DATETIME,
        opened_at DATETIME,
        clicked_at DATETIME,
        bounced_at DATETIME,
        complained_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (campaign_id) REFERENCES campaigns (id) ON DELETE CASCADE,
        FOREIGN KEY (subscriber_id) REFERENCES subscribers (id) ON DELETE CASCADE,
        FOREIGN KEY (template_id) REFERENCES email_templates (id) ON DELETE SET NULL
      )`,

      // Email settings table
      `CREATE TABLE IF NOT EXISTS email_settings (
        id INTEGER PRIMARY KEY CHECK (id = 1), -- Ensure only one row
        provider TEXT DEFAULT 'ses' CHECK (provider IN ('ses', 'smtp')),
        aws_region TEXT,
        aws_access_key_id TEXT,
        aws_secret_access_key TEXT,
        smtp_host TEXT,
        smtp_port INTEGER,
        smtp_username TEXT,
        smtp_password TEXT,
        smtp_secure BOOLEAN DEFAULT FALSE,
        from_email TEXT,
        from_name TEXT,
        is_configured BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Campaign segments table (many-to-many relationship)
      `CREATE TABLE IF NOT EXISTS campaign_segments (
        campaign_id TEXT,
        segment_name TEXT,
        PRIMARY KEY (campaign_id, segment_name),
        FOREIGN KEY (campaign_id) REFERENCES campaigns (id) ON DELETE CASCADE
      )`,

      // Segments table
      `CREATE TABLE IF NOT EXISTS segments (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        conditions TEXT, -- JSON object for segment conditions
        subscriber_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    // Create indexes for better performance
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns (status)',
      'CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON campaigns (created_at DESC)',
      'CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers (email)',
      'CREATE INDEX IF NOT EXISTS idx_subscribers_status ON subscribers (status)',
      'CREATE INDEX IF NOT EXISTS idx_email_logs_campaign_id ON email_logs (campaign_id)',
      'CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs (recipient_email)',
      'CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs (status)',
      'CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs (sent_at DESC)'
    ];

    // Execute table creation
    for (const table of tables) {
      await this.run(table);
    }

    // Execute index creation
    for (const index of indexes) {
      await this.run(index);
    }

    // Insert default email templates
    await this.insertDefaultTemplates();
  }

  async insertDefaultTemplates() {
    const templates = [
      {
        id: 'welcome_template',
        name: 'Welcome Email',
        subject: 'Welcome to {{companyName}}!',
        content: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #6C1D57;">Welcome to Poshak!</h1>
            <p>Hi {{firstName}},</p>
            <p>Thank you for joining our fashion community! We're excited to have you with us.</p>
            <p>Here's what you can expect:</p>
            <ul>
              <li>Exclusive access to new collections</li>
              <li>Special member discounts</li>
              <li>Style tips and fashion trends</li>
            </ul>
            <a href="{{shopUrl}}" style="background: #6C1D57; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0;">
              Start Shopping
            </a>
            <p>Best regards,<br>The Poshak Team</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">
              If you no longer wish to receive these emails, you can <a href="{{unsubscribeUrl}}">unsubscribe here</a>.
            </p>
          </div>
        `,
        type: 'welcome',
        variables: JSON.stringify(['firstName', 'companyName', 'shopUrl', 'unsubscribeUrl']),
        is_default: true
      },
      {
        id: 'promotional_template',
        name: 'Promotional Campaign',
        subject: '🎉 Special Offer: {{offerTitle}}',
        content: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #6C1D57, #D6336C); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">{{offerTitle}}</h1>
              <p style="margin: 10px 0 0; font-size: 18px;">{{offerSubtitle}}</p>
            </div>
            <div style="padding: 30px;">
              <p>Hello {{firstName}},</p>
              <p>We have an amazing offer just for you!</p>
              <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #6C1D57; margin: 20px 0;">
                <h3 style="margin: 0 0 10px; color: #6C1D57;">{{discountPercent}}% OFF</h3>
                <p style="margin: 0;">Use code: <strong>{{promoCode}}</strong></p>
              </div>
              <p>{{offerDescription}}</p>
              <a href="{{shopUrl}}" style="background: #6C1D57; color: white; padding: 15px 30px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0; font-weight: bold;">
                Shop Now
              </a>
              <p style="color: #666; font-size: 14px;">*Offer valid until {{expiryDate}}</p>
            </div>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666; text-align: center;">
              <a href="{{unsubscribeUrl}}">Unsubscribe</a> | <a href="{{preferencesUrl}}">Update Preferences</a>
            </p>
          </div>
        `,
        type: 'promotional',
        variables: JSON.stringify(['firstName', 'offerTitle', 'offerSubtitle', 'discountPercent', 'promoCode', 'offerDescription', 'shopUrl', 'expiryDate', 'unsubscribeUrl', 'preferencesUrl']),
        is_default: true
      },
      {
        id: 'newsletter_template',
        name: 'Newsletter',
        subject: '📰 {{companyName}} Newsletter - {{monthYear}}',
        content: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <header style="background: #6C1D57; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">{{companyName}} Newsletter</h1>
              <p style="margin: 5px 0 0;">{{monthYear}}</p>
            </header>
            <div style="padding: 30px;">
              <p>Hi {{firstName}},</p>
              <p>Here's what's happening at Poshak this month:</p>
              
              <h2 style="color: #6C1D57; border-bottom: 2px solid #6C1D57; padding-bottom: 10px;">Featured Collection</h2>
              <p>{{featuredContent}}</p>
              
              <h2 style="color: #6C1D57; border-bottom: 2px solid #6C1D57; padding-bottom: 10px;">Style Tips</h2>
              <p>{{styleTips}}</p>
              
              <h2 style="color: #6C1D57; border-bottom: 2px solid #6C1D57; padding-bottom: 10px;">Community Highlights</h2>
              <p>{{communityHighlights}}</p>
              
              <div style="background: #f8f9fa; padding: 20px; margin: 30px 0; text-align: center;">
                <h3 style="margin: 0 0 15px; color: #6C1D57;">Stay Connected</h3>
                <a href="{{websiteUrl}}" style="margin: 0 10px; color: #6C1D57;">Website</a>
                <a href="{{instagramUrl}}" style="margin: 0 10px; color: #6C1D57;">Instagram</a>
                <a href="{{facebookUrl}}" style="margin: 0 10px; color: #6C1D57;">Facebook</a>
              </div>
            </div>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666; text-align: center;">
              <a href="{{unsubscribeUrl}}">Unsubscribe</a> | <a href="{{preferencesUrl}}">Update Preferences</a>
            </p>
          </div>
        `,
        type: 'newsletter',
        variables: JSON.stringify(['firstName', 'companyName', 'monthYear', 'featuredContent', 'styleTips', 'communityHighlights', 'websiteUrl', 'instagramUrl', 'facebookUrl', 'unsubscribeUrl', 'preferencesUrl']),
        is_default: true
      }
    ];

    for (const template of templates) {
      await this.run(
        `INSERT OR IGNORE INTO email_templates (id, name, subject, content, type, variables, is_default)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [template.id, template.name, template.subject, template.content, template.type, template.variables, template.is_default]
      );
    }
  }

  // Database query methods
  async run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    });
  }

  async get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Database connection closed');
          resolve();
        }
      });
    });
  }
}

// Export singleton instance
module.exports = new Database();