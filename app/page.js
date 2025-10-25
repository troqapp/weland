'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function MessagesScreen() {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    // Sample conversations data
    const sampleConversations = [
      {
        id: '1',
        participant_name: 'Ethan',
        last_message: 'Hey, how\'s it going?',
        last_message_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
        unread_count: 2
      },
      {
        id: '2',
        participant_name: 'Olivia',
        last_message: 'Did you see the new designs?',
        last_message_at: new Date(Date.now() - 3 * 60 * 60 * 1000),
        unread_count: 1
      },
      {
        id: '3',
        participant_name: 'Liam',
        last_message: 'Let\'s catch up later this week.',
        last_message_at: new Date(Date.now() - 24 * 60 * 60 * 1000),
        unread_count: 1
      },
      {
        id: '4',
        participant_name: 'Sophia',
        last_message: 'Thanks for sending that over!',
        last_message_at: new Date(Date.now() - 24 * 60 * 60 * 1000),
        unread_count: 1
      },
      {
        id: '5',
        participant_name: 'Noah',
        last_message: 'Perfect!',
        last_message_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        unread_count: 0
      }
    ]
    
    setConversations(sampleConversations)
    setLoading(false)
  }

  const markAsRead = (conversationId) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unread_count: 0 }
          : conv
      )
    )
  }

  const formatTime = (date) => {
    const messageDate = new Date(date)
    const now = new Date()
    const diffHours = (now - messageDate) / (1000 * 60 * 60)
    
    if (diffHours < 24) {
      return messageDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }).toUpperCase().replace(' ', '')
    } else if (diffHours < 48) {
      return 'Yesterday'
    } else {
      return `${Math.floor(diffHours / 24)}d ago`
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto p-6 pt-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Messages</h1>
          <button className="text-black font-semibold hover:text-gray-700">
            New
          </button>
        </div>
        
        {conversations.length > 0 ? (
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <div 
                key={conversation.id}
                onClick={() => markAsRead(conversation.id)}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold">
                    {conversation.participant_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{conversation.participant_name}</h3>
                    <p className="text-gray-600 text-sm">{conversation.last_message}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">{formatTime(conversation.last_message_at)}</p>
                  {conversation.unread_count > 0 && (
                    <span className="bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conversation.unread_count}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-bold mb-2">No conversations yet</h2>
            <p className="text-gray-600 mb-4">Start a conversation with someone!</p>
            <button className="bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800">
              Start New Conversation
            </button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-2xl mx-auto flex justify-around p-4">
          <Link href="/posts" className="text-gray-600 hover:text-black">
            📝
          </Link>
          <Link href="/alerts" className="text-gray-600 hover:text-black">
            🔔
          </Link>
          <Link href="/" className="text-black font-bold">
            💬
          </Link>
          <Link href="/profile" className="text-gray-600 hover:text-black">
            👤
          </Link>
        </div>
      </nav>
    </div>
  )
}
