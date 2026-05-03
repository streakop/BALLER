"use client";

import { useState, useEffect, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useSearchParams, useRouter } from 'next/navigation';
import Select from 'react-select';
import Link from 'next/link';

// react-select style overrides using CSS variables directly.
// Defined outside the component so it's a stable reference and
// avoids any typeof window checks that cause hydration mismatches.
const reactSelectStyles = {
  control: (base: any) => ({
    ...base,
    backgroundColor: 'var(--color-cf-bg)',
    borderColor: 'var(--color-cf-border)',
    color: 'var(--color-cf-text)',
    boxShadow: 'none',
    '&:hover': { borderColor: 'var(--color-cf-link)' },
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: 'var(--color-cf-bg)',
    border: '1px solid var(--color-cf-border)',
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? 'var(--color-cf-header)' : 'var(--color-cf-bg)',
    color: 'var(--color-cf-text)',
  }),
  singleValue: (base: any) => ({
    ...base,
    color: 'var(--color-cf-text)',
  }),
  placeholder: (base: any) => ({
    ...base,
    color: 'color-mix(in srgb, var(--color-cf-text) 45%, transparent)',
  }),
  input: (base: any) => ({
    ...base,
    color: 'var(--color-cf-text)',
  }),
};

function ContributeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultSubjectId = searchParams?.get('subject') || '';
  const typeParam = searchParams?.get('type');

  let selectedType: string | null = null;
  if (typeParam === 'pyq') selectedType = 'Question Paper';
  if (typeParam === 'studyMaterial') selectedType = 'Study Material';
  if (typeParam === 'assignment') selectedType = 'Assignment';

  const supabase = createClient();

  const [subjects, setSubjects] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [examType, setExamType] = useState<string>('Midterm');

  useEffect(() => {
    async function fetchData() {
      const { data: subData, error: subError } = await supabase.from('subjects').select('*').order('code');
      if (subError) console.error("Error fetching subjects:", subError);
      if (subData) setSubjects(subData);

      const { data: semData, error: semError } = await supabase.from('semesters').select('*').order('name');
      if (semError) {
        console.error("Error fetching semesters:", semError);
        alert("Failed to load semesters. Did you run the SQL migration?");
      }
      if (semData) setSemesters(semData);
    }
    fetchData();
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;
    const subjectId = formData.get('subject_id') as string;
    const semester = formData.get('semester') as string;
    const examType = selectedType === 'Question Paper' ? (formData.get('exam_type') as string) : 'General';
    const slot = formData.get('slot') as string;
    const faculty = formData.get('faculty') as string;
    const resourceType = selectedType as string; // Use the state variable
    const submittedBy = formData.get('submitted_by') as string;

    if (!file || !subjectId) {
      setError("File and Subject are required.");
      setLoading(false);
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `pending/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resources-bucket')
        .upload(filePath, file);

      if (uploadError) throw new Error("File upload failed: " + uploadError.message);

      const { data: { publicUrl } } = supabase.storage
        .from('resources-bucket')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase.from('contributions').insert([
        {
          subject_id: subjectId,
          semester,
          exam_type: examType,
          slot,
          faculty,
          resource_type: resourceType,
          file_url: publicUrl,
          submitted_by: submittedBy,
          status: 'pending'
        }
      ]);

      if (dbError) throw new Error("Database error: " + dbError.message);

      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      router.push('/contribute'); // Reset back to selection screen
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  if (!selectedType) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h3>What would you like to contribute?</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
          <Link
            href="/contribute?type=pyq"
            style={{ display: 'block', textDecoration: 'none', color: 'inherit', padding: '1.5rem', fontSize: '1.1rem', backgroundColor: 'var(--color-cf-header)', border: '1px solid var(--color-cf-border)', borderRadius: '8px' }}>
            Question Paper (PYQ)
          </Link>
          <Link
            href="/contribute?type=studyMaterial"
            style={{ display: 'block', textDecoration: 'none', color: 'inherit', padding: '1.5rem', fontSize: '1.1rem', backgroundColor: 'var(--color-cf-header)', border: '1px solid var(--color-cf-border)', borderRadius: '8px' }}>
            Study Material (Notes or PPT)
          </Link>
          <Link
            href="/contribute?type=assignment"
            style={{ display: 'block', textDecoration: 'none', color: 'inherit', padding: '1.5rem', fontSize: '1.1rem', backgroundColor: 'var(--color-cf-header)', border: '1px solid var(--color-cf-border)', borderRadius: '8px' }}>
            Assignment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {success && (
        <div style={{ padding: '1rem', backgroundColor: '#e6ffe6', border: '1px solid #00cc00', marginBottom: '1rem' }}>
          Contribution submitted successfully! It is pending admin approval.
        </div>
      )}

      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#ffe6e6', border: '1px solid red', marginBottom: '1rem', color: 'red' }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-cf-header)', padding: '0.5rem 1rem', border: '1px solid var(--color-cf-border)' }}>
        <span>You are contributing: <strong>{selectedType}</strong></span>
        <Link href="/contribute" style={{ background: 'none', border: 'none', color: 'var(--color-link)', cursor: 'pointer', textDecoration: 'underline' }}>Change</Link>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Subject</label>
          <Select
            instanceId="select-subject"
            name="subject_id"
            required
            defaultValue={subjects.map(s => ({ value: s.id, label: `${s.code} - ${s.name}` })).find(o => o.value === defaultSubjectId)}
            options={subjects.map(sub => ({ value: sub.id, label: `${sub.code} - ${sub.name}` }))}
            placeholder="-- Search or Select a Course --"
            styles={reactSelectStyles}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Semester</label>
            <Select
              instanceId="select-semester"
              name="semester"
              required
              options={semesters.map(sem => ({ value: sem.name, label: sem.name }))}
              placeholder="-- Search or Select a Semester --"
              styles={reactSelectStyles}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {selectedType === 'Question Paper' && (
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Exam Type</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setExamType('Midterm')}
                  style={{
                    flex: 1,
                    padding: '0.4rem',
                    cursor: 'pointer',
                    border: examType === 'Midterm' ? '2px solid var(--color-cf-link)' : '2px solid var(--color-cf-border)',
                    backgroundColor: examType === 'Midterm' ? 'var(--color-cf-header)' : 'transparent',
                    color: examType === 'Midterm' ? 'var(--color-cf-link)' : 'var(--color-cf-text)',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  Midterm
                </button>
                <button
                  type="button"
                  onClick={() => setExamType('Endterm')}
                  style={{
                    flex: 1,
                    padding: '0.4rem',
                    cursor: 'pointer',
                    border: examType === 'Endterm' ? '2px solid var(--color-cf-link)' : '2px solid var(--color-cf-border)',
                    backgroundColor: examType === 'Endterm' ? 'var(--color-cf-header)' : 'transparent',
                    color: examType === 'Endterm' ? 'var(--color-cf-link)' : 'var(--color-cf-text)',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  Term End
                </button>
              </div>
              <input type="hidden" name="exam_type" value={examType} />
            </div>
          )}
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Slot (e.g. A11+A12)</label>
            <input
              name="slot"
              type="text"
              placeholder="e.g. A11+A12"
              pattern="^[A-Z][0-9]{2}(\+[A-Z][0-9]{2})*$"
              title="Format: A11 or A11+A12 or B21+D14. Must be capital letter followed by two numbers, separated by '+'"
              style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--color-cf-border)' }}
            />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Faculty Name</label>
            <input
              name="faculty"
              type="text"
              placeholder="e.g. Dr. Name Surname"
              style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--color-cf-border)' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Your Email/Name (Optional)</label>
          <input name="submitted_by" type="text" style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--color-cf-border)' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold' }}>File (PDF or PPT only)</label>
          <input name="file" type="file" accept=".pdf,.ppt,.pptx" required style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--color-cf-border)' }} />
        </div>

        <button type="submit" disabled={loading} style={{ padding: '0.5rem', backgroundColor: 'var(--color-cf-header)', border: '1px solid var(--color-cf-border)', fontWeight: 'bold', cursor: 'pointer' }}>
          {loading ? 'Submitting...' : 'Submit Contribution'}
        </button>
      </form>
    </>
  );
}

export default function ContributePage() {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      <h2 style={{ borderBottom: '1px solid var(--color-cf-border)', paddingBottom: '0.5rem' }}>Contribute Material</h2>
      <Suspense fallback={<div>Loading form...</div>}>
        <ContributeForm />
      </Suspense>
    </div>
  );
}
