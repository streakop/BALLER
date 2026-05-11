import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DiscussionsPage() {
  const supabase = await createClient();
  
  // Access Control: Restrict to logged-in users
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/'); // Redirect to home if not logged in
  }

  // Mock Data for now
  const mockDiscussions = [
    { id: 1, title: 'Tips for upcoming Endterms?', author: 'John D.', replies: 5, time: '2 hours ago' },
    { id: 2, title: 'Looking for a hackathon team', author: 'Jane S.', replies: 12, time: '5 hours ago' },
    { id: 3, title: 'Best resources for OS (CSE2005)?', author: 'Alex M.', replies: 3, time: '1 day ago' },
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Discussions</h1>
          <p className="text-muted-foreground">Ask questions and share knowledge with peers.</p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm">
          New Topic
        </button>
      </div>
      
      <div className="flex flex-col gap-4">
        {mockDiscussions.map((topic) => (
          <Card key={topic.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader className="py-4">
              <CardTitle className="text-lg">{topic.title}</CardTitle>
              <CardDescription>
                Posted by <span className="font-medium text-foreground">{topic.author}</span> • {topic.time}
              </CardDescription>
            </CardHeader>
            <CardContent className="py-2 text-sm text-muted-foreground">
              {topic.replies} replies
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}