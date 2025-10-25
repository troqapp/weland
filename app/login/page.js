'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const router = useRouter()

  const handleAuth = async () => {
    if (!email || !password) {
      alert('Please enter both email and password')
      return
    }

    setLoading(true)
    
    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) throw error
        if (data.user) {
          router.push('/wecard')
        }
      } else {
        // Sign Up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        
        if (error) throw error
        if (data.user) {
          alert('Account created successfully!')
          router.push('/wecard')
        }
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white p-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-black mb-6">
          ← Back
        </Link>

        <h1 className="text-2xl font-bold text-center mb-2">Weland</h1>
        <p className="text-gray-600 text-center mb-8">Create Your Digital Identity</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="border-t border-gray-300 my-6"></div>
        
        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : (isLogin ? 'Log In' : 'Sign Up')}
        </button>
        
        <p className="text-center text-gray-600 my-6">- OR -</p>
        
        <div className="space-y-3">
          <button className="w-full border border-gray-300 py-4 rounded-lg font-medium hover:bg-gray-50">
            Continue with Google
          </button>
          <button className="w-full border border-gray-300 py-4 rounded-lg font-medium hover:bg-gray-50">
            Continue with Facebook
          </button>
          <button className="w-full border border-gray-300 py-4 rounded-lg font-medium hover:bg-gray-50">
            Continue with Apple
          </button>
        </div>
        
        <div className="text-center mt-6">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-600 hover:text-black"
          >
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="font-bold">{isLogin ? 'Sign Up' : 'Log In'}</span>
          </button>
        </div>

        <div className="mt-6 text-gray-600 text-sm text-center bg-gray-50 py-3 rounded-lg">
          🔐 Secure authentication powered by Supabase
        </div>
      </div>
    </div>
  )
}
