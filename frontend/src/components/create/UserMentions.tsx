import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserMentionsProps {
  content: string;
  onMention: (username: string) => void;
}

const mockUsers = [
  { 
    username: 'alice_j', 
    name: 'Alice Johnson', 
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' 
  },
  { 
    username: 'bob_smith', 
    name: 'Bob Smith', 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' 
  },
  { 
    username: 'sarah_w', 
    name: 'Sarah Wilson', 
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' 
  },
];

export function UserMentions({ content, onMention }: UserMentionsProps) {
  const lastWord = content.split(' ').pop() || '';
  const showSuggestions = lastWord.startsWith('@') && lastWord.length > 1;
  const searchTerm = lastWord.slice(1).toLowerCase();

  const filteredUsers = mockUsers.filter(user =>
    user.username.toLowerCase().includes(searchTerm) ||
    user.name.toLowerCase().includes(searchTerm)
  );

  if (!showSuggestions || filteredUsers.length === 0) return null;

  return (
    <div className="border rounded-lg p-2 bg-background shadow-sm">
      <p className="text-sm font-medium mb-2">Mention someone:</p>
      <div className="space-y-1">
        {filteredUsers.slice(0, 3).map((user) => (
          <Button
            key={user.username}
            variant="ghost"
            className="w-full justify-start h-auto p-2"
            onClick={() => onMention(user.username)}
          >
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-xs">{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-sm">{user.name}</p>
              <p className="text-xs text-muted-foreground">@{user.username}</p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
