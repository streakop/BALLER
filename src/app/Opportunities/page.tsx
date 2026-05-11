import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function OpportunitiesPage() {
  const supabase = await createClient();
  
  // Access Control: Restrict to logged-in users
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/'); // Redirect to home if not logged in
  }

  // Mock Data for now
  const mockOpportunities = [
    { id: 1, title: 'Summer SDE Intern', company: 'TechCorp', type: 'Internship', deadline: 'May 30, 2026' },
    { id: 2, title: 'VIT Bhopal Hackathon', company: 'GDSC', type: 'Hackathon', deadline: 'June 15, 2026' },
    { id: 3, title: 'Frontend Developer', company: 'Startup Inc', type: 'Full-time', deadline: 'Rolling' },
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Opportunities</h1>
      <p className="text-muted-foreground mb-8">Find internships, jobs, and hackathons.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockOpportunities.map((opp) => (
          <Card key={opp.id} className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="text-xs font-semibold text-green-600 mb-1">{opp.type}</div>
              <CardTitle>{opp.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="flex flex-col gap-1">
                <span className="font-medium text-foreground">{opp.company}</span>
                <span>Deadline: {opp.deadline}</span>
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}