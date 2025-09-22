import { createContext, useContext, useReducer, useEffect } from 'react'
import sampleSubscribers from '../data/sample-subscribers.json'

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
  
  // Load email data from localStorage on mount
  useEffect(() => {
    const savedEmailData = localStorage.getItem('poshak-email-data')
    if (savedEmailData) {
      dispatch({ type: 'LOAD_EMAIL_DATA', payload: JSON.parse(savedEmailData) })
    } else {
      // Load sample data for demonstration
      dispatch({ type: 'LOAD_EMAIL_DATA', payload: { subscribers: sampleSubscribers } })
    }
  }, [])
  
  // Save email data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('poshak-email-data', JSON.stringify(state))
  }, [state])
  
  const setSmtpConfig = (config) => {
    dispatch({ type: 'SET_SMTP_CONFIG', payload: config })
  }
  
  const addSubscriber = (subscriber) => {
    dispatch({ type: 'ADD_SUBSCRIBER', payload: subscriber })
  }
  
  const removeSubscriber = (subscriberId) => {
    dispatch({ type: 'REMOVE_SUBSCRIBER', payload: subscriberId })
  }
  
  const updateSubscriber = (subscriberId, updates) => {
    dispatch({ type: 'UPDATE_SUBSCRIBER', payload: { id: subscriberId, updates } })
  }
  
  const addCampaign = (campaign) => {
    dispatch({ type: 'ADD_CAMPAIGN', payload: campaign })
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
  
  // Mock email sending function (in real app, this would call backend API)
  const sendBulkEmail = async (campaignId, recipients, template) => {
    const campaign = state.campaigns.find(c => c.id === campaignId)
    if (!campaign) throw new Error('Campaign not found')
    
    // Simulate sending process
    updateCampaign(campaignId, { 
      status: 'sending',
      sentAt: new Date().toISOString(),
      totalRecipients: recipients.length
    })
    
    // Simulate async sending with progress
    for (let i = 0; i < recipients.length; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100))
      const sent = Math.min(i + 10, recipients.length)
      updateCampaign(campaignId, {
        sentCount: sent,
        progress: Math.round((sent / recipients.length) * 100)
      })
    }
    
    // Mark as completed
    updateCampaign(campaignId, {
      status: 'sent',
      completedAt: new Date().toISOString(),
      sentCount: recipients.length,
      progress: 100
    })
    
    return { success: true, sent: recipients.length }
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
      sendBulkEmail
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