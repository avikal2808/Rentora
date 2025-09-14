'use client';

import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/product-card';
import { products, categories } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sparkles } from 'lucide-react';
import { Suspense } from 'react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category');
  const recommendedProductId = searchParams.get('recommendedId');
  const recommendationReason = searchParams.get('reason');

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  const handleCategoryClick = () => {
    // This function is just to have an onClick on the button to clear recommendations
  };

  return (
    <div className="container py-12">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight">
          {selectedCategory || 'All Rentals'}
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-lg text-muted-foreground">
          Find the perfect item for your needs from our extensive collection, or
          let our AI assistant help you choose.
        </p>
      </div>

      {recommendedProductId && recommendationReason && (
        <Alert className="mx-auto my-8 max-w-2xl">
          <Sparkles className="h-4 w-4" />
          <AlertTitle>Our Recommendation</AlertTitle>
          <AlertDescription>{recommendationReason}</AlertDescription>
        </Alert>
      )}

      <div className="my-8 flex flex-wrap items-center justify-center gap-2">
        <Button
          variant={!selectedCategory ? 'default' : 'outline'}
          asChild
          onClick={handleCategoryClick}
        >
          <Link href="/products">All</Link>
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            asChild
            onClick={handleCategoryClick}
          >
            <Link href={`/products?category=${encodeURIComponent(category)}`}>
              {category}
            </Link>
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isRecommended={product.id === recommendedProductId}
          />
        ))}
      </div>
      {filteredProducts.length === 0 && (
        <div className="col-span-full py-16 text-center">
          <p className="text-xl text-muted-foreground">
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
