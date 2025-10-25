'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function ProfileScreen() {
  const [profile, setProfile] = useState({
    name: 'Amelia Anderson',
    username: '@amelia.anderson',
    date_of_birth: 'August 24, 1990',
    bio: 'Digital nomad exploring the world one byte at a time. Coffee enthusiast, code whisperer, and a firm believer in the power of virtual communities.'
  })
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const updateProfile = async () => {
    if (!profile.name.trim()) {
      alert('Please enter your name')
      return
    }

    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setIsEditing(false)
      alert('Profile updated successfully!')
    }, 1000)
  }

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out?')) {
      const { error } = await supabase.auth.signOut()
      if (error) {
        alert('Failed to log out')
      } else {
        router.push('/')
      }
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto p-6 pt-16">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Name</label>
            {isEditing ? (
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-800 py-2">{profile.name}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Username</label>
            {isEditing ? (
              <input
                type="text"
                value={profile.username}
                onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-800 py-2">{profile.username}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Date of Birth</label>
            {isEditing ? (
              <input
                type="text"
                value={profile.date_of_birth}
                onChange={(e) => setProfile(prev => ({ ...prev, date_of_birth: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-800 py-2">{profile.date_of_birth}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Bio</label>
            {isEditing ? (
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 h-32 resize-none"
              />
            ) : (
              <p className="text-gray-800 py-2 leading-relaxed">{profile.bio}</p>
            )}
          </div>
        </div>
        
        {isEditing ? (
          <div className="flex space-x-4 mt-8">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-lg font-semibold hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={updateProfile}
              disabled={loading || !profile.name.trim()}
              className="flex-1 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 mt-8"
          >
            Edit Profile
          </button>
        )}
        
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-4 rounded-lg font-semibold hover:bg-red-600 mt-4"
        >
          Log Out
        </button>
      </div>
    </div>
  )
}
