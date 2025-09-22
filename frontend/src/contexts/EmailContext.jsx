import { createContext, useContext, useReducer, useEffect } from 'react'
import sampleSubscribers from '../data/sample-subscribers.json'
import apiService from '../services/apiService'

const EmailContext = createContext()

const emailReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SMTP_CONFIG':
      return {
        ...state,
        smtpConfig: action.payload
      }
    
    case 'ADD_SUBSCRIBER':
      const existingSubscriber = state.subscribers.find(
        sub => sub.email === action.payload.email
      )
      if (existingSubscriber) {
        return state
      }
      return {
        ...state,
        subscribers: [...state.subscribers, {
          ...action.payload,
          id: Date.now().toString(),
          subscribedAt: new Date().toISOString(),
          status: 'active'
        }]
      }
    
    case 'REMOVE_SUBSCRIBER':
      return {
        ...state,
        subscribers: state.subscribers.filter(sub => sub.id !== action.payload)
      }
    
    case 'UPDATE_SUBSCRIBER':
      return {
        ...state,
        subscribers: state.subscribers.map(sub =>
          sub.id === action.payload.id ? { ...sub, ...action.payload.updates } : sub
        )
      }
    
    case 'ADD_CAMPAIGN':
      return {
        ...state,
        campaigns: [...state.campaigns, {
          ...action.payload,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          status: 'draft'
        }]
      }
    
    case 'UPDATE_CAMPAIGN':
      return {
        ...state,
        campaigns: state.campaigns.map(campaign =>
          campaign.id === action.payload.id 
            ? { ...campaign, ...action.payload.updates }
            : campaign
        )
      }
    
    case 'DELETE_CAMPAIGN':
      return {
        ...state,
        campaigns: state.campaigns.filter(campaign => campaign.id !== action.payload)
      }
    
    case 'ADD_EMAIL_TEMPLATE':
      return {
        ...state,
        templates: [...state.templates, {
          ...action.payload,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        }]
      }
    
    case 'UPDATE_EMAIL_TEMPLATE':
      return {
        ...state,
        templates: state.templates.map(template =>
          template.id === action.payload.id
            ? { ...template, ...action.payload.updates }
            : template
        )
      }
    
    case 'DELETE_EMAIL_TEMPLATE':
      return {
        ...state,
        templates: state.templates.filter(template => template.id !== action.payload)
      }
    
    case 'LOAD_EMAIL_DATA':
      return {
        ...state,
        ...action.payload
      }
    
    default:
      return state
  }
}

const initialState = {
  smtpConfig: {
    host: '',
    port: 587,
    secure: false,
    username: '',
    password: '',
    fromEmail: '',
    fromName: 'Poshak'
  },
  subscribers: [],
  campaigns: [],
  templates: [],
  analytics: {
    totalSent: 0,
    totalDelivered: 0,
    totalOpened: 0,
    totalClicked: 0,
    bounceRate: 0
  }
}

