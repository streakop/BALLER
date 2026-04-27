"use client";

import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useSearchParams } from 'next/navigation';

function ContributeForm() {
  const searchParams = useSearchParams();
  const defaultSubjectId = searchParams?.get('subject') || '';

  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubjects() {
      const { data } = await supabase.from('subjects').select('*').order('code');
      if (data) setSubjects(data);
    }
    fetchSubjects();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;
    const subjectId = formData.get('subject_id') as string;
    const year = Number(formData.get('year'));
    const semester = Number(formData.get('semester'));
    const examType = formData.get('exam_type') as string;
    const resourceType = formData.get('resource_type') as string;
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
          year,
          semester,
          exam_type: examType,
          resource_type: resourceType,
          file_url: publicUrl,
          submitted_by: submittedBy,
          status: 'pending'
        }
      ]);

      if (dbError) throw new Error("Database error: " + dbError.message);

      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Subject</label>
          <select name="subject_id" required defaultValue={defaultSubjectId} style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--color-cf-border)', backgroundColor: '#fff' }}>
            <option value="">-- Select a Course --</option>
            {subjects.map(sub => (
              <option key={sub.id} value={sub.id}>{sub.code} - {sub.name} (Sem {sub.semester})</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Year</label>
            <input name="year" type="number" required defaultValue={new Date().getFullYear()} style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--color-cf-border)' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Semester</label>
            <input name="semester" type="number" required min={1} max={8} style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--color-cf-border)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Exam Type</label>
            <select name="exam_type" required style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--color-cf-border)' }}>
              <option value="Midterm">Midterm</option>
              <option value="Endterm">Endterm</option>
              <option value="Quiz">Quiz</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Resource Type</label>
            <select name="resource_type" required style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--color-cf-border)' }}>
              <option value="Question Paper">Question Paper</option>
              <option value="Notes">Notes</option>
              <option value="Assignment">Assignment</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Your Email/Name (Optional)</label>
          <input name="submitted_by" type="text" style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--color-cf-border)' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 'bold' }}>File (PDF only)</label>
          <input name="file" type="file" accept=".pdf" required style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--color-cf-border)' }} />
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
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ borderBottom: '1px solid var(--color-cf-border)', paddingBottom: '0.5rem' }}>Contribute Material</h2>
      <Suspense fallback={<div>Loading form...</div>}>
        <ContributeForm />
      </Suspense>
    </div>
  );
}
