import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ClubsPage() {
  const supabase = await createClient();
  
  // Access Control: Restrict to logged-in users
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/'); // Redirect to home if not logged in
  }

  // Mock Data for now
  const mockClubs = [
    { id: 1, name: 'Web Dev Club', category: 'Technology', description: 'Learn modern web development frameworks and build cool projects.' },
    { id: 2, name: 'AI & ML Society', category: 'Technology', description: 'Dive into artificial intelligence, neural networks, and data science.' },
    { id: 3, name: 'Debate Club', category: 'Extracurricular', description: 'Enhance your public speaking and critical thinking skills.' },
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-2">Student Clubs</h1>
      <p className="text-muted-foreground mb-8">Discover and join amazing clubs at VIT BHOPAL.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockClubs.map((club) => (
          <Card key={club.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="text-xs font-semibold text-blue-500 mb-1">{club.category}</div>
              <CardTitle>{club.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{club.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}