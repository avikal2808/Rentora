'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ProductRecommender } from './product-recommender';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';

export function AiRecommenderFab() {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-2xl"
        >
          <Sparkles className="h-7 w-7" />
          <span className="sr-only">Recommend Product</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end" sideOffset={16}>
        <ProductRecommender onRecommended={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}
