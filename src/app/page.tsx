import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { products, categories } from '@/lib/data';
import Link from 'next/link';
import {
  ArrowRight,
  Camera,
  Mountain,
  PartyPopper,
  Wrench,
} from 'lucide-react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';

const categoryIcons: { [key: string]: React.ReactNode } = {
  Electronics: <Camera className="h-8 w-8" />,
  'Outdoor Gear': <Mountain className="h-8 w-8" />,
  'Party Supplies': <PartyPopper className="h-8 w-8" />,
  Tools: <Wrench className="h-8 w-8" />,
};

export default function Home() {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full">
        <Image
          src="https://picsum.photos/seed/hero/1800/800"
          alt="Colorful abstract background"
          fill
          data-ai-hint="abstract background"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container text-center">
            <h1 className="font-headline text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Rent Anything, Anytime
            </h1>
            <p className="mx-auto mt-3 max-w-md text-lg text-foreground/80 sm:text-xl md:mt-5 md:max-w-3xl">
              Discover a world of possibilities. Rent top-quality gear for your
              next adventure, project, or event.
            </p>
            <div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Button asChild size="lg">
                  <Link href="/products">Browse Rentals</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 sm:py-24">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-headline text-3xl font-bold tracking-tight">
              Featured Rentals
            </h2>
            <Button variant="ghost" asChild>
              <Link href="/products">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="bg-secondary py-16 sm:py-24">
        <div className="container">
          <h2 className="mb-12 text-center font-headline text-3xl font-bold tracking-tight">
            Explore by Category
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/products?category=${encodeURIComponent(category)}`}
              >
                <Card className="group flex flex-col items-center justify-center p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:bg-primary hover:text-primary-foreground">
                  <div className="mb-4 text-primary transition-colors group-hover:text-primary-foreground">
                    {categoryIcons[category] || <Camera className="h-8 w-8" />}
                  </div>
                  <h3 className="font-headline font-semibold">{category}</h3>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
