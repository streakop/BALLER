"use client";

import { useState } from 'react';

export default function ResourceList({ resources, subject }: { resources: any[], subject: any }) {
  const [filterYear, setFilterYear] = useState('');
  const [filterType, setFilterType] = useState('');

  // Extract unique years for the dropdown
  const uniqueYears = Array.from(new Set(resources.map(r => r.year))).sort((a, b) => b - a);

  // Apply filters
  const filteredResources = resources.filter(res => {
    const matchYear = filterYear ? res.year.toString() === filterYear : true;
    const matchType = filterType ? res.resource_type === filterType : true;
    return matchYear && matchType;
  });

  const hasResources = filteredResources.length > 0;

  return (
    <>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <select 
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          style={{ padding: '0.25rem', border: '1px solid var(--color-cf-border)' }}
        >
          <option value="">All Years</option>
          {uniqueYears.map((y: any) => (
            <option key={y} value={y.toString()}>{y}</option>
          ))}
        </select>
        
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
        <table>
          <thead>
            <tr>
              <th style={{ width: '10%' }}>Year</th>
              <th style={{ width: '10%' }}>Sem</th>
              <th style={{ width: '15%' }}>Exam Type</th>
              <th style={{ width: '15%' }}>Resource Type</th>
              <th style={{ width: '35%' }}>Description & File</th>
              <th style={{ width: '15%' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredResources.map((res: any) => (
              <tr key={res.id}>
                <td>{res.year}</td>
                <td>{res.semester}</td>
                <td>{res.exam_type}</td>
                <td>{res.resource_type}</td>
                <td>
                  <strong>{res.file_name}</strong>
                </td>
                <td>
                  <a href={res.file_url} target="_blank" rel="noopener noreferrer">
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
