import { useState } from 'react'
import EmailDashboard from '../components/email/EmailDashboard'
import CampaignCreator from '../components/email/CampaignCreator'
import EmailTemplateDesigner from '../components/email/EmailTemplateDesigner'
import SubscriberManagement from '../components/email/SubscriberManagement'
import SmtpSetup from '../components/email/SmtpSetup'
import AwsSesSetup from '../components/email/AwsSesSetup'

export default function EmailMarketing() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [settingsTab, setSettingsTab] = useState('smtp')

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'campaigns', name: 'Campaigns', icon: '📧' },
    { id: 'templates', name: 'Templates', icon: '📝' },
    { id: 'subscribers', name: 'Subscribers', icon: '👥' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <EmailDashboard />
      case 'campaigns':
        return <CampaignCreator />
      case 'templates':
        return <EmailTemplateDesigner />
      case 'subscribers':
        return <SubscriberManagement />
      case 'settings':
        return renderSettingsContent()
      default:
        return <EmailDashboard />
    }
  }

  const renderSettingsContent = () => {
    return (
      <div className="max-w-7xl mx-auto px-6">
        {/* Settings Sub-navigation */}
        <div className="mb-6">
          <div className="border-b border-[#E5E7EB]">
            <nav className="flex space-x-8">
              <button
                onClick={() => setSettingsTab('smtp')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  settingsTab === 'smtp'
                    ? 'border-[#6C1D57] text-[#6C1D57]'
                    : 'border-transparent text-[#555555] hover:text-[#222222]'
                }`}
              >
                📧 SMTP Configuration
              </button>
              <button
                onClick={() => setSettingsTab('aws-ses')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  settingsTab === 'aws-ses'
                    ? 'border-[#6C1D57] text-[#6C1D57]'
                    : 'border-transparent text-[#555555] hover:text-[#222222]'
                }`}
              >
                ☁️ AWS SES Setup
                <span className="ml-2 bg-[#6C1D57] text-white text-xs px-2 py-1 rounded-full">Recommended</span>
              </button>
            </nav>
          </div>
        </div>
        
        {/* Settings Content */}
        <div>
          {settingsTab === 'smtp' ? <SmtpSetup /> : <AwsSesSetup />}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-semibold text-[#222222]">Email Marketing</h1>
              <p className="text-sm text-[#555555]">Manage your email campaigns and subscribers</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-[#555555]">
                Welcome to Poshak Email Marketing
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#6C1D57] text-[#6C1D57]'
                    : 'border-transparent text-[#555555] hover:text-[#222222] hover:border-[#E5E7EB]'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="py-8">
        {renderContent()}
      </div>
    </div>
  )
}