import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface JumpToTopProps {
  show: boolean;
}

export function JumpToTop({ show }: JumpToTopProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!show) return null;

  return (
    <Button
      onClick={scrollToTop}
      size="icon"
      className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg"
    >
      <ArrowUp className="h-4 w-4" />
    </Button>
  );
}
