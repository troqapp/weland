'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function CreatePostScreen() {
  const [content, setContent] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    getUserProfile()
  }, [])

  const getUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single()
      setUser(profile)
    }
  }

  const createPost = async () => {
    if (!content.trim()) {
      alert('Please enter some content for your post')
      return
    }

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { error } = await supabase
        .from('posts')
        .insert([
          {
            user_id: user.id,
            content: content.trim(),
            likes_count: 0,
            comments_count: 0,
            created_at: new Date()
          }
        ])

      setLoading(false)

      if (error) {
        alert('Failed to create post')
      } else {
        alert('Post created successfully!')
        router.push('/posts')
      }
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto p-6 pt-16">
        <div className="flex justify-between items-center mb-6">
          <Link href="/posts" className="text-gray-600 hover:text-black">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold">Create Post</h1>
          <div className="w-6"></div>
        </div>

        {user && (
          <p className="font-semibold text-gray-800 mb-4">{user.name}</p>
        )}
        
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-64 border border-gray-300 rounded-lg p-4 focus:outline-none focus:border-blue-500 resize-none"
        />
        
        <div className="border-t border-gray-300 my-6"></div>
        
        <button
          onClick={createPost}
          disabled={!content.trim() || loading}
          className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  )
}
