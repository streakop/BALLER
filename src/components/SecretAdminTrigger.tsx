"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SecretAdminTrigger() {
  const router = useRouter();
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Shift + A (or Cmd + Shift + A on Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        router.push('/admin');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  return null; // This is an invisible component just for the event listener
}
