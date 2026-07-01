import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Supabase가 설정되지 않은 경우 null 반환
  if (!url || url === 'your-supabase-project-url' || !key || key === 'your-supabase-anon-key') {
    return null
  }

  return createBrowserClient(url, key)
}
