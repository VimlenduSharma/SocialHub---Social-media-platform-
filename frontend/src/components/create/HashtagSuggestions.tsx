import { Button } from '@/components/ui/button';
import { Hash } from 'lucide-react';

interface HashtagSuggestionsProps {
  content: string;
  onHashtag: (tag: string) => void;
}

const trendingTags = [
  'react', 'javascript', 'webdev', 'coding', 'design',
  'frontend', 'backend', 'startup', 'tech', 'programming'
];

export function HashtagSuggestions({ content, onHashtag }: HashtagSuggestionsProps) {
  const lastWord = content.split(' ').pop() || '';
  const showSuggestions = lastWord.startsWith('#') && lastWord.length > 1;
  const searchTerm = lastWord.slice(1).toLowerCase();

  const filteredTags = trendingTags.filter(tag =>
    tag.toLowerCase().includes(searchTerm)
  );

  if (!showSuggestions || filteredTags.length === 0) return null;

  return (
    <div className="border rounded-lg p-2 bg-background shadow-sm">
      <p className="text-sm font-medium mb-2">Trending hashtags:</p>
      <div className="flex flex-wrap gap-1">
        {filteredTags.slice(0, 5).map((tag) => (
          <Button
            key={tag}
            variant="outline"
            size="sm"
            onClick={() => onHashtag(tag)}
            className="h-7"
          >
            <Hash className="h-3 w-3 mr-1" />
            {tag}
          </Button>
        ))}
      </div>
    </div>
  );
}
