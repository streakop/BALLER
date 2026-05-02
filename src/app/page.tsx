import { createClient } from '@/lib/supabase/server';
import SubjectList from '@/components/SubjectList';

export const revalidate = 60; // Cache page for 60 seconds

export default async function Home() {
  const supabase = await createClient();
  // Fetch subjects from Supabase
  const { data: subjects, error } = await supabase
    .from('subjects')
    .select('*')
    .order('code', { ascending: true });

  const hasData = subjects && subjects.length > 0;

  return (
    <div>
      {error && (
        <div style={{ padding: '1rem', border: '1px solid red', backgroundColor: '#ffeeee', color: 'red', marginBottom: '1rem' }}>
          Failed to connect to database. Make sure Supabase env vars are set.
        </div>
      )}

      {!hasData && !error && (
        <div style={{ padding: '1rem', border: '1px solid var(--color-cf-border)' }}>
          No courses are currently available. Check back later!
        </div>
      )}

      {hasData && (
        <SubjectList subjects={subjects} />
      )}
    </div>
  );
}
