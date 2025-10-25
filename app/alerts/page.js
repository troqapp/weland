'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    // For demo, using sample data
    const sampleAlerts = [
      {
        id: '1',
        message: 'Jane Doe commented on your post.',
        additional_text: 'That\'s a great point!',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: '2',
        message: 'John Smith liked your post.',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        message: 'New post from Weland.',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '4',
        message: 'Your digital identity verification is complete.',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: '5',
        message: 'Welcome to Weland!',
        additional_text: 'Explore your new digital nation.',
        created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      }
    ]
    setAlerts(sampleAlerts)
    setLoading(false)
  }

  const clearAlerts = () => {
    if (confirm('Are you sure you want to clear all alerts?')) {
      setAlerts([])
      alert('Alerts cleared successfully')
    }
  }

  const getTimeAgo = (date) => {
    const hours = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60))
    if (hours < 24) return `${hours}h ago`
    if (hours < 48) return 'Yesterday'
    return `${Math.floor(hours / 24)} days ago`
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto p-6 pt-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Alerts</h1>
          {alerts.length > 0 && (
            <button 
              onClick={clearAlerts}
              className="text-gray-600 hover:text-black font-medium"
            >
              Clear
            </button>
          )}
        </div>
        
        {alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="border-b border-gray-100 pb-4">
                <p className="text-gray-800 mb-1">{alert.message}</p>
                <p className="text-sm text-gray-500">{getTimeAgo(alert.created_at)}</p>
                {alert.additional_text && (
                  <p className="text-sm text-gray-600 italic mt-1">{alert.additional_text}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-bold mb-2">All caught up!</h2>
            <p className="text-gray-600">You have no new alerts.</p>
          </div>
        )}
      </div>
    </div>
  )
}
