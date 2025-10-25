'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function PostsScreen() {
  const [posts, setPosts] = useState([])
  const [user, setUser] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchPosts()
    getUserProfile()
  }, [])

  const fetchPosts = async () => {
    setRefreshing(true)
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles (name)
      `)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setPosts(data)
    }
    setRefreshing(false)
  }

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

  const likePost = async (postId) => {
    const post = posts.find(p => p.id === postId)
    if (post) {
      const newLikesCount = (post.likes_count || 0) + 1
      
      const { error } = await supabase
        .from('posts')
        .update({ likes_count: newLikesCount })
        .eq('id', postId)

      if (!error) {
        setPosts(prev => 
          prev.map(p => 
            p.id === postId 
              ? { ...p, likes_count: newLikesCount }
              : p
          )
        )
      }
    }
  }

  const getTimeAgo = (date) => {
    const hours = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60))
    if (hours === 0) return 'Just now'
    if (hours === 1) return '1 hour ago'
    return `${hours} hours ago`
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto p-6 pt-16">
        <h1 className="text-2xl font-bold mb-6">Posts</h1>
        
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="border-b border-gray-200 pb-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900">{post.profiles?.name || 'User'}</h3>
                <span className="text-sm text-gray-500">{getTimeAgo(post.created_at)}</span>
              </div>
              <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>
              
              <div className="flex space-x-6">
                <button 
                  onClick={() => likePost(post.id)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
                >
                  <span>👍</span>
                  <span>{post.likes_count || 0}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-600 hover:text-green-600">
                  <span>💬</span>
                  <span>{post.comments_count || 0}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <Link href="/create-post">
          <button className="fixed bottom-8 right-8 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-gray-800 transition-all">
            +
          </button>
        </Link>
      </div>
    </div>
  )
}
