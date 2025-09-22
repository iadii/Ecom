import { useState } from 'react'
import { useEmail } from '../../contexts/EmailContext'

export default function SubscriberManagement() {
  const { 
    subscribers, 
    addSubscriber, 
    removeSubscriber, 
    updateSubscriber 
  } = useEmail()
  
  const [isAddingSubscriber, setIsAddingSubscriber] = useState(false)
  const [newSubscriber, setNewSubscriber] = useState({
    name: '',
    email: '',
    segment: '',
    tags: ''
  })
  const [filters, setFilters] = useState({
    search: '',
    segment: '',
    status: ''
  })
  const [selectedSubscribers, setSelectedSubscribers] = useState([])
  const [bulkAction, setBulkAction] = useState('')
  const [importData, setImportData] = useState('')
  const [showImport, setShowImport] = useState(false)

  const segments = [...new Set(subscribers.map(sub => sub.segment).filter(Boolean))]
  const tags = [...new Set(subscribers.flatMap(sub => sub.tags || []))]

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = !filters.search || 
      subscriber.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      subscriber.email.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesSegment = !filters.segment || subscriber.segment === filters.segment
    const matchesStatus = !filters.status || subscriber.status === filters.status
    
    return matchesSearch && matchesSegment && matchesStatus
  })

  const handleAddSubscriber = (e) => {
    e.preventDefault()
    if (!newSubscriber.name || !newSubscriber.email) {
      alert('Name and email are required')
      return
    }

    const subscriberData = {
      ...newSubscriber,
      tags: newSubscriber.tags ? newSubscriber.tags.split(',').map(tag => tag.trim()) : []
    }

    addSubscriber(subscriberData)
    setNewSubscriber({ name: '', email: '', segment: '', tags: '' })
    setIsAddingSubscriber(false)
    alert('Subscriber added successfully!')
  }

  const handleDeleteSubscriber = (subscriberId) => {
    if (confirm('Are you sure you want to delete this subscriber?')) {
      removeSubscriber(subscriberId)
    }
  }

  const handleUpdateSubscriberStatus = (subscriberId, status) => {
    updateSubscriber(subscriberId, { status })
  }

  const handleBulkAction = () => {
    if (!bulkAction || selectedSubscribers.length === 0) return

    switch (bulkAction) {
      case 'delete':
        if (confirm(`Delete ${selectedSubscribers.length} subscribers?`)) {
          selectedSubscribers.forEach(id => removeSubscriber(id))
          setSelectedSubscribers([])
        }
        break
      case 'activate':
        selectedSubscribers.forEach(id => updateSubscriber(id, { status: 'active' }))
        setSelectedSubscribers([])
        break
      case 'deactivate':
        selectedSubscribers.forEach(id => updateSubscriber(id, { status: 'inactive' }))
        setSelectedSubscribers([])
        break
    }
    setBulkAction('')
  }

  const handleImport = () => {
    if (!importData.trim()) return

    const lines = importData.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const emailIndex = headers.findIndex(h => h.includes('email'))
    const nameIndex = headers.findIndex(h => h.includes('name'))
    
    if (emailIndex === -1) {
      alert('Email column not found. Please ensure your CSV has an email column.')
      return
    }

    let imported = 0
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const email = values[emailIndex]
      const name = nameIndex !== -1 ? values[nameIndex] : email.split('@')[0]
      
      if (email && email.includes('@')) {
        addSubscriber({
          name,
          email,
          segment: 'imported',
          tags: ['imported']
        })
        imported++
      }
    }

    alert(`Successfully imported ${imported} subscribers`)
    setImportData('')
    setShowImport(false)
  }

  const exportSubscribers = () => {
    const csvContent = [
      'Name,Email,Segment,Status,Subscribed Date',
      ...filteredSubscribers.map(sub => 
        `${sub.name},"${sub.email}",${sub.segment || ''},${sub.status},${new Date(sub.subscribedAt).toLocaleDateString()}`
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'subscribers.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#222222]">Subscriber Management</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowImport(true)}
            className="px-4 py-2 border border-[#6C1D57] text-[#6C1D57] rounded-md hover:bg-[#6C1D57] hover:text-white transition-colors"
          >
            Import CSV
          </button>
          <button
            onClick={exportSubscribers}
            className="px-4 py-2 border border-[#E5E7EB] text-[#555555] rounded-md hover:bg-[#F5F5F7] transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={() => setIsAddingSubscriber(true)}
            className="px-4 py-2 bg-[#6C1D57] text-white rounded-md hover:bg-[#5A1749] transition-colors"
          >
            Add Subscriber
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-[#E5E7EB]">
          <h3 className="text-sm font-medium text-[#555555]">Total Subscribers</h3>
          <p className="text-2xl font-semibold text-[#222222]">{subscribers.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-[#E5E7EB]">
          <h3 className="text-sm font-medium text-[#555555]">Active</h3>
          <p className="text-2xl font-semibold text-[#2D6A4F]">
            {subscribers.filter(s => s.status === 'active').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-[#E5E7EB]">
          <h3 className="text-sm font-medium text-[#555555]">Inactive</h3>
          <p className="text-2xl font-semibold text-[#E63946]">
            {subscribers.filter(s => s.status === 'inactive').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-[#E5E7EB]">
          <h3 className="text-sm font-medium text-[#555555]">Segments</h3>
          <p className="text-2xl font-semibold text-[#6C1D57]">{segments.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-[#E5E7EB] mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search subscribers..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C1D57] focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={filters.segment}
              onChange={(e) => setFilters(prev => ({ ...prev, segment: e.target.value }))}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C1D57] focus:border-transparent"
            >
              <option value="">All Segments</option>
              {segments.map(segment => (
                <option key={segment} value={segment}>{segment}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C1D57] focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div>
            <button
              onClick={() => setFilters({ search: '', segment: '', status: '' })}
              className="w-full px-3 py-2 border border-[#E5E7EB] text-[#555555] rounded-md hover:bg-[#F5F5F7] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedSubscribers.length > 0 && (
        <div className="bg-[#F5F5F7] p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <span className="text-[#555555]">
              {selectedSubscribers.length} subscriber(s) selected
            </span>
            <div className="flex items-center gap-3">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C1D57] focus:border-transparent"
              >
                <option value="">Bulk Actions</option>
                <option value="activate">Activate</option>
                <option value="deactivate">Deactivate</option>
                <option value="delete">Delete</option>
              </select>
              <button
                onClick={handleBulkAction}
                disabled={!bulkAction}
                className="px-4 py-2 bg-[#6C1D57] text-white rounded-md hover:bg-[#5A1749] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscribers Table */}
      <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F5F7]">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSubscribers(filteredSubscribers.map(s => s.id))
                      } else {
                        setSelectedSubscribers([])
                      }
                    }}
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#555555]">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#555555]">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#555555]">Segment</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#555555]">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#555555]">Subscribed</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#555555]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.map((subscriber) => (
                <tr key={subscriber.id} className="border-t border-[#E5E7EB]">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedSubscribers.includes(subscriber.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSubscribers(prev => [...prev, subscriber.id])
                        } else {
                          setSelectedSubscribers(prev => prev.filter(id => id !== subscriber.id))
                        }
                      }}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-[#222222]">{subscriber.name}</td>
                  <td className="px-4 py-3 text-sm text-[#555555]">{subscriber.email}</td>
                  <td className="px-4 py-3 text-sm">
                    {subscriber.segment && (
                      <span className="px-2 py-1 bg-[#F5F5F7] text-[#555555] rounded-full text-xs">
                        {subscriber.segment}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      subscriber.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {subscriber.status || 'active'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#555555]">
                    {new Date(subscriber.subscribedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateSubscriberStatus(
                          subscriber.id, 
                          subscriber.status === 'active' ? 'inactive' : 'active'
                        )}
                        className={`px-2 py-1 text-xs rounded ${
                          subscriber.status === 'active'
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {subscriber.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteSubscriber(subscriber.id)}
                        className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredSubscribers.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-[#222222] mb-2">No subscribers found</h3>
            <p className="text-[#555555]">Try adjusting your filters or add some subscribers.</p>
          </div>
        )}
      </div>

      {/* Add Subscriber Modal */}
      {isAddingSubscriber && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="border-b border-[#E5E7EB] p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-[#222222]">Add New Subscriber</h3>
                <button
                  onClick={() => setIsAddingSubscriber(false)}
                  className="text-[#555555] hover:text-[#222222]"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <form onSubmit={handleAddSubscriber} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newSubscriber.name}
                  onChange={(e) => setNewSubscriber(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C1D57] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={newSubscriber.email}
                  onChange={(e) => setNewSubscriber(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C1D57] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">Segment</label>
                <input
                  type="text"
                  value={newSubscriber.segment}
                  onChange={(e) => setNewSubscriber(prev => ({ ...prev, segment: e.target.value }))}
                  placeholder="e.g., customers, prospects"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C1D57] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">Tags</label>
                <input
                  type="text"
                  value={newSubscriber.tags}
                  onChange={(e) => setNewSubscriber(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="Comma-separated tags"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C1D57] focus:border-transparent"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddingSubscriber(false)}
                  className="px-4 py-2 border border-[#E5E7EB] text-[#555555] rounded-md hover:bg-[#F5F5F7] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6C1D57] text-white rounded-md hover:bg-[#5A1749] transition-colors"
                >
                  Add Subscriber
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="border-b border-[#E5E7EB] p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-[#222222]">Import Subscribers</h3>
                <button
                  onClick={() => setShowImport(false)}
                  className="text-[#555555] hover:text-[#222222]"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">
                  CSV Data
                </label>
                <textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Paste CSV data here (Name,Email format)"
                  rows={8}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C1D57] focus:border-transparent font-mono text-sm"
                />
              </div>
              <div className="text-sm text-[#555555]">
                <p className="mb-2"><strong>Format:</strong> First row should contain headers</p>
                <p>Example:</p>
                <code className="block bg-[#F5F5F7] p-2 rounded text-xs">
                  Name,Email<br />
                  John Doe,john@example.com<br />
                  Jane Smith,jane@example.com
                </code>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowImport(false)}
                  className="px-4 py-2 border border-[#E5E7EB] text-[#555555] rounded-md hover:bg-[#F5F5F7] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  className="px-4 py-2 bg-[#6C1D57] text-white rounded-md hover:bg-[#5A1749] transition-colors"
                >
                  Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}