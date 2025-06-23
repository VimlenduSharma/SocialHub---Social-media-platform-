import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const suggestedUsers = [
  { 
    id: '1', 
    name: 'Sarah Wilson', 
    username: 'sarah_w', 
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' 
  },
  { 
    id: '2', 
    name: 'Mike Chen', 
    username: 'mike_c', 
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' 
  },
  { 
    id: '3', 
    name: 'Emma Davis', 
    username: 'emma_d', 
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' 
  },
];

export function SuggestedFollowers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Suggested for you</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestedUsers.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-xs text-muted-foreground">@{user.username}</p>
              </div>
            </div>
            <Button size="sm" variant="outline">
              Follow
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
