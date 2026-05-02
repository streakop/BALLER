import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const revalidate = 0; // Don't cache the history page

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Fetch view history for the user
  const { data: history, error } = await supabase
    .from('view_history')
    .select(`
      id,
      viewed_at,
      resource_id,
      resources (
        id,
        year,
        semester,
        exam_type,
        resource_type,
        file_name,
        file_url,
        subject_id,
        subjects (
          id,
          code,
          name
        )
      )
    `)
    .eq('user_id', user.id)
    .order('viewed_at', { ascending: false })

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ borderBottom: '1px solid var(--color-cf-border)', paddingBottom: '0.5rem' }}>
        My History
      </h2>
      <p style={{ color: '#555', marginBottom: '2rem' }}>
        Resources you have recently opened.
      </p>

      {(!history || history.length === 0) ? (
        <div style={{ padding: '1rem', border: '1px solid var(--color-cf-border)', backgroundColor: '#fafafa' }}>
          You haven't opened any resources yet.
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th style={{ width: '20%' }}>Opened</th>
              <th style={{ width: '30%' }}>Subject</th>
              <th style={{ width: '35%' }}>Resource</th>
              <th style={{ width: '15%' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry: any) => {
              const res = entry.resources;
              if (!res) return null;
              
              const sub = res.subjects;
              const date = new Date(entry.viewed_at).toLocaleDateString();
              
              return (
                <tr key={entry.id}>
                  <td>{date}</td>
                  <td>
                    {sub ? (
                      <Link href={`/subjects/${sub.id}`}>
                        {sub.code}
                      </Link>
                    ) : 'Unknown'}
                  </td>
                  <td>
                    {res.exam_type} - {res.resource_type} ({res.year})
                  </td>
                  <td>
                    <a href={res.file_url} target="_blank" rel="noopener noreferrer">
                      Open Again
                    </a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
