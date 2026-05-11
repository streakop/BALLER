"use client";

import { useState } from 'react';
import Link from 'next/link';

import { Input } from '@/components/ui/input';

export default function SubjectList({ subjects }: { subjects: any[] }) {
  const [search, setSearch] = useState('');

  const filteredSubjects = subjects.filter(sub => {
    const q = search.toLowerCase();
    return sub.name.toLowerCase().includes(q) || sub.code.toLowerCase().includes(q);
  });

  const hasData = filteredSubjects.length > 0;

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <div className="w-full max-w-sm">
          <Input
            type="text"
            placeholder="Search course name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {!hasData && (
        <div className="p-4 border rounded-md text-center text-muted-foreground">
          No courses found matching "{search}".
        </div>
      )}

      {hasData && (
        <table>
          <thead>
            <tr>
              <th style={{ width: '15%' }}>Code</th>
              <th style={{ width: '70%' }}>Name</th>
              <th style={{ width: '15%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubjects.map((sub: any) => (
              <tr key={sub.id}>
                <td><strong>{sub.code}</strong></td>
                <td>
                  <Link href={`/subjects/${sub.id}`} className="cf-link">
                    {sub.name} 
                  </Link>
                </td>
                <td>
                  <Link href={`/subjects/${sub.id}`} className="cf-link">View Materials</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
