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
  const insertError = await ensureProfile();

  // 🔹 get user
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  let profileError = null;

  if (user) {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, avatar_url, username, setup_completed")
      .eq("id", user.id)
      .single();

    profile = data;
    if (error) profileError = error;
  }

  // Combine errors
  const displayError = insertError || (profileError && profileError.code !== 'PGRST116' ? profileError : null);

  console.log("RootLayout Auth State ->", { 
    userId: user?.id, 
    hasProfile: !!profile, 
    profileData: profile 
  });

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-mono", jetbrainsMono.variable, figtreeHeading.variable)}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>

          {/* DEBUG ERROR SCREEN */}
          {displayError && (
            <div className="bg-red-500 text-white p-4 text-center z-50 relative">
              <strong>Database Error:</strong> {displayError.message}
            </div>
          )}

          {/* AUTH DEBUG INFO */}
          <div className="bg-yellow-100 text-black p-2 text-xs text-center">
            Debug Info: User ID is {user?.id || "NULL"}. Profile is {profile ? "FOUND" : "NULL"}.
          </div>

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