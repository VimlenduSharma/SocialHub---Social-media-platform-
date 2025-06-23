import { useState, useEffect, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { PostCard } from '@/components/feed/PostCard';
import { PostSkeleton } from '@/components/feed/PostSkeleton';
import { JumpToTop } from '@/components/feed/JumpToTop';
import { SuggestedFollowers } from '@/components/feed/SuggestedFollowers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

// Mock data for posts with real images
const mockPosts = [
  {
    id: '1',
    author: { 
      name: 'Alice Johnson', 
      username: 'alice_j', 
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' 
    },
    content: 'Just finished building an amazing React app! 🚀 The new features are looking incredible. Can\'t wait to ship this to production! #coding #react #webdev',
    timestamp: '2 hours ago',
    likes: 24,
    comments: 8,
    shares: 3,
    isLiked: false,
    images: ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop'],
  },
  {
    id: '2',
    author: { 
      name: 'Bob Smith', 
      username: 'bob_smith', 
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' 
    },
    content: 'Beautiful sunset today! Nature never fails to amaze me. Sometimes you just need to step outside and appreciate the world around us. 🌅✨',
    timestamp: '4 hours ago',
    likes: 45,
    comments: 12,
    shares: 7,
    isLiked: true,
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'],
  },
  {
    id: '3',
    author: { 
      name: 'Sarah Wilson', 
      username: 'sarah_w', 
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' 
    },
    content: 'Coffee and code - the perfect combination for a productive morning! ☕️💻 Working on some exciting new features today.',
    timestamp: '6 hours ago',
    likes: 18,
    comments: 5,
    shares: 2,
    isLiked: false,
    images: ['https://images.unsplash.com/photo-1461988320302-91bde64fc8e4?w=800&h=600&fit=crop'],
  },
  {
    id: '4',
    author: { 
      name: 'Mike Chen', 
      username: 'mike_chen', 
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' 
    },
    content: 'Just launched my new portfolio website! Check it out and let me know what you think. Built with React and lots of ❤️',
    timestamp: '8 hours ago',
    likes: 67,
    comments: 23,
    shares: 12,
    isLiked: true,
    images: ['https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop'],
  },
];

const fetchPosts = async ({ pageParam = 0 }) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate mock data for different pages with varied content
  const posts = Array.from({ length: 5 }, (_, index) => {
    const basePost = mockPosts[index % mockPosts.length];
    return {
      ...basePost,
      id: `${pageParam}-${index}`,
      author: {
        ...basePost.author,
        avatar: `https://images.unsplash.com/photo-${1494790108755 + (pageParam * 5 + index)}?w=150&h=150&fit=crop&crop=face`
      }
    };
  });
  
  return {
    posts,
    nextCursor: pageParam < 10 ? pageParam + 1 : undefined,
  };
};

export default function Feed() {
  const [activeTab, setActiveTab] = useState('all');
  const [showJumpToTop, setShowJumpToTop] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['posts', activeTab],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
  });

  const loadMoreRef = useIntersectionObserver(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  const handleScroll = useCallback(() => {
    setShowJumpToTop(window.scrollY > 300);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const allPosts = data?.pages.flatMap(page => page.posts) ?? [];

  return (
    <AppLayout>
      <div className="flex max-w-7xl mx-auto">
        {/* Main Feed */}
        <div className="flex-1 max-w-2xl mx-auto p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <PostSkeleton key={index} />
                ))
              ) : (
                <>
                  {allPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                  
                  {isFetchingNextPage && (
                    Array.from({ length: 2 }).map((_, index) => (
                      <PostSkeleton key={`loading-${index}`} />
                    ))
                  )}
                  
                  <div ref={loadMoreRef} className="h-10" />
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block w-80 p-4">
          <SuggestedFollowers />
        </div>
      </div>

      <JumpToTop show={showJumpToTop} />
    </AppLayout>
  );
}
