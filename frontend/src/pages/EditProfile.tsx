import { useState, useRef } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import AvatarEditor from 'react-avatar-editor';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';

const mockUser = {
  name: 'John Doe',
  username: 'johndoe',
  bio: 'Full-stack developer passionate about React and Node.js. Building cool stuff at @TechCorp 🚀',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
  coverPhoto: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=400&fit=crop',
  location: 'San Francisco, CA',
  website: 'https://johndoe.dev',
};

export default function EditProfile() {
  const [name, setName] = useState(mockUser.name);
  const [bio, setBio] = useState(mockUser.bio);
  const [location, setLocation] = useState(mockUser.location);
  const [website, setWebsite] = useState(mockUser.website);
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<string>('/placeholder.svg');
  const [scale, setScale] = useState(1);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const avatarEditorRef = useRef<AvatarEditor>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarImage(file);
      setIsAvatarDialogOpen(true);
    }
  };

  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverImage(url);
    }
  };

  const handleSaveAvatar = () => {
    if (avatarEditorRef.current) {
      const canvas = avatarEditorRef.current.getImage();
      // In a real app, you would upload this canvas to your server
      setIsAvatarDialogOpen(false);
      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated successfully.",
      });
    }
  };

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
    navigate('/profile');
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => navigate('/profile')}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cover Photo */}
              <div className="space-y-2">
                <Label>Cover Photo</Label>
                <div className="relative">
                  <div 
                    className="w-full h-32 bg-cover bg-center rounded-lg relative group cursor-pointer"
                    style={{ backgroundImage: `url(${coverImage})` }}
                  >
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Upload className="h-6 w-6 text-white" />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Avatar */}
              <div className="space-y-2">
                <Label>Profile Picture</Label>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder.svg" alt="Profile" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Change Avatar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Avatar</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="w-full"
                        />
                        {avatarImage && (
                          <>
                            <div className="flex justify-center">
                              <AvatarEditor
                                ref={avatarEditorRef}
                                image={avatarImage}
                                width={200}
                                height={200}
                                border={50}
                                borderRadius={100}
                                scale={scale}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Zoom</Label>
                              <Slider
                                value={[scale]}
                                onValueChange={(value) => setScale(value[0])}
                                min={1}
                                max={3}
                                step={0.1}
                              />
                            </div>
                            <div className="flex space-x-2">
                              <Button onClick={handleSaveAvatar} className="flex-1">
                                Save
                              </Button>
                              <Button variant="outline" onClick={() => setIsAvatarDialogOpen(false)} className="flex-1">
                                Cancel
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground">{bio.length}/160</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Where are you based?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://your-website.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Cover + Avatar Preview */}
                <div className="relative">
                  <div 
                    className="w-full h-32 bg-cover bg-center rounded-lg"
                    style={{ backgroundImage: `url(${coverImage})` }}
                  />
                  <Avatar className="absolute -bottom-8 left-4 h-16 w-16 border-4 border-background">
                    <AvatarImage src="/placeholder.svg" alt="Profile" />
                    <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                </div>

                {/* Profile Info Preview */}
                <div className="pt-8 space-y-2">
                  <h2 className="text-xl font-bold">{name || 'Your Name'}</h2>
                  <p className="text-muted-foreground">{bio || 'Your bio will appear here...'}</p>
                  {location && (
                    <p className="text-sm text-muted-foreground">📍 {location}</p>
                  )}
                  {website && (
                    <p className="text-sm text-blue-500">🌐 {website}</p>
                  )}
                  <div className="flex space-x-4 text-sm">
                    <span><strong>1,234</strong> Following</span>
                    <span><strong>5,678</strong> Followers</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
