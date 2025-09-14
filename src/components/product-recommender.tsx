'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import {
  recommendProduct,
  RecommendProductOutput,
} from '@/ai/flows/recommend-product-flow';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function ProductRecommender() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await recommendProduct({ description });
      const params = new URLSearchParams({
        recommendedId: result.productId,
        reason: result.reason,
      });
      router.push(`/products?${params.toString()}`);
    } catch (error) {
      console.error('Recommendation failed:', error);
      toast({
        variant: 'destructive',
        title: 'Recommendation Error',
        description:
          'Sorry, we were unable to generate a recommendation at this time.',
      });
    }
    setLoading(false);
  };

  return (
    <div className="grid w-full gap-2">
      <p className="text-sm text-muted-foreground">
        Tell us what you need, and our AI will find the perfect item for you.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. 'a camera for my vacation'"
          className="min-h-[40px]"
          disabled={loading}
        />
        <Button type="submit" disabled={!description || loading}>
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Sparkles className="h-5 w-5" />
          )}
          <span className="sr-only">Recommend</span>
        </Button>
      </form>
    </div>
  );
}
