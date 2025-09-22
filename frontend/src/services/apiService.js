// Use environment-specific API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://your-backend-domain.com/api'  // Replace with your actual backend URL
    : 'http://localhost:3001/api'
  );

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method for making requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Email Service APIs
  async configureEmailService(config) {
    return this.request('/email/configure', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async testEmailConnection() {
    return this.request('/email/test-connection', {
      method: 'POST',
    });
  }

  async sendTestEmail(emailData) {
    return this.request('/email/send-test', {
      method: 'POST',
      body: JSON.stringify(emailData),
    });
  }

  async sendBulkEmail(campaignData) {
    return this.request('/email/send-bulk', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    });
  }

  async getEmailStatistics() {
    return this.request('/email/statistics');
  }

  async initializeEmailService() {
    return this.request('/email/init');
  }

  // Campaign APIs
  async getCampaigns(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/campaigns?${queryString}` : '/campaigns';
    return this.request(endpoint);
  }

  async getCampaign(id) {
    return this.request(`/campaigns/${id}`);
  }

  async createCampaign(campaignData) {
    return this.request('/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    });
  }

  async updateCampaign(id, campaignData) {
    return this.request(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(campaignData),
    });
  }

  async deleteCampaign(id) {
    return this.request(`/campaigns/${id}`, {
      method: 'DELETE',
    });
  }

  async duplicateCampaign(id) {
    return this.request(`/campaigns/${id}/duplicate`, {
      method: 'POST',
    });
  }

  async getCampaignStats(id) {
    return this.request(`/campaigns/${id}/stats`);
  }

  async getCampaignPreview(id, email = null) {
    const params = email ? `?email=${encodeURIComponent(email)}` : '';
    return this.request(`/campaigns/${id}/preview${params}`);
  }

  async getCampaignStatus(id) {
    return this.request(`/email/campaign/${id}/status`);
  }

  // Subscriber APIs
  async getSubscribers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/subscribers?${queryString}` : '/subscribers';
    return this.request(endpoint);
  }

  async getSubscriber(id) {
    return this.request(`/subscribers/${id}`);
  }

  async createSubscriber(subscriberData) {
    return this.request('/subscribers', {
      method: 'POST',
      body: JSON.stringify(subscriberData),
    });
  }

  async updateSubscriber(id, subscriberData) {
    return this.request(`/subscribers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(subscriberData),
    });
  }

  async deleteSubscriber(id) {
    return this.request(`/subscribers/${id}`, {
      method: 'DELETE',
    });
  }

  async importSubscribers(csvFile) {
    const formData = new FormData();
    formData.append('csvFile', csvFile);

    return this.request('/subscribers/import', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  }

  async exportSubscribers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/subscribers/export/csv?${queryString}` : '/subscribers/export/csv';
    
    const response = await fetch(`${this.baseURL}${endpoint}`);
    if (!response.ok) {
      throw new Error('Export failed');
    }
    
    return response.blob();
  }

  async unsubscribeSubscriber(id) {
    return this.request(`/subscribers/${id}/unsubscribe`, {
      method: 'POST',
    });
  }

  async resubscribeSubscriber(id) {
    return this.request(`/subscribers/${id}/resubscribe`, {
      method: 'POST',
    });
  }

  async getSubscriberStats() {
    return this.request('/subscribers/stats/overview');
  }

  // Health check
  async healthCheck() {
    return this.request('/health', { baseURL: 'http://localhost:3001' });
  }
}

// Export singleton instance
export default new ApiService();