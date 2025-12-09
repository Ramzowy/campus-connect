"use client";

import { ArrowLeft, Camera } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProfilePage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [messagePrivacy, setMessagePrivacy] = useState("everyone");
  const [displayName, setDisplayName] = useState("Alex Chen");
  const [country, setCountry] = useState("us");
  const [bio, setBio] = useState("Exchange student from Taiwan");

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back navigation */}
      <header className="sticky top-0 z-10 border-b bg-background px-4 py-4 md:px-6">
        <div className="mx-auto flex max-w-3xl items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="size-5" />
          </Button>
          <h1 className="text-xl font-semibold">Profile & Settings</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-3xl px-4 py-6 md:px-6 md:py-8">
        <div className="space-y-6">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal details and public profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                <div className="relative">
                  <div className="flex size-24 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
                    AC
                  </div>
                  <button className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground transition-colors hover:bg-primary/90">
                    <Camera className="size-4" />
                  </button>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-sm font-medium">Profile Picture</p>
                  <p className="text-muted-foreground text-xs">
                    Click the icon to upload a new photo
                  </p>
                </div>
              </div>

              {/* Display Name */}
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                />
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger id="country" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">🇺🇸 United States</SelectItem>
                    <SelectItem value="tw">🇹🇼 Taiwan</SelectItem>
                    <SelectItem value="in">🇮🇳 India</SelectItem>
                    <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
                    <SelectItem value="ca">🇨🇦 Canada</SelectItem>
                    <SelectItem value="au">🇦🇺 Australia</SelectItem>
                    <SelectItem value="de">🇩🇪 Germany</SelectItem>
                    <SelectItem value="fr">🇫🇷 France</SelectItem>
                    <SelectItem value="jp">🇯🇵 Japan</SelectItem>
                    <SelectItem value="kr">🇰🇷 South Korea</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio / Status</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                  className="min-h-24"
                />
              </div>
            </CardContent>
          </Card>

          {/* Settings Section */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Manage your notification and privacy preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notification Preferences */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">
                  Notification Preferences
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">
                        Email Notifications
                      </Label>
                      <p className="text-muted-foreground text-xs">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">
                        Push Notifications
                      </Label>
                      <p className="text-muted-foreground text-xs">
                        Receive push notifications on your device
                      </p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Privacy Settings</h3>
                <RadioGroup
                  value={messagePrivacy}
                  onValueChange={setMessagePrivacy}
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="everyone" id="everyone" />
                    <Label htmlFor="everyone" className="font-normal">
                      Everyone can message me
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="groups" id="groups" />
                    <Label htmlFor="groups" className="font-normal">
                      Only my groups can message me
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Account Actions */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Account Actions</h3>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto bg-transparent"
                  >
                    Change Email
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto bg-transparent"
                  >
                    Change Password
                  </Button>
                </div>
              </div>

              {/* Logout Button */}
              <div className="border-t pt-6">
                <Button
                  variant="destructive"
                  className="w-full sm:w-auto"
                  onClick={() => console.log("[v0] Logout clicked")}
                >
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