export const EmailProvider = ({ children }) => {
  const [state, dispatch] = useReducer(emailReducer, initialState)
  
  // Load email data on mount and initialize backend connection
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Check if backend is available and initialize email service
        await apiService.initializeEmailService()
        
        // Load campaigns from backend
        const campaigns = await apiService.getCampaigns()
        
        // Load subscribers from backend  
        const subscribersData = await apiService.getSubscribers()
        const subscribers = subscribersData.subscribers || []
        
        dispatch({ 
          type: 'LOAD_EMAIL_DATA', 
          payload: { 
            campaigns: campaigns || [],
            subscribers: subscribers.length > 0 ? subscribers : sampleSubscribers
          } 
        })
      } catch (error) {
        console.warn('Backend not available, using localStorage fallback:', error)
        
        // Fallback to localStorage if backend is not available
        const savedEmailData = localStorage.getItem('poshak-email-data')
        if (savedEmailData) {
          dispatch({ type: 'LOAD_EMAIL_DATA', payload: JSON.parse(savedEmailData) })
        } else {
          // Load sample data for demonstration
          dispatch({ type: 'LOAD_EMAIL_DATA', payload: { subscribers: sampleSubscribers } })
        }
      }
    }
    
    initializeData()
  }, [])
  
  // Save email data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('poshak-email-data', JSON.stringify(state))
  }, [state])
  
  const setSmtpConfig = async (config) => {
    try {
      // Configure backend email service
      const result = await apiService.configureEmailService(config)
      if (result.success) {
        dispatch({ type: 'SET_SMTP_CONFIG', payload: config })
        return result
      } else {
        throw new Error(result.message || 'Configuration failed')
      }
    } catch (error) {
      console.error('SMTP configuration failed:', error)
      // Fallback to local storage
      dispatch({ type: 'SET_SMTP_CONFIG', payload: config })
      throw error
    }
  }
  
  const addSubscriber = async (subscriber) => {
    try {
      const result = await apiService.createSubscriber(subscriber)
      if (result.success) {
        dispatch({ type: 'ADD_SUBSCRIBER', payload: result.subscriber })
        return result.subscriber
      }
    } catch (error) {
      console.error('Add subscriber failed:', error)
      // Fallback to local state
      dispatch({ type: 'ADD_SUBSCRIBER', payload: subscriber })
      throw error
    }
  }
  
  const removeSubscriber = (subscriberId) => {
    dispatch({ type: 'REMOVE_SUBSCRIBER', payload: subscriberId })
  }
  
  const updateSubscriber = (subscriberId, updates) => {
    dispatch({ type: 'UPDATE_SUBSCRIBER', payload: { id: subscriberId, updates } })
  }
  
  const addCampaign = async (campaign) => {
    try {
      const result = await apiService.createCampaign(campaign)
      if (result.success) {
        dispatch({ type: 'ADD_CAMPAIGN', payload: result.campaign })
        return result.campaign
      }
    } catch (error) {
      console.error('Add campaign failed:', error)
      // Fallback to local state
      dispatch({ type: 'ADD_CAMPAIGN', payload: campaign })
      throw error
    }
  }
  
  const updateCampaign = (campaignId, updates) => {
    dispatch({ type: 'UPDATE_CAMPAIGN', payload: { id: campaignId, updates } })
  }
  
  const deleteCampaign = (campaignId) => {
    dispatch({ type: 'DELETE_CAMPAIGN', payload: campaignId })
  }
  
  const addEmailTemplate = (template) => {
    dispatch({ type: 'ADD_EMAIL_TEMPLATE', payload: template })
  }
  
  const updateEmailTemplate = (templateId, updates) => {
    dispatch({ type: 'UPDATE_EMAIL_TEMPLATE', payload: { id: templateId, updates } })
  }
  
  const deleteEmailTemplate = (templateId) => {
    dispatch({ type: 'DELETE_EMAIL_TEMPLATE', payload: templateId })
  }
  
  const getActiveSubscribers = () => {
    return state.subscribers.filter(sub => sub.status === 'active')
  }
  
  const getSubscribersBySegment = (segment) => {
    return state.subscribers.filter(sub => 
      sub.status === 'active' && sub.segment === segment
    )
  }
  
  // Real email sending function using backend API
  const sendBulkEmail = async (campaignId, recipients, template) => {
    try {
      const result = await apiService.sendBulkEmail({
        campaignId,
        recipientIds: recipients.map(r => r.id),
        segments: [] // Can be extended for segment-based sending
      })
      
      if (result.success) {
        // Update campaign status
        updateCampaign(campaignId, { 
          status: 'sending',
          startedAt: new Date().toISOString()
        })
        
        return {
          success: true,
          message: result.message,
          campaignId: result.campaignId,
          recipientCount: result.recipientCount
        }
      }
      
      throw new Error(result.error || 'Bulk email failed')
    } catch (error) {
      console.error('Bulk email sending failed:', error)
      throw error
    }
  }
  
  // Test email connection
  const testEmailConnection = async () => {
    try {
      return await apiService.testEmailConnection()
    } catch (error) {
      console.error('Email connection test failed:', error)
      throw error
    }
  }
  
  // Send test email
  const sendTestEmail = async (emailData) => {
    try {
      return await apiService.sendTestEmail(emailData)
    } catch (error) {
      console.error('Test email failed:', error)
      throw error
    }
  }
  
  // Get campaign status with real-time updates
  const getCampaignStatus = async (campaignId) => {
    try {
      const status = await apiService.getCampaignStatus(campaignId)
      // Update local state with fresh data
      updateCampaign(campaignId, status)
      return status
    } catch (error) {
      console.error('Get campaign status failed:', error)
      throw error
    }
  }
  
  // Import subscribers from CSV
  const importSubscribers = async (csvFile) => {
    try {
      const result = await apiService.importSubscribers(csvFile)
      // Refresh subscribers list
      const subscribersData = await apiService.getSubscribers()
      dispatch({ 
        type: 'LOAD_EMAIL_DATA', 
        payload: { 
          ...state,
          subscribers: subscribersData.subscribers || []
        }
      })
      return result
    } catch (error) {
      console.error('Import subscribers failed:', error)
      throw error
    }
  }
  
  return (
    <EmailContext.Provider value={{
      ...state,
      setSmtpConfig,
      addSubscriber,
      removeSubscriber,
      updateSubscriber,
      addCampaign,
      updateCampaign,
      deleteCampaign,
      addEmailTemplate,
      updateEmailTemplate,
      deleteEmailTemplate,
      getActiveSubscribers,
      getSubscribersBySegment,
      sendBulkEmail,
      testEmailConnection,
      sendTestEmail,
      getCampaignStatus,
      importSubscribers
    }}>
      {children}
    </EmailContext.Provider>
  )
}

export const useEmail = () => {
  const context = useContext(EmailContext)
  if (!context) {
    throw new Error('useEmail must be used within an EmailProvider')
  }
  return context
}

export default EmailContext