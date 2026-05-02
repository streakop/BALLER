'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function logResourceViewAndRedirect(resourceId: string, fileUrl: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Log the view history
    await supabase.from('view_history').insert({
      user_id: user.id,
      resource_id: resourceId
    })
  }

  // Redirect to the actual file URL
  redirect(fileUrl)
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (data.url) {
    redirect(data.url)
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
