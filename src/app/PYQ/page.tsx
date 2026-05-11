import { createClient } from '@/lib/supabase/server'
import SubjectList from '@/components/SubjectList'
import { Navbar } from '@/components/Navbar'

export const revalidate = 60

export default async function Home() {
  const supabase = await createClient()

  // 🔹 get user
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .single()

    profile = data
  }

  // 🔹 fetch subjects
  const { data: subjects, error } = await supabase
    .from('subjects')
    .select('*')
    .order('code', { ascending: true })

  const hasData = subjects && subjects.length > 0

  return (
    <div>

      {error && (
        <div style={{ padding: '1rem', border: '1px solid red', backgroundColor: '#ffeeee', color: 'red', marginBottom: '1rem' }}>
          Failed to connect to database.
        </div>
      )}

      {!hasData && !error && (
        <div style={{ padding: '1rem', border: '1px solid var(--color-cf-border)' }}>
          No courses available.
        </div>
      )}

      {hasData && <SubjectList subjects={subjects} />}
    </div>
  )
}