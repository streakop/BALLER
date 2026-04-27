"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function SubjectList({ subjects }: { subjects: any[] }) {
  const [search, setSearch] = useState('');

  const filteredSubjects = subjects.filter(sub => {
    const q = search.toLowerCase();
    return sub.name.toLowerCase().includes(q) || sub.code.toLowerCase().includes(q);
  });

  const hasData = filteredSubjects.length > 0;

  return (
    <>
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Courses</h2>
        <div>
          <input 
            type="text" 
            placeholder="Search course name or code..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ 
              padding: '0.25rem 0.5rem', 
              border: '1px solid var(--color-cf-border)',
              width: '250px'
            }} 
          />
        </div>
      </div>

      {!hasData && (
        <div style={{ padding: '1rem', border: '1px solid var(--color-cf-border)' }}>
          No courses found matching "{search}".
        </div>
      )}

      {hasData && (
        <table>
          <thead>
            <tr>
              <th style={{ width: '15%' }}>Code</th>
              <th style={{ width: '55%' }}>Name</th>
              <th style={{ width: '15%' }}>Semester</th>
              <th style={{ width: '15%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubjects.map((sub: any) => (
              <tr key={sub.id}>
                <td><strong>{sub.code}</strong></td>
                <td>
                  <Link href={`/subjects/${sub.id}`}>
                    {sub.name}
                  </Link>
                </td>
                <td>{sub.semester}</td>
                <td>
                  <Link href={`/subjects/${sub.id}`}>View Materials</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
