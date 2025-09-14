import Image from 'next/image';
import Link from 'next/link';
import { type Product } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function ProductCard({
  product,
  isRecommended = false,
}: {
  product: Product;
  isRecommended?: boolean;
}) {
  return (
    <Card
      className={cn(
        'group overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md',
        isRecommended && 'ring-2 ring-primary ring-offset-2'
      )}
    >
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={600}
            height={400}
            data-ai-hint={product.imageHint}
            className="h-48 w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
          />
          {isRecommended && (
            <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">
              <Check className="h-4 w-4" />
              <span>Recommended</span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <h3 className="font-headline text-lg font-semibold leading-tight">
              {product.name}
            </h3>
            <Badge variant="secondary">{product.category}</Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {product.description.substring(0, 60)}...
          </p>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-lg font-bold text-primary">
              ${product.pricePerDay}
              <span className="text-sm font-normal text-muted-foreground">
                /day
              </span>
            </p>
            <Button
              size="sm"
              variant="ghost"
              className="opacity-0 transition-opacity group-hover:opacity-100"
            >
              View Details <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
