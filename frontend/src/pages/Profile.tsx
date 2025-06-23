import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PostCard } from '@/components/feed/PostCard';
import { SuggestedFollowers } from '@/components/feed/SuggestedFollowers';
import { Calendar, MapPin, Link as LinkIcon, UserPlus, UserCheck, Heart } from 'lucide-react';

const mockUser = {
  name: 'John Doe',
  username: 'johndoe',
  bio: 'Full-stack developer passionate about React and Node.js. Building cool stuff at @TechCorp 🚀 Love coffee, code, and creating amazing user experiences.',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
  coverPhoto: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=400&fit=crop',
  followers: 1234,
  following: 567,
  posts: 89,
  location: 'San Francisco, CA',
  website: 'https://johndoe.dev',
  joinDate: 'Joined March 2022',
  isFollowing: false,
};

const mockPosts = [
  {
    id: '1',
    author: { 
      name: 'John Doe', 
      username: 'johndoe', 
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' 
    },
    content: 'Just shipped a new feature! Really excited about the React 18 updates and how they\'re improving performance across the board 🚀',
    timestamp: '2 hours ago',
    likes: 24,
    comments: 8,
    shares: 3,
    isLiked: false,
    images: ['https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=600&fit=crop'],
  },
  {
    id: '2',
    author: { 
      name: 'John Doe', 
      username: 'johndoe', 
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' 
    },
    content: 'Working on some exciting new projects. The intersection of design and technology never ceases to amaze me! 💻✨',
    timestamp: '1 day ago',
    likes: 42,
    comments: 15,
    shares: 6,
    isLiked: true,
    images: [],
  },
];

export default function Profile() {
  const [isFollowing, setIsFollowing] = useState(mockUser.isFollowing);
  const [activeTab, setActiveTab] = useState('posts');

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Cover Photo & Profile Header */}
        <div className="relative">
          <div
            className="h-48 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg"
            style={{
              backgroundImage: `url(${mockUser.coverPhoto})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          
          <div className="absolute -bottom-16 left-4">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
              <AvatarFallback className="text-2xl">{mockUser.name[0]}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Profile Info */}
        <div className="mt-20 px-4 pb-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold">{mockUser.name}</h1>
              <p className="text-muted-foreground">@{mockUser.username}</p>
            </div>
            <Button onClick={handleFollow} className="min-w-[120px]">
              {isFollowing ? (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Following
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Follow
                </>
              )}
            </Button>
          </div>

          <p className="mb-4">{mockUser.bio}</p>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {mockUser.location}
            </div>
            <div className="flex items-center">
              <LinkIcon className="h-4 w-4 mr-1" />
              <a href={mockUser.website} className="text-primary hover:underline">
                {mockUser.website}
              </a>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {mockUser.joinDate}
            </div>
          </div>

          <div className="flex gap-6 mb-6">
            <div>
              <span className="font-bold">{mockUser.posts}</span>
              <span className="text-muted-foreground ml-1">Posts</span>
            </div>
            <div>
              <span className="font-bold">{mockUser.followers.toLocaleString()}</span>
              <span className="text-muted-foreground ml-1">Followers</span>
            </div>
            <div>
              <span className="font-bold">{mockUser.following}</span>
              <span className="text-muted-foreground ml-1">Following</span>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="likes">Likes</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="space-y-4 mt-6">
                {mockPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </TabsContent>

              <TabsContent value="likes" className="mt-6">
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                      <Heart className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">No liked posts yet</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">About</h3>
                      <p>{mockUser.bio}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {['React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'GraphQL', 'Docker'].map((skill) => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Work Experience</h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">TC</span>
                          </div>
                          <div>
                            <p className="font-medium">Senior Developer at TechCorp</p>
                            <p className="text-sm text-muted-foreground">2022 - Present</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-80">
            <SuggestedFollowers />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
