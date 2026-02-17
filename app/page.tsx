'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabaseClient'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        router.push('/dashboard')
      }
    }

    checkSession()
  }, [router])

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={loginWithGoogle}
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        Login with Google
      </button>
    </div>
  )
}
