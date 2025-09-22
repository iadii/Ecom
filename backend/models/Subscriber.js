const { v4: uuidv4 } = require('uuid');
const database = require('./database');

class Subscriber {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.email = data.email;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.name = data.name || (data.first_name && data.last_name ? `${data.first_name} ${data.last_name}` : '');
    this.phone = data.phone;
    this.status = data.status || 'active';
    this.segments = data.segments || '[]';
    this.custom_fields = data.custom_fields || '{}';
    this.subscribed_at = data.subscribed_at;
    this.unsubscribed_at = data.unsubscribed_at;
    this.last_activity = data.last_activity;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  async save() {
    const now = new Date().toISOString();
    this.updated_at = now;
    
    if (!this.created_at) {
      this.created_at = now;
    }
    
    if (!this.subscribed_at) {
      this.subscribed_at = now;
    }

    const sql = `
      INSERT OR REPLACE INTO subscribers 
      (id, email, first_name, last_name, name, phone, status, segments, custom_fields,
       subscribed_at, unsubscribed_at, last_activity, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      this.id, this.email, this.first_name, this.last_name, this.name, this.phone,
      this.status, this.segments, this.custom_fields, this.subscribed_at,
      this.unsubscribed_at, this.last_activity, this.created_at, this.updated_at
    ];

    await database.run(sql, params);
    return this;
  }

  static async findById(id) {
    const sql = 'SELECT * FROM subscribers WHERE id = ?';
    const row = await database.get(sql, [id]);
    return row ? new Subscriber(row) : null;
  }

  static async findByEmail(email) {
    const sql = 'SELECT * FROM subscribers WHERE email = ?';
    const row = await database.get(sql, [email]);
    return row ? new Subscriber(row) : null;
  }

  static async findAll(options = {}) {
    let sql = 'SELECT * FROM subscribers';
    const params = [];
    const conditions = [];

    if (options.status) {
      conditions.push('status = ?');
      params.push(options.status);
    }

    if (options.segment) {
      conditions.push('segments LIKE ?');
      params.push(`%"${options.segment}"%`);
    }

    if (options.search) {
      conditions.push('(email LIKE ? OR name LIKE ? OR first_name LIKE ? OR last_name LIKE ?)');
      const searchTerm = `%${options.search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY created_at DESC';

    if (options.limit) {
      sql += ' LIMIT ?';
      params.push(options.limit);
    }

    if (options.offset) {
      sql += ' OFFSET ?';
      params.push(options.offset);
    }

    const rows = await database.all(sql, params);
    return rows.map(row => new Subscriber(row));
  }

  static async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_subscribers,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_subscribers,
        SUM(CASE WHEN status = 'unsubscribed' THEN 1 ELSE 0 END) as unsubscribed,
        SUM(CASE WHEN status = 'bounced' THEN 1 ELSE 0 END) as bounced,
        SUM(CASE WHEN status = 'complained' THEN 1 ELSE 0 END) as complained
      FROM subscribers
    `;
    
    return await database.get(sql);
  }

  static async getBySegments(segments) {
    if (!segments || segments.length === 0) {
      return await Subscriber.findAll({ status: 'active' });
    }

    const conditions = segments.map(() => 'segments LIKE ?').join(' OR ');
    const params = segments.map(segment => `%"${segment}"%`);
    params.push('active');

    const sql = `
      SELECT * FROM subscribers 
      WHERE (${conditions}) AND status = ?
      ORDER BY created_at DESC
    `;

    const rows = await database.all(sql, params);
    return rows.map(row => new Subscriber(row));
  }

  static async bulkImport(subscriberData) {
    const results = {
      imported: 0,
      updated: 0,
      errors: []
    };

    for (const data of subscriberData) {
      try {
        if (!data.email || !this.isValidEmail(data.email)) {
          results.errors.push({
            email: data.email || 'missing',
            error: 'Invalid email address'
          });
          continue;
        }

        const existing = await Subscriber.findByEmail(data.email);
        
        if (existing) {
          // Update existing subscriber
          Object.assign(existing, data);
          await existing.save();
          results.updated++;
        } else {
          // Create new subscriber
          const subscriber = new Subscriber(data);
          await subscriber.save();
          results.imported++;
        }
      } catch (error) {
        results.errors.push({
          email: data.email,
          error: error.message
        });
      }
    }

    return results;
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async delete() {
    const sql = 'DELETE FROM subscribers WHERE id = ?';
    await database.run(sql, [this.id]);
  }

  async unsubscribe() {
    this.status = 'unsubscribed';
    this.unsubscribed_at = new Date().toISOString();
    this.updated_at = new Date().toISOString();
    await this.save();
  }

  async resubscribe() {
    this.status = 'active';
    this.unsubscribed_at = null;
    this.updated_at = new Date().toISOString();
    await this.save();
  }

  async addToSegment(segmentName) {
    const segments = JSON.parse(this.segments || '[]');
    if (!segments.includes(segmentName)) {
      segments.push(segmentName);
      this.segments = JSON.stringify(segments);
      await this.save();
    }
  }

  async removeFromSegment(segmentName) {
    const segments = JSON.parse(this.segments || '[]');
    const index = segments.indexOf(segmentName);
    if (index > -1) {
      segments.splice(index, 1);
      this.segments = JSON.stringify(segments);
      await this.save();
    }
  }

  getSegments() {
    try {
      return JSON.parse(this.segments || '[]');
    } catch {
      return [];
    }
  }

  getCustomFields() {
    try {
      return JSON.parse(this.custom_fields || '{}');
    } catch {
      return {};
    }
  }

  setCustomField(key, value) {
    const customFields = this.getCustomFields();
    customFields[key] = value;
    this.custom_fields = JSON.stringify(customFields);
  }

  updateLastActivity() {
    this.last_activity = new Date().toISOString();
  }
}

module.exports = Subscriber;