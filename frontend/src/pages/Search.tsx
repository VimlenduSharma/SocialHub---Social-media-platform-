import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PostCard } from '@/components/feed/PostCard';
import { Search as SearchIcon, Hash, UserPlus } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

const mockSearchResults = {
  posts: [
    {
      id: '1',
      author: { 
        name: 'Alice Johnson', 
        username: 'alice_j', 
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' 
      },
      content: 'Just finished building an amazing React app! 🚀 The new features are looking incredible.',
      timestamp: '2 hours ago',
      likes: 24,
      comments: 8,
      shares: 3,
      isLiked: false,
      images: ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop'],
    },
  ],
  users: [
    {
      id: '1',
      name: 'Alice Johnson',
      username: 'alice_j',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      bio: 'Frontend Developer | React Enthusiast | UI/UX Designer',
      followers: 1205,
      isFollowing: false,
    },
    {
      id: '2',
      name: 'Bob Smith',
      username: 'bob_smith',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Full-stack developer passionate about clean code',
      followers: 892,
      isFollowing: true,
    },
    {
      id: '3',
      name: 'Sarah Wilson',
      username: 'sarah_w',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      bio: 'Product Manager | Tech Lover | Coffee Addict ☕',
      followers: 2341,
      isFollowing: false,
    },
  ],
  hashtags: [
    { tag: 'react', posts: 15420 },
    { tag: 'javascript', posts: 28950 },
    { tag: 'webdev', posts: 12340 },
    { tag: 'coding', posts: 45670 },
    { tag: 'frontend', posts: 8920 },
  ],
};

export default function Search() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('posts');
  const debouncedQuery = useDebounce(query, 300);

  const hasResults = debouncedQuery.length > 0;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-4">
        {/* Search Header */}
        <div className="mb-6">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search for posts, people, or hashtags..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>

        {/* Search Results */}
        {hasResults ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="users">People</TabsTrigger>
              <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-4">
              {mockSearchResults.posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              {mockSearchResults.users.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">@{user.username}</p>
                          <p className="text-sm mt-1">{user.bio}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {user.followers.toLocaleString()} followers
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant={user.isFollowing ? "outline" : "default"}
                        size="sm"
                      >
                        {user.isFollowing ? (
                          'Following'
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Follow
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="hashtags" className="space-y-4">
              {mockSearchResults.hashtags.map((hashtag) => (
                <Card key={hashtag.tag}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Hash className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">#{hashtag.tag}</h3>
                        <p className="text-sm text-muted-foreground">
                          {hashtag.posts.toLocaleString()} posts
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <SearchIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Search SocialHub</h3>
            <p className="text-muted-foreground">
              Find posts, people, and hashtags that interest you
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
