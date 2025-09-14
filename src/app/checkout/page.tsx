import { CreditCard } from 'lucide-react';

export default function CheckoutPage() {
  return (
    <div className="container flex min-h-[calc(100vh-20rem)] items-center justify-center text-center">
      <div>
        <CreditCard className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight">
          Checkout
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          This is where the checkout process will happen.
        </p>
      </div>
    </div>
  );
}
