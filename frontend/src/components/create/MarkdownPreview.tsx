import { Card, CardContent } from '@/components/ui/card';

interface MarkdownPreviewProps {
  content: string;
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  // Simple markdown parsing for preview
  const parseMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 rounded">$1</code>')
      .replace(/\n/g, '<br />');
  };

  return (
    <Card>
      <CardContent className="p-4">
        {content ? (
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
          />
        ) : (
          <p className="text-muted-foreground text-center py-8">
            Nothing to preview yet. Start writing in the Write tab!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
