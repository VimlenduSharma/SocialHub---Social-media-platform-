import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Shield, Eye, Bell, Palette, User, Mail, Lock, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';

export default function Settings() {
  const [email, setEmail] = useState('john@example.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Privacy settings
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [showEmail, setShowEmail] = useState(false);
  const [allowDirectMessages, setAllowDirectMessages] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [likeNotifications, setLikeNotifications] = useState(true);
  const [commentNotifications, setCommentNotifications] = useState(true);
  const [followNotifications, setFollowNotifications] = useState(true);
  const [mentionNotifications, setMentionNotifications] = useState(true);
  
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const handleSaveAccount = () => {
    if (newPassword && newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Account Updated",
      description: "Your account settings have been saved successfully.",
    });
  };

  const handleSavePrivacy = () => {
    toast({
      title: "Privacy Settings Updated",
      description: "Your privacy preferences have been saved.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and application preferences</p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="account" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Account</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span>Appearance</span>
            </TabsTrigger>
          </TabsList>

          {/* Account Settings */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Email Settings</span>
                </CardTitle>
                <CardDescription>
                  Update your email address and email preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button onClick={handleSaveAccount}>Save Email Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5" />
                  <span>Password</span>
                </CardTitle>
                <CardDescription>
                  Change your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button onClick={handleSaveAccount}>Update Password</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Profile Visibility</span>
                </CardTitle>
                <CardDescription>
                  Control who can see your profile and posts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <Select value={profileVisibility} onValueChange={setProfileVisibility}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4" />
                          <span>Public - Anyone can see your profile</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="followers">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>Followers only - Only followers can see your posts</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex items-center space-x-2">
                          <Lock className="h-4 w-4" />
                          <span>Private - Only you can see your profile</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Email Address</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow others to see your email address on your profile
                      </p>
                    </div>
                    <Switch checked={showEmail} onCheckedChange={setShowEmail} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Direct Messages</Label>
                      <p className="text-sm text-muted-foreground">
                        Let people send you direct messages
                      </p>
                    </div>
                    <Switch checked={allowDirectMessages} onCheckedChange={setAllowDirectMessages} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Online Status</Label>
                      <p className="text-sm text-muted-foreground">
                        Let others see when you're online
                      </p>
                    </div>
                    <Switch checked={showOnlineStatus} onCheckedChange={setShowOnlineStatus} />
                  </div>
                </div>

                <Button onClick={handleSavePrivacy}>Save Privacy Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
                <CardDescription>
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Delivery Methods</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications in your browser
                      </p>
                    </div>
                    <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Notification Types</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Likes</Label>
                      <p className="text-sm text-muted-foreground">
                        When someone likes your posts
                      </p>
                    </div>
                    <Switch checked={likeNotifications} onCheckedChange={setLikeNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Comments</Label>
                      <p className="text-sm text-muted-foreground">
                        When someone comments on your posts
                      </p>
                    </div>
                    <Switch checked={commentNotifications} onCheckedChange={setCommentNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New Followers</Label>
                      <p className="text-sm text-muted-foreground">
                        When someone starts following you
                      </p>
                    </div>
                    <Switch checked={followNotifications} onCheckedChange={setFollowNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mentions</Label>
                      <p className="text-sm text-muted-foreground">
                        When someone mentions you in a post
                      </p>
                    </div>
                    <Switch checked={mentionNotifications} onCheckedChange={setMentionNotifications} />
                  </div>
                </div>

                <Button onClick={handleSaveNotifications}>Save Notification Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>Theme</span>
                </CardTitle>
                <CardDescription>
                  Customize the appearance of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Color Theme</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred color theme. System will match your device settings.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
