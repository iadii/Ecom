const { v4: uuidv4 } = require('uuid');
const database = require('./database');

class Campaign {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.subject = data.subject;
    this.template_id = data.template_id;
    this.template_content = data.template_content;
    this.from_email = data.from_email;
    this.from_name = data.from_name;
    this.status = data.status || 'draft';
    this.recipient_count = data.recipient_count || 0;
    this.sent_count = data.sent_count || 0;
    this.delivered_count = data.delivered_count || 0;
    this.opened_count = data.opened_count || 0;
    this.clicked_count = data.clicked_count || 0;
    this.bounced_count = data.bounced_count || 0;
    this.complained_count = data.complained_count || 0;
    this.scheduled_at = data.scheduled_at;
    this.started_at = data.started_at;
    this.completed_at = data.completed_at;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  async save() {
    const now = new Date().toISOString();
    this.updated_at = now;
    
    if (!this.created_at) {
      this.created_at = now;
    }

    const sql = `
      INSERT OR REPLACE INTO campaigns 
      (id, name, subject, template_id, template_content, from_email, from_name, status, 
       recipient_count, sent_count, delivered_count, opened_count, clicked_count, 
       bounced_count, complained_count, scheduled_at, started_at, completed_at, 
       created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      this.id, this.name, this.subject, this.template_id, this.template_content,
      this.from_email, this.from_name, this.status, this.recipient_count,
      this.sent_count, this.delivered_count, this.opened_count, this.clicked_count,
      this.bounced_count, this.complained_count, this.scheduled_at, this.started_at,
      this.completed_at, this.created_at, this.updated_at
    ];

    await database.run(sql, params);
    return this;
  }

  static async findById(id) {
    const sql = 'SELECT * FROM campaigns WHERE id = ?';
    const row = await database.get(sql, [id]);
    return row ? new Campaign(row) : null;
  }

  static async findAll(options = {}) {
    let sql = 'SELECT * FROM campaigns';
    const params = [];
    const conditions = [];

    if (options.status) {
      conditions.push('status = ?');
      params.push(options.status);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY created_at DESC';

    if (options.limit) {
      sql += ' LIMIT ?';
      params.push(options.limit);
    }

    const rows = await database.all(sql, params);
    return rows.map(row => new Campaign(row));
  }

  static async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_campaigns,
        SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent_campaigns,
        SUM(CASE WHEN status = 'sending' THEN 1 ELSE 0 END) as active_campaigns,
        SUM(sent_count) as total_emails_sent,
        SUM(delivered_count) as total_delivered,
        SUM(opened_count) as total_opened,
        SUM(clicked_count) as total_clicked
      FROM campaigns
    `;
    
    return await database.get(sql);
  }

  async delete() {
    const sql = 'DELETE FROM campaigns WHERE id = ?';
    await database.run(sql, [this.id]);
  }

  async updateStatus(status, additionalData = {}) {
    this.status = status;
    this.updated_at = new Date().toISOString();

    if (status === 'sending' && !this.started_at) {
      this.started_at = new Date().toISOString();
    }

    if (status === 'sent' && !this.completed_at) {
      this.completed_at = new Date().toISOString();
    }

    // Update additional fields
    Object.assign(this, additionalData);

    await this.save();
    return this;
  }

  getProgressPercentage() {
    if (this.recipient_count === 0) return 0;
    return Math.round(((this.sent_count + this.bounced_count) / this.recipient_count) * 100);
  }

  getDeliveryRate() {
    if (this.sent_count === 0) return 0;
    return Math.round((this.delivered_count / this.sent_count) * 100);
  }

  getOpenRate() {
    if (this.delivered_count === 0) return 0;
    return Math.round((this.opened_count / this.delivered_count) * 100);
  }

  getClickRate() {
    if (this.delivered_count === 0) return 0;
    return Math.round((this.clicked_count / this.delivered_count) * 100);
  }

  getBounceRate() {
    if (this.sent_count === 0) return 0;
    return Math.round((this.bounced_count / this.sent_count) * 100);
  }
}

module.exports = Campaign;