import { useState } from 'react'
import { useEmail } from '../../contexts/EmailContext'

export default function EmailTemplateDesigner() {
  const { templates, addEmailTemplate, updateEmailTemplate, deleteEmailTemplate } = useEmail()
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [templateData, setTemplateData] = useState({
    name: '',
    subject: '',
    content: '',
    type: 'promotional'
  })

  const predefinedTemplates = [
    {
      name: 'Welcome Email',
      subject: 'Welcome to Poshak - Your Fashion Journey Begins!',
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FDFDFD;">
          <div style="background: #6C1D57; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to Poshak</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Discover authentic Indian fashion</p>
          </div>
          <div style="padding: 30px 20px;">
            <h2 style="color: #222222; margin-bottom: 20px;">Hello {{name}}!</h2>
            <p style="color: #555555; line-height: 1.6; margin-bottom: 20px;">
              Thank you for joining the Poshak family! We're excited to help you discover beautiful traditional and modern Indian clothing that celebrates your style.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{shop_url}}" style="background: #6C1D57; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Start Shopping
              </a>
            </div>
            <p style="color: #555555; line-height: 1.6;">
              As a welcome gift, enjoy <strong>15% off</strong> your first order with code: <strong>WELCOME15</strong>
            </p>
          </div>
          <div style="background: #F5F5F7; padding: 20px; text-align: center; color: #555555; font-size: 14px;">
            <p>© 2024 Poshak. All rights reserved.</p>
          </div>
        </div>
      `,
      type: 'welcome'
    },
    {
      name: 'Product Promotion',
      subject: 'New Collection Alert - {{collection_name}} is Here!',
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FDFDFD;">
          <div style="background: linear-gradient(135deg, #6C1D57, #D6336C); color: white; padding: 30px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 32px;">{{collection_name}}</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px;">New Collection Launch</p>
          </div>
          <div style="padding: 30px 20px;">
            <h2 style="color: #222222; text-align: center; margin-bottom: 30px;">Discover Your Perfect Style</h2>
            <div style="text-align: center; margin: 30px 0;">
              <img src="{{product_image}}" alt="Featured Product" style="max-width: 100%; height: auto; border-radius: 8px;">
            </div>
            <p style="color: #555555; line-height: 1.6; text-align: center; margin-bottom: 30px;">
              Explore our latest collection featuring exquisite designs that blend traditional craftsmanship with contemporary style.
            </p>
            <div style="text-align: center;">
              <a href="{{collection_url}}" style="background: #6C1D57; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; margin-right: 10px;">
                Shop Collection
              </a>
              <a href="{{wishlist_url}}" style="background: #D6336C; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                View Wishlist
              </a>
            </div>
          </div>
          <div style="background: #F5F5F7; padding: 20px; text-align: center; color: #555555; font-size: 14px;">
            <p>© 2024 Poshak. All rights reserved.</p>
            <p><a href="{{unsubscribe_url}}" style="color: #6C1D57;">Unsubscribe</a></p>
          </div>
        </div>
      `,
      type: 'promotional'
    },
    {
      name: 'Newsletter',
      subject: 'Poshak Weekly - Fashion Updates & Style Tips',
      content: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FDFDFD;">
          <div style="background: #222222; color: white; padding: 25px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Poshak Weekly</h1>
            <p style="margin: 5px 0 0 0; color: #FADADD;">Fashion & Style Updates</p>
          </div>
          <div style="padding: 30px 20px;">
            <h2 style="color: #6C1D57; margin-bottom: 20px;">This Week's Highlights</h2>
            <div style="border-left: 4px solid #6C1D57; padding-left: 20px; margin-bottom: 25px;">
              <h3 style="color: #222222; margin: 0 0 10px 0;">Style Tip of the Week</h3>
              <p style="color: #555555; line-height: 1.6; margin: 0;">
                Mix traditional pieces with modern accessories to create a contemporary ethnic look that's perfect for any occasion.
              </p>
            </div>
            <div style="background: #F5F5F7; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #222222; margin: 0 0 15px 0;">Featured Products</h3>
              <p style="color: #555555; line-height: 1.6; margin: 0 0 15px 0;">
                Check out our handpicked selection of trending pieces this week.
              </p>
              <a href="{{featured_url}}" style="color: #6C1D57; text-decoration: none; font-weight: bold;">
                View Featured Items →
              </a>
            </div>
            <div style="text-align: center;">
              <a href="{{shop_url}}" style="background: #6C1D57; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Visit Store
              </a>
            </div>
          </div>
          <div style="background: #F5F5F7; padding: 20px; text-align: center; color: #555555; font-size: 14px;">
            <p>© 2024 Poshak. All rights reserved.</p>
            <p><a href="{{unsubscribe_url}}" style="color: #6C1D57;">Unsubscribe</a></p>
          </div>
        </div>
      `,
      type: 'newsletter'
    }
  ]

  const handleCreateNew = () => {
    setSelectedTemplate(null)
    setTemplateData({
      name: '',
      subject: '',
      content: '',
      type: 'promotional'
    })
    setIsEditing(true)
  }

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template)
    setTemplateData(template)
    setIsEditing(true)
  }

  const handleSaveTemplate = () => {
    if (!templateData.name || !templateData.subject || !templateData.content) {
      alert('Please fill in all required fields')
      return
    }

    if (selectedTemplate) {
      updateEmailTemplate(selectedTemplate.id, templateData)
    } else {
      addEmailTemplate(templateData)
    }
    
    setIsEditing(false)
    setSelectedTemplate(null)
    alert('Template saved successfully!')
  }

  const handleUsePredefined = (predefined) => {
    setTemplateData({
      ...predefined,
      name: predefined.name + ' - Copy'
    })
    setSelectedTemplate(null)
    setIsEditing(true)
  }

  const handleDeleteTemplate = (templateId) => {
    if (confirm('Are you sure you want to delete this template?')) {
      deleteEmailTemplate(templateId)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#222222]">Email Templates</h1>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-[#6C1D57] text-white rounded-md hover:bg-[#5A1749] transition-colors"
        >
          Create New Template
        </button>
      </div>

      {!isEditing ? (
        <div className="space-y-8">
          {/* Predefined Templates */}
          <div>
            <h2 className="text-lg font-medium text-[#222222] mb-4">Predefined Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {predefinedTemplates.map((template, index) => (
                <div key={index} className="bg-white border border-[#E5E7EB] rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-[#222222]">{template.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      template.type === 'welcome' ? 'bg-green-100 text-green-800' :
                      template.type === 'promotional' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {template.type}
                    </span>
                  </div>
                  <p className="text-sm text-[#555555] mb-3">{template.subject}</p>
                  <button
                    onClick={() => handleUsePredefined(template)}
                    className="w-full px-3 py-2 border border-[#6C1D57] text-[#6C1D57] rounded-md hover:bg-[#6C1D57] hover:text-white transition-colors"
                  >
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Templates */}
          <div>
            <h2 className="text-lg font-medium text-[#222222] mb-4">Your Templates ({templates.length})</h2>
            {templates.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-[#E5E7EB]">
                <h3 className="text-lg font-medium text-[#222222] mb-2">No custom templates yet</h3>
                <p className="text-[#555555] mb-4">Create your first email template to get started</p>
                <button
                  onClick={handleCreateNew}
                  className="px-4 py-2 bg-[#6C1D57] text-white rounded-md hover:bg-[#5A1749] transition-colors"
                >
                  Create Template
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <div key={template.id} className="bg-white border border-[#E5E7EB] rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-[#222222]">{template.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        template.type === 'welcome' ? 'bg-green-100 text-green-800' :
                        template.type === 'promotional' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {template.type}
                      </span>
                    </div>
                    <p className="text-sm text-[#555555] mb-3">{template.subject}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditTemplate(template)}
                        className="flex-1 px-3 py-2 border border-[#6C1D57] text-[#6C1D57] rounded-md hover:bg-[#6C1D57] hover:text-white transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="px-3 py-2 border border-[#E63946] text-[#E63946] rounded-md hover:bg-[#E63946] hover:text-white transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Template Editor */
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-[#E5E7EB] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#222222]">
                {selectedTemplate ? 'Edit Template' : 'Create New Template'}
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-[#E5E7EB] text-[#555555] rounded-md hover:bg-[#F5F5F7] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTemplate}
                  className="px-4 py-2 bg-[#6C1D57] text-white rounded-md hover:bg-[#5A1749] transition-colors"
                >
                  Save Template
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Template Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">
                  Template Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={templateData.name}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter template name"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C1D57] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">Template Type</label>
                <select
                  value={templateData.type}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C1D57] focus:border-transparent"
                >
                  <option value="promotional">Promotional</option>
                  <option value="newsletter">Newsletter</option>
                  <option value="welcome">Welcome</option>
                  <option value="transactional">Transactional</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#555555] mb-2">
                Subject Line <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={templateData.subject}
                onChange={(e) => setTemplateData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Enter email subject"
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C1D57] focus:border-transparent"
              />
            </div>

            {/* HTML Editor */}
            <div>
              <label className="block text-sm font-medium text-[#555555] mb-2">
                Email Content (HTML) <span className="text-red-500">*</span>
              </label>
              <textarea
                value={templateData.content}
                onChange={(e) => setTemplateData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter HTML content for your email"
                rows={20}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C1D57] focus:border-transparent font-mono text-sm"
              />
            </div>

            {/* Variables Help */}
            <div className="bg-[#F5F5F7] p-4 rounded-md">
              <h4 className="font-medium text-[#222222] mb-2">Available Variables</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-[#555555]">
                <code>{{name}}</code>
                <code>{{email}}</code>
                <code>{{shop_url}}</code>
                <code>{{product_image}}</code>
                <code>{{collection_url}}</code>
                <code>{{unsubscribe_url}}</code>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}