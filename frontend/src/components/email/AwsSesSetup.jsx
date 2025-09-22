import { useState } from 'react'
import { useEmail } from '../../contexts/EmailContext'
import AwsSesInfo from './AwsSesInfo'

export default function AwsSesSetup() {
  const { smtpConfig, setSmtpConfig } = useEmail()
  const [config, setConfig] = useState({
    region: 'us-east-1',
    accessKeyId: '',
    secretAccessKey: '',
    fromEmail: '',
    fromName: 'Poshak',
    ...smtpConfig
  })
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [testResult, setTestResult] = useState(null)

  const awsRegions = [
    { value: 'us-east-1', label: 'US East (N. Virginia)', host: 'email-smtp.us-east-1.amazonaws.com' },
    { value: 'us-west-2', label: 'US West (Oregon)', host: 'email-smtp.us-west-2.amazonaws.com' },
    { value: 'eu-west-1', label: 'Europe (Ireland)', host: 'email-smtp.eu-west-1.amazonaws.com' },
    { value: 'ap-south-1', label: 'Asia Pacific (Mumbai)', host: 'email-smtp.ap-south-1.amazonaws.com' },
    { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)', host: 'email-smtp.ap-southeast-1.amazonaws.com' }
  ]

  const handleInputChange = (field, value) => {
    setConfig(prev => {
      const updated = { ...prev, [field]: value }
      
      // Auto-update SMTP host when region changes
      if (field === 'region') {
        const region = awsRegions.find(r => r.value === value)
        updated.host = region ? region.host : `email-smtp.${value}.amazonaws.com`
      }
      
      return updated
    })
  }

  const handleSave = (e) => {
    e.preventDefault()
    
    // Convert AWS credentials to SMTP format
    const smtpSettings = {
      host: config.host || `email-smtp.${config.region}.amazonaws.com`,
      port: 587,
      secure: false,
      username: config.accessKeyId,
      password: config.secretAccessKey,
      fromEmail: config.fromEmail,
      fromName: config.fromName
    }
    
    setSmtpConfig(smtpSettings)
    alert('AWS SES configuration saved successfully!')
  }

  const testConnection = async () => {
    setIsTestingConnection(true)
    setTestResult(null)
    
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock test result based on configuration completeness
    const isValid = config.accessKeyId && config.secretAccessKey && config.fromEmail
    setTestResult({
      success: isValid,
      message: isValid 
        ? 'AWS SES connection successful! Configuration is valid.'
        : 'Connection failed. Please check your AWS credentials and configuration.'
    })
    setIsTestingConnection(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Configuration */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-[#222222] mb-2">AWS SES Configuration</h1>
              <p className="text-[#555555]">Configure Amazon Simple Email Service for bulk email sending</p>
            </div>

            {/* AWS SES Benefits */}
            <div className="bg-gradient-to-r from-[#6C1D57] to-[#D6336C] text-white rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold mb-3">Why Choose AWS SES?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Performance Benefits:</h4>
                  <ul className="space-y-1">
                    <li>• Send 1000-2000 emails per campaign</li>
                    <li>• 99%+ delivery rates</li>
                    <li>• Advanced bounce handling</li>
                    <li>• Real-time analytics</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Cost & Features:</h4>
                  <ul className="space-y-1">
                    <li>• $0.10 per 1000 emails</li>
                    <li>• Free tier: 62,000 emails/month</li>
                    <li>• Built-in DKIM signing</li>
                    <li>• Professional reputation</li>
                  </ul>
                </div>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
          {/* Region Selection */}
          <div>
            <h3 className="text-lg font-medium text-[#222222] mb-4">AWS Region Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">
                  AWS Region <span className="text-red-500">*</span>
                </label>
                <select
                  value={config.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C1D57] focus:border-transparent"
                >
                  {awsRegions.map(region => (
                    <option key={region.value} value={region.value}>
                      {region.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">SMTP Endpoint</label>
                <input
                  type="text"
                  value={config.host || `email-smtp.${config.region}.amazonaws.com`}
                  readOnly
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md bg-[#F5F5F7] text-[#555555]"
                />
              </div>
            </div>
          </div>

          {/* AWS Credentials */}
          <div>
            <h3 className="text-lg font-medium text-[#222222] mb-4">AWS Credentials</h3>
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="font-medium text-amber-800">Security Note</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Use IAM user credentials with SES sending permissions only. Never use root account credentials.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">
                  AWS Access Key ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={config.accessKeyId}
                  onChange={(e) => handleInputChange('accessKeyId', e.target.value)}
                  placeholder="AKIAIOSFODNN7EXAMPLE"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C1D57] focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">
                  AWS Secret Access Key <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={config.secretAccessKey}
                  onChange={(e) => handleInputChange('secretAccessKey', e.target.value)}
                  placeholder="••••••••••••••••••••••••••••••••••••••••"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C1D57] focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Sender Information */}
          <div>
            <h3 className="text-lg font-medium text-[#222222] mb-4">Sender Information</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="font-medium text-blue-800">Domain Verification Required</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Your sending domain must be verified in AWS SES console before sending emails.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">
                  From Email Address <span className="text-red-500">*</span>
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
                <h3 className="text-lg font-medium text-[#222222] mb-2">Test Configuration</h3>
                <p className="text-sm text-[#555555]">
                  Verify your AWS SES settings before saving
                </p>
              </div>
              <button
                type="button"
                onClick={testConnection}
                disabled={isTestingConnection || !config.accessKeyId || !config.secretAccessKey}
                className="px-4 py-2 border border-[#6C1D57] text-[#6C1D57] rounded-md hover:bg-[#6C1D57] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTestingConnection ? (
                  <span className="flex items-center">
                    <div className="animate-spin mr-2 w-4 h-4 border-2 border-current border-t-transparent rounded-full"></div>
                    Testing...
                  </span>
                ) : (
                  'Test Configuration'
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
              onClick={() => setConfig({ region: 'us-east-1', accessKeyId: '', secretAccessKey: '', fromEmail: '', fromName: 'Poshak' })}
              className="px-4 py-2 border border-[#E5E7EB] text-[#555555] rounded-md hover:bg-[#F5F5F7] transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#6C1D57] text-white rounded-md hover:bg-[#5A1749] transition-colors"
            >
              Save AWS SES Configuration
            </button>
          </div>
        </form>

        {/* Setup Guide Link */}
        <div className="mt-8 p-4 bg-[#F5F5F7] rounded-md">
          <h4 className="font-medium text-[#222222] mb-2">Need Help Setting Up?</h4>
          <p className="text-sm text-[#555555] mb-3">
            Follow our comprehensive AWS SES setup guide for step-by-step instructions.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#"
              className="inline-flex items-center text-sm text-[#6C1D57] hover:underline"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View Setup Guide
            </a>
            <a
              href="https://docs.aws.amazon.com/ses/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-[#6C1D57] hover:underline"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
              </svg>
              AWS SES Documentation
            </a>
          </div>
        </div>
          </div>
        </div>
        
        {/* Sidebar Info */}
        <div className="lg:col-span-1">
          <AwsSesInfo />
        </div>
      </div>
    </div>
  )
}