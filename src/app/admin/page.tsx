"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const [passcode, setPasscode] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Use a hardcoded passcode for initial minimal setup as agreed
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'admin123') { // In production, this goes to an API wrapper or proper auth
      setAuthenticated(true);
      fetchPending();
    } else {
      alert("Invalid Passcode");
    }
  };

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
        year: item.year,
        semester: item.semester,
        exam_type: item.exam_type,
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

  if (!authenticated) {
    return (
      <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
        <h2>Admin Authentication</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="password" 
            placeholder="Passcode" 
            value={passcode} 
            onChange={(e) => setPasscode(e.target.value)} 
            style={{ padding: '0.5rem', border: '1px solid var(--color-cf-border)' }} 
          />
          <button type="submit" style={{ padding: '0.5rem', cursor: 'pointer' }}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>Admin Dashboard: Pending Contributions</h2>
      <button onClick={fetchPending} style={{ marginBottom: '1rem', padding: '0.25rem 0.5rem' }}>Refresh</button>
      
      {loading ? (
        <p>Loading...</p>
      ) : pending.length === 0 ? (
        <p>No pending contributions.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th style={{ width: '15%' }}>Date</th>
              <th style={{ width: '15%' }}>Subject</th>
              <th style={{ width: '10%' }}>Year/Sem</th>
              <th style={{ width: '20%' }}>Type</th>
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
                <td>{item.year} / Sem {item.semester}</td>
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
      )}
    </div>
  );
}
