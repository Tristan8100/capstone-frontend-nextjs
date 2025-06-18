// components/UserSettings.tsx
'use client';

import { useState, useEffect } from 'react'; // Import useEffect
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { useTheme } from 'next-themes';
import Image from 'next/image';

export function UserSettings() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false); // State to track if component is mounted

  // Effect to set mounted to true after client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Basic state for UI elements to be controllable, without save logic
  const [username, setUsername] = useState('johndoe_user');
  const [email, setEmail] = useState('john.doe@example.com');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null); // State for profile photo URL or data

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, you'd handle file upload to a server
      // For UI demo, we can just set a placeholder or read file for local preview
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file); // For local preview, using Data URL
    }
  };

  const handleThemeChange = (value: 'light' | 'dark' | 'system') => {
    setTheme(value); // This directly changes the visual theme
  };

  // Placeholder function for button clicks - no actual saving logic here
  const handleButtonClick = (action: string) => {
    console.log(`${action} button clicked.`);
    // You would implement your actual save/update logic here
  };

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto"> {/* Increased max-w to 6xl for even wider layout */}
      {/* Page Header */}
      <div className="space-y-0.5">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings, preferences, and more.
        </p>
      </div>
      <Separator className="my-6" />

      {/* Profile Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            This is how others will see you on the site.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6"> {/* Simplified form - no onSubmit handler */}
            {/* Profile Photo Upload Section */}
            <div className="space-y-4">
              <Label htmlFor="profile-photo">Profile Photo</Label>
              {/* Changed items-start to items-center to center the photo elements */}
              <div className="flex flex-col items-center gap-4">
                <Image
                  src={profilePhoto || "https://placehold.co/100x100/aabbcc/ffffff?text=PP"}
                  alt="Profile Photo"
                  width={96}
                  height={96}
                  className="rounded-full object-cover border border-gray-200"
                  onError={(e) => { e.currentTarget.src = "https://placehold.co/100x100/aabbcc/ffffff?text=Error"; }}
                />
                <Input
                  id="profile-photo"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhotoChange}
                  className="w-full max-w-sm" // Make the file input wide but capped
                />
                <p className="text-sm text-muted-foreground text-center"> {/* Added text-center for description */}
                  Upload a new profile picture. Max file size 2MB.
                </p>
              </div>
              <Button type="button" onClick={() => handleButtonClick('Save Photo')}>Save Photo</Button> {/* Add a specific button for photo saving */}
            </div>

            <Separator /> {/* Separator between photo and other profile fields */}

            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Your username"
                value={username}
                onChange={handleUsernameChange}
              />
              <p className="text-sm text-muted-foreground mt-1">
                This is your public display name. It can be your real name or a pseudonym.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={handleEmailChange}
                disabled // Email is often not directly editable by user in settings
              />
              <p className="text-sm text-muted-foreground mt-1">
                You cannot change your email address from here. Please contact support if needed.
              </p>
            </div>
            <Button type="button" onClick={() => handleButtonClick('Save Profile Changes')}>Save Profile Changes</Button>
          </form>
        </CardContent>
      </Card>

      {/* Appearance Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the appearance of the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 max-w-xs">
            <Label htmlFor="theme-select">Theme</Label>
            {/* Conditionally render Select only after component has mounted */}
            {mounted ? (
              <Select
                onValueChange={handleThemeChange}
                defaultValue={theme as string}
              >
                <SelectTrigger id="theme-select">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              // Placeholder during server-side rendering or before hydration
              <div className="h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground flex items-center justify-between">
                <span>Loading theme...</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevrons-up-down"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              Select the visual theme for your application.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Example: Password Change Card */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your account password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" placeholder="••••••••" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" placeholder="••••••••" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" placeholder="••••••••" />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => handleButtonClick('Update Password')}>Update Password</Button>
        </CardFooter>
      </Card>

    </div>
  );
}
