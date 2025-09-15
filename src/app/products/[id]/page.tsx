'use client';

import { getProductById } from '@/lib/data';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { notFound, useRouter } from 'next/navigation';
import { ShoppingCart, CheckCircle, XCircle } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { useToast } from '@/hooks/use-toast';
import { suggestRelatedProducts } from '@/ai/flows/suggest-related-products-flow';
import Link from 'next/link';

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = getProductById(params.id);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  if (!product) {
    notFound();
  }

  const handleAddToCart = async () => {
    addToCart(product);
    const { id, title, dismiss } = toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });

    try {
      const related = await suggestRelatedProducts({ product });
      if (related.products.length > 0) {
        toast({
          id,
          title: 'Added to cart!',
          description: (
            <div className="flex flex-col gap-4">
              <span>{product.name} has been added to your cart.</span>
              <div>
                <p className="mb-2 font-bold">You might also like:</p>
                <ul className="space-y-2">
                  {related.products.map((p) => (
                    <li key={p.productId}>
                      <Link
                        href={`/products/${p.productId}`}
                        onClick={() => dismiss()}
                        className="group flex items-start gap-3"
                      >
                        <div className="font-semibold text-primary group-hover:underline">
                          {getProductById(p.productId)?.name}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          - {p.reason}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ),
        });
      }
    } catch (e) {
      console.error('Failed to get related products', e);
      // Fail silently, the user still gets the "added to cart" notification
    }
  };

  return (
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-2 lg:gap-16">
        <div className="overflow-hidden rounded-lg">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={800}
            height={600}
            data-ai-hint={product.imageHint}
            className="h-auto w-full object-cover"
          />
        </div>
        <div>
          <Badge variant="secondary">{product.category}</Badge>
          <h1 className="font-headline mt-2 mb-4 text-4xl font-bold tracking-tight">
            {product.name}
          </h1>
          <p className="mb-4 text-3xl font-bold text-primary">
            ₹{product.pricePerDay}
            <span className="text-base font-normal text-muted-foreground">
              /day
            </span>
          </p>
          <div className="mb-6 flex items-center gap-2">
            {product.availability ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm text-muted-foreground">
                  Available for rent
                </span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-destructive" />
                <span className="text-sm text-destructive">
                  Currently unavailable
                </span>
              </>
            )}
          </div>

          <p className="mb-8 leading-relaxed text-foreground/80">
            {product.description}
          </p>

          <Button
            size="lg"
            disabled={!product.availability}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
