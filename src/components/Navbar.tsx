'use client'

import { IoReorderThree, IoMoon, IoSunny } from "react-icons/io5"
import { Button } from "./ui/button"
import { UserAvatar } from "./UserAvatar"
import Link from "next/link"
import { RxCross2 } from "react-icons/rx"
import { signInWithGoogle, signOut } from "@/app/actions"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function Navbar({ profile }: { profile: any }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <nav className="w-full border-b">
      <div className="flex items-center justify-between px-3 sm:px-5 md:px-8 h-14">

        {/* LEFT */}
        <Link
          href="/"
          className="text-lg sm:text-xl font-semibold whitespace-nowrap"
        >
          Baller
        </Link>

        {/* CENTER NAV */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4 ring-1 ring-blue-500 rounded-full px-2 py-1 overflow-x-auto scrollbar-hidden">
          <Link href={"/"}>
            <Button variant={'nav'} size={'nav'}>
              Home
            </Button>
          </Link>

          <Link href={"/Clubs"}>
            <Button variant={'nav'} size={'nav'}>
              Clubs
            </Button>
          </Link>

          <Link href={"/Discussions"}>
            <Button variant={'nav'} size={'nav'}>
              Discussions
            </Button>
          </Link>

          <Link href={"/Opportunities"}>
            <Button variant={'nav'} size={'nav'}>
              Opportunities
            </Button>
          </Link>

          <Link href={"/PYQ"}>
            <Button variant={'nav'} size={'nav'}>
              PYQs
            </Button>
          </Link>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 sm:gap-3">
          {profile ? (
            <>
              {profile.setup_completed === false && (
                <Link href="/setup-profile" className="hidden sm:block">
                  <Button variant="outline" size="sm" className="text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                    Setup Profile
                  </Button>
                </Link>
              )}
              <Button variant={"avatar"}>
                <UserAvatar profile={profile} />
              </Button>
              <form action={signOut}>
                <Button variant="ghost" size="sm" type="submit" className="text-xs text-muted-foreground hover:text-destructive">
                  Logout
                </Button>
              </form>
            </>
          ) : (
            <form action={signInWithGoogle}>
              <Button type="submit" size="sm" className="font-semibold" >
                Login
              </Button>
            </form>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 rounded-md transition-transform active:scale-95">
                <IoReorderThree className="w-7 h-7 " />
              </button>
            </SheetTrigger>

            <SheetContent side="left" aria-describedby={undefined}>
              <SheetTitle className="sr-only">
                Menu
              </SheetTitle>

              <div className="flex flex-col gap-4 mt-6 items-center justify-center">
                <Link href="/">Home</Link>
                <Link href="/Clubs">Clubs</Link>
                <Link href="/Discussions">Discussions</Link>
                <Link href="/Opportunities">Opportunities</Link>
                <Link href="/PYQ">PYQs</Link>
              </div>

              {/* Theme Toggle */}
              {mounted && (
                <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-4">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <div className="flex items-center border rounded-full p-1 bg-muted/50">
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); setTheme('light'); }}
                      className={`p-2 rounded-full transition-colors ${theme === 'light' ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}
                      aria-label="Light mode"
                    >
                      <IoSunny className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); setTheme('dark'); }}
                      className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}
                      aria-label="Dark mode"
                    >
                      <IoMoon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </nav>
  )
}