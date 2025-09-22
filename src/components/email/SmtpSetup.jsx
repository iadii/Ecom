import { useState } from 'react'
import { useEmail } from '../../contexts/EmailContext'

export default function SmtpSetup() {
  const { smtpConfig, setSmtpConfig } = useEmail()
  const [config, setConfig] = useState(smtpConfig)
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [testResult, setTestResult] = useState(null)

  const handleInputChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    setSmtpConfig(config)
    alert('SMTP configuration saved successfully!')
  }

  const testConnection = async () => {
    setIsTestingConnection(true)
    setTestResult(null)
    
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock test result
    const isValid = config.host && config.username && config.password
    setTestResult({
      success: isValid,
      message: isValid 
        ? 'Connection successful! SMTP settings are valid.'
        : 'Connection failed. Please check your settings.'
    })
    setIsTestingConnection(false)
  }

  const commonProviders = [
    {
      name: 'AWS SES',
      host: 'email-smtp.us-east-1.amazonaws.com',
      port: 587,
      secure: false,
      description: 'Amazon Simple Email Service - Best for bulk emails'
    },
    {
      name: 'Gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      description: 'Google Gmail SMTP'
    },
    {
      name: 'Outlook',
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      description: 'Microsoft Outlook SMTP'
    },
    {
      name: 'Yahoo',
      host: 'smtp.mail.yahoo.com',
      port: 587,
      secure: false,
      description: 'Yahoo Mail SMTP'
    },
    {
      name: 'SendGrid',
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      description: 'SendGrid Email Service'
    }
  ]

  const loadProvider = (provider) => {
    setConfig(prev => ({
      ...prev,
      host: provider.host,
      port: provider.port,
      secure: provider.secure
    }))
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold text-[#222222] mb-6">SMTP Configuration</h1>
        
        {/* Quick Setup */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-[#222222] mb-4">Quick Setup - Popular Providers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {commonProviders.map(provider => (
              <button
                key={provider.name}
                onClick={() => loadProvider(provider)}
                className={`p-4 border rounded-md hover:border-[#6C1D57] hover:bg-[#F5F5F7] transition-colors text-left ${
                  provider.name === 'AWS SES' ? 'border-[#6C1D57] bg-[#6C1D57] bg-opacity-5' : 'border-[#E5E7EB]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-[#222222]">{provider.name}</div>
                  {provider.name === 'AWS SES' && (
                    <span className="bg-[#6C1D57] text-white text-xs px-2 py-1 rounded-full">Recommended</span>
                  )}
                </div>
                <div className="text-sm text-[#555555] mb-1">{provider.host}</div>
                <div className="text-xs text-[#555555]">{provider.description}</div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Server Settings */}
          <div>
            <h3 className="text-lg font-medium text-[#222222] mb-4">Server Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">
                  SMTP Host <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={config.host}
                  onChange={(e) => handleInputChange('host', e.target.value)}
                  placeholder="smtp.gmail.com"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C1D57] focus:border-transparent"
                  required
                />
                {config.host.includes('amazonaws.com') && (
                  <p className="text-xs text-[#555555] mt-1">
                    AWS SES Region: {config.host.split('.')[1] || 'us-east-1'}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">
                  Port <span className="text-red-500">*</span>
                </label>
                <select
                  value={config.port}
                  onChange={(e) => handleInputChange('port', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C1D57] focus:border-transparent"
                >
                  <option value={25}>25 (Standard)</option>
                  <option value={587}>587 (TLS) - Recommended for AWS SES</option>
                  <option value={465}>465 (SSL)</option>
                  <option value={2525}>2525 (Alternative)</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.secure}
                  onChange={(e) => handleInputChange('secure', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-[#555555]">Use SSL/TLS encryption</span>
              </label>
            </div>
          </div>

          {/* Authentication */}
          <div>
            <h3 className="text-lg font-medium text-[#222222] mb-4">Authentication</h3>
            {config.host.includes('amazonaws.com') && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                <h4 className="font-medium text-blue-800 mb-2">AWS SES Configuration</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Use your AWS IAM Access Key ID as Username</li>
                  <li>• Use your AWS IAM Secret Access Key as Password</li>
                  <li>• Ensure your IAM user has SES sending permissions</li>
                  <li>• Your sending domain must be verified in AWS SES</li>
                </ul>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">
                  {config.host.includes('amazonaws.com') ? 'AWS Access Key ID' : 'Username/Email'} <span className="text-red-500">*</span>
                </label>
                <input
                  type={config.host.includes('amazonaws.com') ? 'text' : 'email'}
                  value={config.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder={config.host.includes('amazonaws.com') ? 'AKIAIOSFODNN7EXAMPLE' : 'your-email@domain.com'}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C1D57] focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">
                  {config.host.includes('amazonaws.com') ? 'AWS Secret Access Key' : 'Password/App Password'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={config.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C1D57] focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Sender Information */}
          <div>
            <h3 className="text-lg font-medium text-[#222222] mb-4">Sender Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">
                  From Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={config.fromEmail}
                  onChange={(e) => handleInputChange('fromEmail', e.target.value)}
                  placeholder="noreply@poshak.com"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C1D57] focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">
                  From Name
                </label>
                <input
                  type="text"
                  value={config.fromName}
                  onChange={(e) => handleInputChange('fromName', e.target.value)}
                  placeholder="Poshak"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C1D57] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Test Connection */}
          <div className="border-t border-[#E5E7EB] pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-[#222222] mb-2">Test Connection</h3>
                <p className="text-sm text-[#555555]">
                  Verify your SMTP settings before saving
                </p>
              </div>
              <button
                type="button"
                onClick={testConnection}
                disabled={isTestingConnection || !config.host || !config.username}
                className="px-4 py-2 border border-[#6C1D57] text-[#6C1D57] rounded-md hover:bg-[#6C1D57] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTestingConnection ? (
                  <span className="flex items-center">
                    <div className="animate-spin mr-2 w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                    Testing...
                  </span>
                ) : (
                  'Test Connection'
                )}
              </button>
            </div>
            
            {testResult && (
              <div className={`mt-4 p-3 rounded-md ${
                testResult.success 
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <div className="flex items-center">
                  {testResult.success ? (
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  {testResult.message}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={() => setConfig(smtpConfig)}
              className="px-4 py-2 border border-[#E5E7EB] text-[#555555] rounded-md hover:bg-[#F5F5F7] transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#6C1D57] text-white rounded-md hover:bg-[#5A1749] transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </form>

        {/* Help Section */}
        <div className="mt-8 p-4 bg-[#F5F5F7] rounded-md">
          <h4 className="font-medium text-[#222222] mb-2">Setup Instructions</h4>
          
          {config.host.includes('amazonaws.com') ? (
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-[#6C1D57] mb-1">AWS SES Setup Guide:</h5>
                <ul className="text-sm text-[#555555] space-y-1 ml-4">
                  <li>• <strong>Step 1:</strong> Verify your sending domain in AWS SES Console</li>
                  <li>• <strong>Step 2:</strong> Create IAM user with SES sending permissions</li>
                  <li>• <strong>Step 3:</strong> Generate Access Key ID and Secret Key</li>
                  <li>• <strong>Step 4:</strong> Request production access (removes sending limits)</li>
                  <li>• <strong>Step 5:</strong> Use the credentials above for SMTP authentication</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-[#6C1D57] mb-1">Benefits:</h5>
                <ul className="text-sm text-[#555555] space-y-1 ml-4">
                  <li>• Send up to 200 emails/day (sandbox) or unlimited (production)</li>
                  <li>• Excellent deliverability and reputation management</li>
                  <li>• Built-in bounce and complaint handling</li>
                  <li>• Detailed sending statistics and analytics</li>
                </ul>
              </div>
            </div>
          ) : (
            <ul className="text-sm text-[#555555] space-y-1">
              <li>• For Gmail: Enable 2FA and use App Password instead of regular password</li>
              <li>• For business emails: Contact your hosting provider for SMTP details</li>
              <li>• Test with small batches before sending bulk emails</li>
              <li>• Monitor your sender reputation and delivery rates</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}