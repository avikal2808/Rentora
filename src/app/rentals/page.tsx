import { Package } from 'lucide-react';

export default function RentalsPage() {
  return (
    <div className="container flex min-h-[calc(100vh-20rem)] items-center justify-center text-center">
      <div>
        <Package className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight">
          My Rentals
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          View your current and past rentals here.
        </p>
      </div>
    </div>
  );
}
