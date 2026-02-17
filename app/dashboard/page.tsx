'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/app/lib/supabaseClient'

interface Bookmark {
  id: string
  title: string
  url: string
}

export default function Dashboard() {
  const router = useRouter()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/')
        return
      }

      setUserId(user.id)
      fetchBookmarks()

      // 🔥 Realtime subscription
      const channel = supabase
        .channel('bookmarks-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'bookmarks' },
          () => {
            fetchBookmarks()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }

    init()
  }, [router])

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .order('created_at', { ascending: false })

    setBookmarks(data || [])
  }

const addBookmark = async () => {
  if (!title || !url || !userId) return

  const { data, error } = await supabase
    .from('bookmarks')
    .insert([
      {
        title,
        url,
        user_id: userId
      }
    ])
    .select()

  if (error) {
    console.error(error)
    return
  }

  // 🔥 Immediately update UI
  setBookmarks((prev) => [...(data || []), ...prev])

  setTitle('')
  setUrl('')
}


  const deleteBookmark = async (id: string) => {
    await supabase.from('bookmarks').delete().eq('id', id)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">My Bookmarks</h1>

      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 flex-1 rounded"
        />
        <input
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={addBookmark}
          className="bg-green-600 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      <ul className="space-y-3">
        {bookmarks.map((bookmark) => (
          <li
            key={bookmark.id}
            className="flex justify-between items-center border p-3 rounded"
          >
            <a
              href={bookmark.url}
              target="_blank"
              className="text-blue-600"
            >
              {bookmark.title}
            </a>
            <button
              onClick={() => deleteBookmark(bookmark.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={logout}
        className="mt-8 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  )
}
