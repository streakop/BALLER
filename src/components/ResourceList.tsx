"use client";

import { useState } from 'react';
import { logResourceViewAndRedirect } from '@/app/actions';

export default function ResourceList({ resources, subject }: { resources: any[], subject: any }) {
  const [filterType, setFilterType] = useState('');

  // Apply filters
  const filteredResources = resources.filter(res => {
    const matchType = filterType ? res.resource_type === filterType : true;
    return matchType;
  });

  const groupedResources = Object.values(
    filteredResources.reduce((acc, res) => {
      const key = `${res.semester}-${res.exam_type}`;
      if (!acc[key]) {
        acc[key] = {
          id: key,
          semester: res.semester,
          exam_type: res.exam_type,
          questionPapers: [],
          notes: [],
          assignments: []
        };
      }
      
      if (res.resource_type === 'Question Paper') {
        acc[key].questionPapers.push(res);
      } else if (res.resource_type === 'Notes') {
        acc[key].notes.push(res);
      } else if (res.resource_type === 'Assignment') {
        acc[key].assignments.push(res);
      }
      
      return acc;
    }, {} as Record<string, any>)
  );

  const hasResources = filteredResources.length > 0;

  return (
    <>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ padding: '0.25rem', border: '1px solid var(--color-cf-border)' }}
        >
          <option value="">All Types</option>
          <option value="Question Paper">Question Paper</option>
          <option value="Notes">Notes</option>
          <option value="Assignment">Assignment</option>
        </select>
      </div>

      {!hasResources && (
        <div style={{ padding: '1rem', border: '1px solid var(--color-cf-border)' }}>
          No resources found matching the current filters.
        </div>
      )}

      {hasResources && (
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ minWidth: '600px', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Semester</th>
                <th style={{ width: '15%' }}>Exam Type</th>
                <th style={{ width: '20%' }}>PYQ</th>
                <th style={{ width: '20%' }}>Study Material</th>
                <th style={{ width: '20%' }}>Assignments</th>
              </tr>
            </thead>
            <tbody>
              {groupedResources.map((group: any) => (
                <tr key={group.id}>
                  <td>{group.semester}</td>
                  <td>{group.exam_type}</td>
                  <td>
                    {group.questionPapers.map((res: any) => (
                      <div key={res.id} style={{ marginBottom: '0.5rem' }}>
                        <form action={logResourceViewAndRedirect.bind(null, res.id, res.file_url)} style={{ margin: 0 }}>
                          <button type="submit" style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--color-link)', textDecoration: 'underline', padding: 0, textAlign: 'left' }}>
                            Download
                          </button>
                        </form>
                        {(res.slot || res.faculty) && (
                          <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.2rem' }}>
                            {[res.slot, res.faculty].filter(Boolean).join(' • ')}
                          </div>
                        )}
                      </div>
                    ))}
                    {group.questionPapers.length === 0 && <span style={{ color: '#999' }}>-</span>}
                  </td>
                  <td>
                    {group.notes.map((res: any) => (
                      <div key={res.id} style={{ marginBottom: '0.5rem' }}>
                        <form action={logResourceViewAndRedirect.bind(null, res.id, res.file_url)} style={{ margin: 0 }}>
                          <button type="submit" style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--color-link)', textDecoration: 'underline', padding: 0, textAlign: 'left' }}>
                            Download
                          </button>
                        </form>
                        {(res.slot || res.faculty) && (
                          <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.2rem' }}>
                            {[res.slot, res.faculty].filter(Boolean).join(' • ')}
                          </div>
                        )}
                      </div>
                    ))}
                    {group.notes.length === 0 && <span style={{ color: '#999' }}>-</span>}
                  </td>
                  <td>
                    {group.assignments.map((res: any) => (
                      <div key={res.id} style={{ marginBottom: '0.5rem' }}>
                        <form action={logResourceViewAndRedirect.bind(null, res.id, res.file_url)} style={{ margin: 0 }}>
                          <button type="submit" style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--color-link)', textDecoration: 'underline', padding: 0, textAlign: 'left' }}>
                            Download
                          </button>
                        </form>
                        {(res.slot || res.faculty) && (
                          <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.2rem' }}>
                            {[res.slot, res.faculty].filter(Boolean).join(' • ')}
                          </div>
                        )}
                      </div>
                    ))}
                    {group.assignments.length === 0 && <span style={{ color: '#999' }}>-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
