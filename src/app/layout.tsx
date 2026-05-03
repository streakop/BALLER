import type { Metadata } from "next";
import "./globals.css";
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { signInWithGoogle, signOut } from './actions';
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import ProgressBar from "@/components/ProgressBar";
import { Analytics } from "@vercel/analytics/next";

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
    <html lang="en" suppressHydrationWarning>
      <body>
        
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <nav className="navbar">
            <div className="navbar-inner">
              <h1 style={{ margin: 0, fontSize: '1.25rem' }}>
                <Link href="/" style={{ color: 'var(--color-cf-text)', textDecoration: 'none' }}>
                  <strong>Baller</strong>
                </Link>
              </h1>
              <div className="nav-links">
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
                <ThemeToggle />
              </div>
            </div>
          </nav>
          <main style={{ padding: '0.5rem' }}>
            {children}
            <Analytics/>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
