'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function WecardDetailsScreen() {
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const createWecard = async () => {
    if (!name.trim()) {
      alert('Please enter your name')
      return
    }

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .insert([
          { 
            id: user.id,
            name: name.trim(),
            date_of_birth: dob.trim(),
            username: user.email.split('@')[0],
            created_at: new Date()
          }
        ])

      setLoading(false)

      if (error) {
        alert('Failed to create profile')
      } else {
        alert('Wecard created successfully!')
        router.push('/posts')
      }
    }
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-md mx-auto pt-12">
        <h1 className="text-2xl font-bold mb-6">Wecard Details</h1>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Name</label>
            <input
              type="text"
              placeholder="David Miller"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Date of Birth</label>
            <input
              type="text"
              placeholder="25 / 08 / 1998"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="border-t border-gray-300 my-6"></div>
        
        <button
          onClick={createWecard}
          disabled={!name.trim() || loading}
          className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Wecard'}
        </button>
      </div>
    </div>
  )
                }
