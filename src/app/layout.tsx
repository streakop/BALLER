import type { Metadata } from "next";
import "./globals.css";
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { signInWithGoogle, signOut } from './actions';

export const metadata: Metadata = {
  title: "Baller - PYQ & Study Material",
  description: "Minimalist platform for browsing and downloading previous year questions.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = user?.email === (process.env.ADMIN_EMAIL || 'admin@example.com');

  return (
    <html lang="en">
      <body>
        <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-cf-header)', borderBottom: '1px solid var(--color-cf-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h1 style={{ margin: 0, fontSize: '1.25rem' }}>
              <Link href="/" style={{ color: 'var(--color-cf-text)', textDecoration: 'none' }}>
                <strong>Baller</strong>
              </Link>
            </h1>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', alignItems: 'baseline' }}>
              <Link href="/">Home</Link>
              <Link href="/contribute">Contribute</Link>
              {user && <Link href="/history">History</Link>}
              {isAdmin && <Link href="/admin">Admin</Link>}
              {!user ? (
                <form action={signInWithGoogle} style={{ margin: 0 }}>
                  <button type="submit" style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--color-link)', fontSize: '0.9rem', padding: 0 }}>Login</button>
                </form>
              ) : (
                <form action={signOut} style={{ margin: 0 }}>
                  <button type="submit" style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--color-link)', fontSize: '0.9rem', padding: 0 }}>Logout</button>
                </form>
              )}
            </div>
          </div>
        </div>
        <main style={{ padding: '1rem' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
