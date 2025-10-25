'use client'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-6">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-md w-full border border-white/20">
        <div className="text-5xl text-center mb-3 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-bold">
          ✦
        </div>
        <h1 className="text-3xl font-bold text-center text-black mb-2">Weland</h1>
        <p className="text-gray-600 text-center mb-8 leading-relaxed">
          Create Your Digital Identity.<br />Join the virtual nation.
        </p>
        
        <div className="bg-blue-50 rounded-xl p-5 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
              ✓
            </div>
            <span className="text-gray-800">Create your digital identity card</span>
          </div>
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
              ✓
            </div>
            <span className="text-gray-800">Connect with virtual communities</span>
          </div>
          <div className="flex items-center mb-4">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
              ✓
            </div>
            <span className="text-gray-800">Share posts and engage with others</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
              ✓
            </div>
            <span className="text-gray-800">Real-time messaging and alerts</span>
          </div>
        </div>

        <Link href="/login" className="block w-full">
          <button className="w-full bg-black text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg animate-pulse">
            Start Now ↗
          </button>
        </Link>

        <div className="mt-6 text-gray-600 text-sm text-center bg-gray-50 py-3 rounded-lg">
          💡 For best experience, use the mobile app with Expo Go
        </div>
      </div>
    </div>
  )
    }
