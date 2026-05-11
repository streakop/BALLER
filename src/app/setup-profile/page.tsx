"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const predefinedAvatars = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=Felix",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Jude",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Lil",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Sam",
];

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Max 20 characters").regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
});

export default function SetupProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(predefinedAvatars[0]);
  const [file, setFile] = useState<File | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { username: '' }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const loadingToast = toast.loading("Setting up your profile...");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // 1. Check if username is available using our RPC function
      const { data: isAvailable, error: rpcError } = await supabase.rpc('check_username_available', { check_username: values.username });
      if (rpcError) throw new Error("Error checking username availability");
      if (!isAvailable) {
        toast.error("Username is already taken!", { id: loadingToast });
        setLoading(false);
        return;
      }

      // 2. Handle custom avatar upload if a file is selected
      let finalAvatarUrl = selectedAvatar;
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('resources-bucket') // Reusing existing bucket for simplicity
          .upload(filePath, file);

        if (uploadError) throw new Error("Failed to upload avatar");

        const { data: { publicUrl } } = supabase.storage
          .from('resources-bucket')
          .getPublicUrl(filePath);
        
        finalAvatarUrl = publicUrl;
      }

      // 3. Update the profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          username: values.username,
          avatar_url: finalAvatarUrl,
          setup_completed: true,
          full_name: null // Enforce anonymity
        })
        .eq('id', user.id);

      if (updateError) throw new Error(updateError.message);

      toast.success("Profile setup complete!", { id: loadingToast });
      router.push('/');
      router.refresh();
      
    } catch (err: any) {
      toast.error(err.message || 'An error occurred', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Your Identity</CardTitle>
          <CardDescription>Pick an anonymous username and avatar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Avatar Selection */}
            <div className="space-y-3">
              <Label>Choose an Avatar</Label>
              <div className="flex justify-center mb-4">
                <Avatar className="w-24 h-24 border-4 border-primary">
                  <AvatarImage src={file ? URL.createObjectURL(file) : selectedAvatar} />
                  <AvatarFallback>AN</AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex gap-2 justify-center flex-wrap">
                {predefinedAvatars.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => { setSelectedAvatar(url); setFile(null); }}
                    className={`rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${selectedAvatar === url && !file ? 'border-primary ring-2 ring-primary/50' : 'border-transparent'}`}
                  >
                    <img src={url} alt={`Avatar ${i}`} className="w-10 h-10 bg-muted" />
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <Label className="text-xs text-muted-foreground">Or upload your own:</Label>
                <Input 
                  type="file" 
                  accept="image/*" 
                  className="mt-1 text-xs"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                    }
                  }}
                />
              </div>
            </div>

            {/* Username Input */}
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                {...register("username")}
                placeholder="e.g. shadow_coder"
              />
              {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
              <p className="text-xs text-muted-foreground">
                This is how you will appear to others. You cannot use your real name to maintain anonymity.
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Saving...' : 'Complete Setup'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
