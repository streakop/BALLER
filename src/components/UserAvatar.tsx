import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export function UserAvatar({ profile }: { profile: any }) {
  // Use the new anonymous username and avatar_url, or fallback to generic defaults
  const avatarSrc = profile?.avatar_url || "https://api.dicebear.com/7.x/bottts/svg?seed=Default"
  
  // Prefer username for anonymity. Fallback to full_name only if setup isn't complete yet, otherwise "User"
  const name = profile?.username || profile?.full_name || "User"
  
  // Get first two characters for the fallback
  const fallbackText = name.slice(0, 2).toUpperCase()

  return (
    <Avatar className="border border-border">
      <AvatarImage src={avatarSrc} alt={name} />
      <AvatarFallback className="bg-primary/10 text-primary font-bold">
        {fallbackText}
      </AvatarFallback>
    </Avatar>
  )
}