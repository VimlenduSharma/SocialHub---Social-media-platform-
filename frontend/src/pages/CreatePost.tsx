import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { ImageUploader } from '@/components/create/ImageUploader';
import { MarkdownPreview } from '@/components/create/MarkdownPreview';
import { UserMentions } from '@/components/create/UserMentions';
import { HashtagSuggestions } from '@/components/create/HashtagSuggestions';
import { Globe, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('write');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please add some content to your post.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Post created!",
      description: "Your post has been published successfully.",
    });

    navigate('/feed');
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Create a new post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Content Editor */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="write" className="space-y-4">
                <div>
                  <Label htmlFor="content">What's on your mind?</Label>
                  <Textarea
                    id="content"
                    placeholder="Share your thoughts... (Markdown supported)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                </div>

                <UserMentions content={content} onMention={(user) => {
                  setContent(prev => prev + `@${user} `);
                }} />

                <HashtagSuggestions content={content} onHashtag={(tag) => {
                  setContent(prev => prev + `#${tag} `);
                }} />
              </TabsContent>

              <TabsContent value="preview">
                <MarkdownPreview content={content} />
              </TabsContent>
            </Tabs>

            {/* Image Upload */}
            <div>
              <Label>Images</Label>
              <ImageUploader onImagesChange={setImages} />
              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Privacy Settings */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                {isPublic ? (
                  <Globe className="h-5 w-5 text-green-500" />
                ) : (
                  <Users className="h-5 w-5 text-blue-500" />
                )}
                <div>
                  <p className="font-medium">
                    {isPublic ? 'Public' : 'Followers only'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isPublic
                      ? 'Anyone can see this post'
                      : 'Only your followers can see this post'
                    }
                  </p>
                </div>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => navigate('/feed')}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                Publish Post
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
