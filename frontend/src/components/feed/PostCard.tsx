import { useState } from 'react';
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Post {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  images: string[];
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{post.author.name}</p>
              <p className="text-sm text-muted-foreground">@{post.author.username} · {post.timestamp}</p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Follow @{post.author.username}</DropdownMenuItem>
              <DropdownMenuItem>Copy link</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Report post</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed">{post.content}</p>
        
        {post.images.length > 0 && (
          <div className="grid grid-cols-1 gap-2 rounded-lg overflow-hidden">
            {post.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt="Post content"
                className="w-full h-64 object-cover rounded-lg"
              />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`space-x-2 ${isLiked ? 'text-red-500' : ''}`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likesCount}</span>
          </Button>

          <Button variant="ghost" size="sm" className="space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments}</span>
          </Button>

          <Button variant="ghost" size="sm" className="space-x-2">
            <Share className="h-4 w-4" />
            <span>{post.shares}</span>
          </Button>

          <Button variant="ghost" size="icon">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
