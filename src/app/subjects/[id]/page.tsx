import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ResourceList from '@/components/ResourceList';

export const revalidate = 60;

// Next 15 Dynamic page segment
export default async function SubjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  // Fetch subject details
  const { data: subject, error: subError } = await supabase
    .from('subjects')
    .select('*')
    .eq('id', id)
    .single();

  if (subError || !subject) {
    notFound();
  }

  // Fetch verified resources for the subject
  const { data: resources, error: resError } = await supabase
    .from('resources')
    .select('*')
    .eq('subject_id', id)
    .eq('verified', true)
    .order('year', { ascending: false })
    .order('semester', { ascending: false });

  const hasResources = resources && resources.length > 0;

  return (
    <div>
      <div style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-cf-border)' }}>
        <h2 style={{ margin: '0 0 0.5rem 0' }}>{subject.code} - {subject.name}</h2>
        <div style={{ fontSize: '0.9rem', color: '#555' }}>
          Semester: {subject.semester} | <Link href="/">Back to courses</Link>
        </div>
      </div>

      {!hasResources && (
        <div style={{ padding: '1rem', border: '1px solid var(--color-cf-border)' }}>
          No resources found for this subject yet. <Link href={`/contribute?subject=${subject.id}`}>Contribute one!</Link>
        </div>
      )}

      {hasResources && (
        <ResourceList resources={resources} subject={subject} />
      )}
    </div>
  );
}
