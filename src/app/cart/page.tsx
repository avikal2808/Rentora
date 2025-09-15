'use client';

import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { cartItems, removeFromCart, cartCount, totalPrice } = useCart();

  if (cartCount === 0) {
    return (
      <div className="container flex min-h-[calc(100vh-20rem)] items-center justify-center text-center">
        <div>
          <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground" />
          <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight">
            Your Cart is Empty
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Button asChild className="mt-6">
            <Link href="/products">Start Browsing</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="font-headline mb-8 text-4xl font-bold tracking-tight">
        Your Cart
      </h1>
      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex items-center gap-4 p-4">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={150}
                    height={100}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-grow">
                    <h3 className="font-headline font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.category}
                    </p>
                    <p className="mt-2 text-lg font-bold text-primary">
                      ₹{item.pricePerDay}
                      <span className="text-sm font-normal text-muted-foreground">
                        /day
                      </span>
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>Calculated at checkout</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild size="lg" className="w-full">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
