"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminPage() {
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    const { data: contributions, error } = await supabase
      .from('contributions')
      .select('*, subjects(code, name)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (!error && contributions) {
      setPending(contributions);
    }
    setLoading(false);
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    if (!confirm(`Are you sure you want to ${action} this contribution?`)) return;

    // Reject flow: Just mark as rejected or delete
    if (action === 'reject') {
      await supabase.from('contributions').update({ status: 'rejected' }).eq('id', id);
      fetchPending();
      return;
    }

    // Approve flow: Move data to resources table
    const item = pending.find(c => c.id === id);
    if (item && action === 'approve') {
      // 1. Insert into resources
      const { error: insertError } = await supabase.from('resources').insert([{
        subject_id: item.subject_id,
        semester: item.semester,
        exam_type: item.exam_type,
        slot: item.slot,
        faculty: item.faculty,
        resource_type: item.resource_type,
        file_url: item.file_url,
        file_name: `${item.exam_type} - ${item.resource_type}`,
        verified: true
      }]);

      if (!insertError) {
        // 2. Mark contribution as approved
        await supabase.from('contributions').update({ status: 'approved' }).eq('id', id);
        fetchPending();
      } else {
        alert("Error approving: " + insertError.message);
      }
    }
  };


  return (
    <div>
      <h2>Admin Dashboard: Pending Contributions</h2>
      <button onClick={fetchPending} style={{ marginBottom: '1rem', padding: '0.25rem 0.5rem' }}>Refresh</button>
      
      {loading ? (
        <p>Loading...</p>
      ) : pending.length === 0 ? (
        <p>No pending contributions.</p>
      ) : (
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr>
                <th style={{ width: '15%' }}>Date</th>
                <th style={{ width: '15%' }}>Subject</th>
                <th style={{ width: '10%' }}>Semester</th>
                <th style={{ width: '10%' }}>Slot</th>
                <th style={{ width: '10%' }}>Faculty</th>
                <th style={{ width: '15%' }}>Type</th>
                <th style={{ width: '15%' }}>Submitted By</th>
                <th style={{ width: '10%' }}>File</th>
                <th style={{ width: '15%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((item) => (
                <tr key={item.id}>
                  <td>{new Date(item.created_at).toLocaleDateString()}</td>
                  <td>{item.subjects?.code}</td>
                  <td>{item.semester}</td>
                  <td>{item.slot || '-'}</td>
                  <td>{item.faculty || '-'}</td>
                  <td>{item.exam_type} - {item.resource_type}</td>
                  <td>{item.submitted_by || 'Anonymous'}</td>
                  <td>
                    <a href={item.file_url} target="_blank" rel="noopener noreferrer">View</a>
                  </td>
                  <td>
                    <button onClick={() => handleAction(item.id, 'approve')} style={{ color: 'green', marginRight: '0.5rem' }}>Approve</button>
                    <button onClick={() => handleAction(item.id, 'reject')} style={{ color: 'red' }}>Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
