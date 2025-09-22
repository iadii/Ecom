import { useState } from 'react'
import { useEmail } from '../../contexts/EmailContext'

export default function CampaignCreator() {
  const { 
    templates, 
    getActiveSubscribers, 
    getSubscribersBySegment,
    addCampaign,
    sendBulkEmail 
  } = useEmail()
  
  const [campaignData, setCampaignData] = useState({
    name: '',
    subject: '',
    templateId: '',
    audienceType: 'all', // 'all', 'segment', 'custom'
    segment: '',
    customEmails: '',
    scheduledAt: '',
    isScheduled: false
  })
  
  const [isCreating, setIsCreating] = useState(false)
  const [step, setStep] = useState(1) // 1: Details, 2: Audience, 3: Review
  const [previewData, setPreviewData] = useState(null)

  const subscribers = getActiveSubscribers()
  const segments = [...new Set(subscribers.map(sub => sub.segment).filter(Boolean))]

  const getAudienceCount = () => {
    switch (campaignData.audienceType) {
      case 'all':
        return subscribers.length
      case 'segment':
        return campaignData.segment ? getSubscribersBySegment(campaignData.segment).length : 0
      case 'custom':
        return campaignData.customEmails ? campaignData.customEmails.split(',').filter(email => email.trim()).length : 0
      default:
        return 0
    }
  }

  const getAudienceList = () => {
    switch (campaignData.audienceType) {
      case 'all':
        return subscribers
      case 'segment':
        return campaignData.segment ? getSubscribersBySegment(campaignData.segment) : []
      case 'custom':
        if (!campaignData.customEmails) return []
        return campaignData.customEmails
          .split(',')
          .map(email => email.trim())
          .filter(email => email)
          .map(email => ({ email, name: 'Custom Contact' }))
      default:
        return []
    }
  }

  const handleCreateCampaign = async () => {
    if (!campaignData.name || !campaignData.subject || !campaignData.templateId) {
      alert('Please fill in all required fields')
      return
    }

    const audienceList = getAudienceList()
    if (audienceList.length === 0) {
      alert('No recipients selected')
      return
    }

    setIsCreating(true)
    
    try {
      const campaign = {
        ...campaignData,
        recipientCount: audienceList.length,
        createdAt: new Date().toISOString()
      }
      
      addCampaign(campaign)
      
      if (!campaignData.isScheduled) {
        // Send immediately
        const template = templates.find(t => t.id === campaignData.templateId)
        await sendBulkEmail(campaign.id, audienceList, template)
      }
      
      alert(campaignData.isScheduled ? 'Campaign scheduled successfully!' : 'Campaign sent successfully!')
      
      // Reset form
      setCampaignData({
        name: '',
        subject: '',
        templateId: '',
        audienceType: 'all',
        segment: '',
        customEmails: '',
        scheduledAt: '',
        isScheduled: false
      })
      setStep(1)
    } catch (error) {
      alert('Error creating campaign: ' + error.message)
    } finally {
      setIsCreating(false)
    }
  }

  const handlePreview = () => {
    const template = templates.find(t => t.id === campaignData.templateId)
    if (!template) return

    const sampleData = {
      name: 'John Doe',
      email: 'john@example.com',
      shop_url: 'https://poshak.com',
      collection_url: 'https://poshak.com/collections/new',
      product_image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      unsubscribe_url: 'https://poshak.com/unsubscribe'
    }

    let previewContent = template.content
    Object.keys(sampleData).forEach(key => {
      previewContent = previewContent.replace(new RegExp(`{{${key}}}`, 'g'), sampleData[key])
    })

    setPreviewData({
      subject: campaignData.subject,
      content: previewContent
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="border-b border-[#E5E7EB] p-6">
          <h1 className="text-2xl font-semibold text-[#222222] mb-2">Create Email Campaign</h1>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-4 mt-4">
            {[1, 2, 3].map(stepNum => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum 
                    ? 'bg-[#6C1D57] text-white' 
                    : 'bg-[#E5E7EB] text-[#555555]'
                }`}>
                  {stepNum}
                </div>
                <span className={`ml-2 text-sm ${
                  step >= stepNum ? 'text-[#222222]' : 'text-[#555555]'
                }`}>
                  {stepNum === 1 ? 'Campaign Details' : stepNum === 2 ? 'Select Audience' : 'Review & Send'}
                </span>
                {stepNum < 3 && <div className="w-8 h-px bg-[#E5E7EB] mx-4"></div>}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Campaign Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">
                  Campaign Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={campaignData.name}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter campaign name"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C1D57] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">
                  Subject Line <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={campaignData.subject}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter email subject"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C1D57] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">
                  Email Template <span className="text-red-500">*</span>
                </label>
                <select
                  value={campaignData.templateId}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, templateId: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C1D57] focus:border-transparent"
                >
                  <option value="">Select a template</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name} ({template.type})
                    </option>
                  ))}
                </select>
                {campaignData.templateId && (
                  <button
                    onClick={handlePreview}
                    className="mt-2 text-sm text-[#6C1D57] hover:underline"
                  >
                    Preview Template
                  </button>
                )}
              </div>

              {/* Scheduling */}
              <div className="border-t border-[#E5E7EB] pt-6">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="schedule"
                    checked={campaignData.isScheduled}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, isScheduled: e.target.checked }))}
                    className="mr-3"
                  />
                  <label htmlFor="schedule" className="text-sm font-medium text-[#555555]">
                    Schedule for later
                  </label>
                </div>
                
                {campaignData.isScheduled && (
                  <div>
                    <label className="block text-sm font-medium text-[#555555] mb-2">
                      Schedule Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={campaignData.scheduledAt}
                      onChange={(e) => setCampaignData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                      min={new Date().toISOString().slice(0, 16)}
                      className="px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C1D57] focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!campaignData.name || !campaignData.subject || !campaignData.templateId}
                  className="px-6 py-2 bg-[#6C1D57] text-white rounded-md hover:bg-[#5A1749] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Select Audience
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Select Audience */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-4">Select Audience</label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="audienceType"
                      value="all"
                      checked={campaignData.audienceType === 'all'}
                      onChange={(e) => setCampaignData(prev => ({ ...prev, audienceType: e.target.value }))}
                      className="mr-3"
                    />
                    <div>
                      <span className="font-medium">All Subscribers</span>
                      <span className="text-[#555555] ml-2">({subscribers.length} contacts)</span>
                    </div>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="audienceType"
                      value="segment"
                      checked={campaignData.audienceType === 'segment'}
                      onChange={(e) => setCampaignData(prev => ({ ...prev, audienceType: e.target.value }))}
                      className="mr-3"
                    />
                    <span className="font-medium">By Segment</span>
                  </label>

                  {campaignData.audienceType === 'segment' && (
                    <div className="ml-6">
                      <select
                        value={campaignData.segment}
                        onChange={(e) => setCampaignData(prev => ({ ...prev, segment: e.target.value }))}
                        className="px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C1D57] focus:border-transparent"
                      >
                        <option value="">Select segment</option>
                        {segments.map(segment => (
                          <option key={segment} value={segment}>
                            {segment} ({getSubscribersBySegment(segment).length} contacts)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="audienceType"
                      value="custom"
                      checked={campaignData.audienceType === 'custom'}
                      onChange={(e) => setCampaignData(prev => ({ ...prev, audienceType: e.target.value }))}
                      className="mr-3"
                    />
                    <span className="font-medium">Custom Email List</span>
                  </label>

                  {campaignData.audienceType === 'custom' && (
                    <div className="ml-6">
                      <textarea
                        value={campaignData.customEmails}
                        onChange={(e) => setCampaignData(prev => ({ ...prev, customEmails: e.target.value }))}
                        placeholder="Enter email addresses separated by commas"
                        rows={4}
                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C1D57] focus:border-transparent"
                      />
                      <p className="text-sm text-[#555555] mt-1">
                        Enter emails separated by commas (e.g., user1@example.com, user2@example.com)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-[#F5F5F7] p-4 rounded-md">
                <h4 className="font-medium text-[#222222] mb-2">Audience Summary</h4>
                <p className="text-[#555555]">
                  <strong>{getAudienceCount()}</strong> recipients will receive this campaign
                </p>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2 border border-[#E5E7EB] text-[#555555] rounded-md hover:bg-[#F5F5F7] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={getAudienceCount() === 0}
                  className="px-6 py-2 bg-[#6C1D57] text-white rounded-md hover:bg-[#5A1749] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Review
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Send */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-[#222222]">Review Campaign</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-[#222222]">Campaign Details</h4>
                    <p className="text-[#555555]"><strong>Name:</strong> {campaignData.name}</p>
                    <p className="text-[#555555]"><strong>Subject:</strong> {campaignData.subject}</p>
                    <p className="text-[#555555]"><strong>Template:</strong> {templates.find(t => t.id === campaignData.templateId)?.name}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-[#222222]">Audience</h4>
                    <p className="text-[#555555]"><strong>Type:</strong> {campaignData.audienceType}</p>
                    <p className="text-[#555555]"><strong>Recipients:</strong> {getAudienceCount()}</p>
                    {campaignData.segment && (
                      <p className="text-[#555555]"><strong>Segment:</strong> {campaignData.segment}</p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium text-[#222222]">Scheduling</h4>
                    <p className="text-[#555555]">
                      <strong>Send:</strong> {campaignData.isScheduled ? `Scheduled for ${new Date(campaignData.scheduledAt).toLocaleString()}` : 'Immediately'}
                    </p>
                  </div>
                </div>

                <div className="bg-[#F5F5F7] p-4 rounded-md">
                  <h4 className="font-medium text-[#222222] mb-2">Sending Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Recipients:</span>
                      <span className="font-medium">{getAudienceCount()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-medium">{campaignData.isScheduled ? 'Scheduled' : 'Ready to Send'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2 border border-[#E5E7EB] text-[#555555] rounded-md hover:bg-[#F5F5F7] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateCampaign}
                  disabled={isCreating}
                  className="px-6 py-2 bg-[#6C1D57] text-white rounded-md hover:bg-[#5A1749] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <span className="flex items-center">
                      <div className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      {campaignData.isScheduled ? 'Scheduling...' : 'Sending...'}
                    </span>
                  ) : (
                    campaignData.isScheduled ? 'Schedule Campaign' : 'Send Campaign'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="border-b border-[#E5E7EB] p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-[#222222]">Email Preview</h3>
                <button
                  onClick={() => setPreviewData(null)}
                  className="text-[#555555] hover:text-[#222222]"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-[#555555] mt-1">Subject: {previewData.subject}</p>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div dangerouslySetInnerHTML={{ __html: previewData.content }} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}