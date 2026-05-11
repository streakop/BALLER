import type { Metadata } from "next";
import "./globals.css";
import { createClient } from '@/lib/supabase/server';
import { ensureProfile } from './actions';
import { Navbar } from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/next";
import { JetBrains_Mono, Figtree } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const figtreeHeading = Figtree({ subsets: ['latin'], variable: '--font-heading' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: "Baller - PYQ & Study Material",
  description: "Minimalist platform for browsing and downloading previous year questions.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 🔹 ensure profile exists
  await ensureProfile();

  // 🔹 get user
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, avatar_url, username, setup_completed")
      .eq("id", user.id)
      .single();

    profile = data;
  }

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-mono", jetbrainsMono.variable, figtreeHeading.variable)}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>

          {/* 🔥 NAVBAR ADDED HERE */}
          
          <Navbar profile={profile}/>

          <main style={{ padding: '0.5rem' }}>
            {children}
            <Analytics />
            <Toaster position="top-right" />
          </main>

        </ThemeProvider>
      </body>
    </html>
  );
}