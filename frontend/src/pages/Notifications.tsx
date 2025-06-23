import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Heart, MessageCircle, UserPlus, Share2, CheckCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Notifications() {
  const [unreadCount, setUnreadCount] = useState(5);
  const { toast } = useToast();

  const notifications = [
    {
      id: 1,
      type: 'like',
      user: {
        username: 'jane_smith',
        name: 'Jane Smith',
        avatar: '/placeholder.svg',
      },
      post: {
        content: 'Great post about React hooks!',
      },
      createdAt: '2024-03-15T10:30:00Z',
      read: false,
    },
    {
      id: 2,
      type: 'follow',
      user: {
        username: 'john_doe',
        name: 'John Doe',
        avatar: '/placeholder.svg',
      },
      createdAt: '2024-03-15T09:00:00Z',
      read: false,
    },
    {
      id: 3,
      type: 'comment',
      user: {
        username: 'mike_w',
        name: 'Mike Williams',
        avatar: '/placeholder.svg',
      },
      post: {
        content: 'Interesting discussion here.',
      },
      comment: 'This is really helpful, thanks for sharing!',
      createdAt: '2024-03-14T18:45:00Z',
      read: true,
    },
    {
      id: 4,
      type: 'mention',
      user: {
        username: 'sarah_j',
        name: 'Sarah Johnson',
        avatar: '/placeholder.svg',
      },
      post: {
        content: 'Hey @you, check out this amazing tutorial!',
      },
      createdAt: '2024-03-14T16:20:00Z',
      read: false,
    },
    {
      id: 5,
      type: 'share',
      user: {
        username: 'alex_k',
        name: 'Alex Kumar',
        avatar: '/placeholder.svg',
      },
      post: {
        content: 'Tips for better code organization',
      },
      createdAt: '2024-03-14T14:15:00Z',
      read: false,
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const renderNotificationIcon = (type: string, read: boolean) => {
    const iconClass = `h-4 w-4 ${read ? 'text-muted-foreground' : ''}`;
    
    switch (type) {
      case 'follow':
        return <UserPlus className={`${iconClass} ${!read ? 'text-blue-500' : ''}`} />;
      case 'like':
        return <Heart className={`${iconClass} ${!read ? 'text-red-500' : ''}`} />;
      case 'comment':
        return <MessageCircle className={`${iconClass} ${!read ? 'text-green-500' : ''}`} />;
      case 'mention':
        return <Bell className={`${iconClass} ${!read ? 'text-purple-500' : ''}`} />;
      case 'share':
        return <Share2 className={`${iconClass} ${!read ? 'text-orange-500' : ''}`} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const renderNotificationContent = (notification: any) => {
    const { type, user, post, comment } = notification;

    switch (type) {
      case 'follow':
        return (
          <p className="text-sm">
            <span className="font-medium">{user.name}</span> started following you.
          </p>
        );
      case 'like':
        return (
          <p className="text-sm">
            <span className="font-medium">{user.name}</span> liked your post: 
            <span className="text-muted-foreground"> "{post.content}"</span>
          </p>
        );
      case 'comment':
        return (
          <div className="text-sm space-y-1">
            <p>
              <span className="font-medium">{user.name}</span> commented on your post:
            </p>
            <p className="text-muted-foreground">"{comment}"</p>
          </div>
        );
      case 'mention':
        return (
          <p className="text-sm">
            <span className="font-medium">{user.name}</span> mentioned you in a post:
            <span className="text-muted-foreground"> "{post.content}"</span>
          </p>
        );
      case 'share':
        return (
          <p className="text-sm">
            <span className="font-medium">{user.name}</span> shared your post: 
            <span className="text-muted-foreground"> "{post.content}"</span>
          </p>
        );
      default:
        return <p className="text-sm">New notification</p>;
    }
  };

  const markAllAsRead = () => {
    setUnreadCount(0);
    toast({
      title: "Notifications marked as read",
      description: "All notifications have been marked as read.",
    });
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CardTitle>Notifications</CardTitle>
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark all as read
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
                <TabsTrigger value="read">Read</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-3">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`flex items-start space-x-4 p-3 rounded-lg transition-colors ${
                      !notification.read 
                        ? 'bg-primary/5 border border-primary/20' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex-shrink-0 pt-1">
                      {renderNotificationIcon(notification.type, notification.read)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                          <AvatarFallback className="text-xs">{notification.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          {renderNotificationContent(notification)}
                          <p className="text-xs text-muted-foreground">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="unread" className="space-y-3">
                {unreadNotifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No unread notifications</p>
                  </div>
                ) : (
                  unreadNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className="flex items-start space-x-4 p-3 rounded-lg bg-primary/5 border border-primary/20"
                    >
                      <div className="flex-shrink-0 pt-1">
                        {renderNotificationIcon(notification.type, false)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                            <AvatarFallback className="text-xs">{notification.user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            {renderNotificationContent(notification)}
                            <p className="text-xs text-muted-foreground">
                              {formatDate(notification.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="read" className="space-y-3">
                {readNotifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No read notifications</p>
                  </div>
                ) : (
                  readNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex-shrink-0 pt-1">
                        {renderNotificationIcon(notification.type, true)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                            <AvatarFallback className="text-xs">{notification.user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            {renderNotificationContent(notification)}
                            <p className="text-xs text-muted-foreground">
                              {formatDate(notification.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
