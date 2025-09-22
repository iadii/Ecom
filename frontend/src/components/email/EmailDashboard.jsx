import { useState } from 'react'
import { useEmail } from '../../contexts/EmailContext'

export default function EmailDashboard() {
  const { campaigns, analytics, updateCampaign, deleteCampaign, templates } = useEmail()
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [filterStatus, setFilterStatus] = useState('')
  
  const filteredCampaigns = campaigns.filter(campaign => 
    !filterStatus || campaign.status === filterStatus
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'sending': return 'bg-yellow-100 text-yellow-800'
      case 'sent': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        )
      case 'scheduled':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        )
      case 'sending':
        return (
          <svg className="w-4 h-4 animate-spin" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" />
          </svg>
        )
      case 'sent':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      case 'failed':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )
      default:
        return null
    }
  }

  const handleDeleteCampaign = (campaignId) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      deleteCampaign(campaignId)
    }
  }

  const handleDuplicateCampaign = (campaign) => {
    const duplicatedCampaign = {
      ...campaign,
      name: `${campaign.name} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString()
    }
    delete duplicatedCampaign.id
    delete duplicatedCampaign.sentAt
    delete duplicatedCampaign.completedAt
    
    // This would need to be handled by the context
    alert('Campaign duplicated! (Feature would be implemented in context)')
  }

  const totalSent = campaigns.reduce((sum, c) => sum + (c.sentCount || 0), 0)
  const totalCampaigns = campaigns.length
  const activeCampaigns = campaigns.filter(c => c.status === 'sending' || c.status === 'scheduled').length

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-[#222222] mb-6">Email Marketing Dashboard</h1>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg border border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#555555]">Total Campaigns</p>
              <p className="text-2xl font-semibold text-[#222222]">{totalCampaigns}</p>
            </div>
            <div className="p-3 bg-[#6C1D57] bg-opacity-10 rounded-full">
              <svg className="w-6 h-6 text-[#6C1D57]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#555555]">Emails Sent</p>
              <p className="text-2xl font-semibold text-[#222222]">{totalSent.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-[#2D6A4F] bg-opacity-10 rounded-full">
              <svg className="w-6 h-6 text-[#2D6A4F]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#555555]">Active Campaigns</p>
              <p className="text-2xl font-semibold text-[#222222]">{activeCampaigns}</p>
            </div>
            <div className="p-3 bg-[#D6336C] bg-opacity-10 rounded-full">
              <svg className="w-6 h-6 text-[#D6336C]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#555555]">Success Rate</p>
              <p className="text-2xl font-semibold text-[#222222]">
                {totalCampaigns > 0 ? Math.round((campaigns.filter(c => c.status === 'sent').length / totalCampaigns) * 100) : 0}%
              </p>
            </div>
            <div className="p-3 bg-[#FBBF24] bg-opacity-10 rounded-full">
              <svg className="w-6 h-6 text-[#FBBF24]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
        <div className="p-4 border-b border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-[#222222]">Recent Campaigns</h2>
            <div className="flex items-center gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C1D57] focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="sending">Sending</option>
                <option value="sent">Sent</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F5F7]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#555555]">Campaign</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#555555]">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#555555]">Recipients</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#555555]">Progress</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#555555]">Created</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#555555]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign.id} className="border-t border-[#E5E7EB] hover:bg-[#F5F5F7]">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-[#222222]">{campaign.name}</p>
                      <p className="text-sm text-[#555555]">{campaign.subject}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {getStatusIcon(campaign.status)}
                      <span className="ml-1 capitalize">{campaign.status}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#555555]">
                    {campaign.recipientCount?.toLocaleString() || 0}
                  </td>
                  <td className="px-4 py-3">
                    {campaign.status === 'sending' && campaign.progress !== undefined ? (
                      <div className="w-full bg-[#E5E7EB] rounded-full h-2">
                        <div
                          className="bg-[#6C1D57] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${campaign.progress}%` }}
                        ></div>
                      </div>
                    ) : campaign.status === 'sent' ? (
                      <span className="text-sm text-[#2D6A4F]">Complete</span>
                    ) : (
                      <span className="text-sm text-[#555555]">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#555555]">
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedCampaign(campaign)}
                        className="text-[#6C1D57] hover:text-[#5A1749] text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDuplicateCampaign(campaign)}
                        className="text-[#555555] hover:text-[#222222] text-sm"
                      >
                        Duplicate
                      </button>
                      {campaign.status === 'draft' && (
                        <button
                          onClick={() => handleDeleteCampaign(campaign.id)}
                          className="text-[#E63946] hover:text-[#DC2626] text-sm"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📧</div>
            <h3 className="text-lg font-medium text-[#222222] mb-2">No campaigns found</h3>
            <p className="text-[#555555] mb-4">Create your first email campaign to get started</p>
          </div>
        )}
      </div>

      {/* Campaign Detail Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="border-b border-[#E5E7EB] p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-[#222222]">Campaign Details</h3>
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="text-[#555555] hover:text-[#222222]"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-[#222222] mb-3">Campaign Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-[#555555]">Name:</span>
                      <p className="font-medium">{selectedCampaign.name}</p>
                    </div>
                    <div>
                      <span className="text-[#555555]">Status:</span>
                      <p className={`font-medium ${
                        selectedCampaign.status === 'sent' ? 'text-[#2D6A4F]' :
                        selectedCampaign.status === 'failed' ? 'text-[#E63946]' :
                        'text-[#6C1D57]'
                      }`}>
                        {selectedCampaign.status.charAt(0).toUpperCase() + selectedCampaign.status.slice(1)}
                      </p>
                    </div>
                    <div>
                      <span className="text-[#555555]">Subject:</span>
                      <p className="font-medium">{selectedCampaign.subject}</p>
                    </div>
                    <div>
                      <span className="text-[#555555]">Recipients:</span>
                      <p className="font-medium">{selectedCampaign.recipientCount?.toLocaleString() || 0}</p>
                    </div>
                    <div>
                      <span className="text-[#555555]">Created:</span>
                      <p className="font-medium">{new Date(selectedCampaign.createdAt).toLocaleString()}</p>
                    </div>
                    {selectedCampaign.sentAt && (
                      <div>
                        <span className="text-[#555555]">Sent:</span>
                        <p className="font-medium">{new Date(selectedCampaign.sentAt).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedCampaign.status === 'sending' && (
                  <div>
                    <h4 className="font-medium text-[#222222] mb-3">Sending Progress</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{selectedCampaign.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-[#E5E7EB] rounded-full h-3">
                        <div
                          className="bg-[#6C1D57] h-3 rounded-full transition-all duration-300"
                          style={{ width: `${selectedCampaign.progress || 0}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-[#555555]">
                        <span>Sent: {selectedCampaign.sentCount || 0}</span>
                        <span>Total: {selectedCampaign.recipientCount || 0}</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedCampaign.status === 'sent' && (
                  <div>
                    <h4 className="font-medium text-[#222222] mb-3">Campaign Results</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#F5F5F7] p-3 rounded-md">
                        <p className="text-sm text-[#555555]">Emails Sent</p>
                        <p className="text-lg font-semibold text-[#222222]">{selectedCampaign.sentCount || 0}</p>
                      </div>
                      <div className="bg-[#F5F5F7] p-3 rounded-md">
                        <p className="text-sm text-[#555555]">Delivery Rate</p>
                        <p className="text-lg font-semibold text-[#2D6A4F]">
                          {selectedCampaign.sentCount ? Math.round((selectedCampaign.sentCount / selectedCampaign.recipientCount) * 100) : 0}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-[#222222] mb-3">Template Used</h4>
                  <div className="bg-[#F5F5F7] p-3 rounded-md">
                    <p className="font-medium">
                      {templates.find(t => t.id === selectedCampaign.templateId)?.name || 'Unknown Template'}
                    </p>
                    <p className="text-sm text-[#555555]">
                      {templates.find(t => t.id === selectedCampaign.templateId)?.type || 'Unknown Type'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}