import Link from 'next/link';
import { Tent, Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="container max-w-screen-2xl">
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-3">
          <div className="flex flex-col items-start gap-4">
            <Link href="/" className="flex items-center space-x-2">
              <Tent className="h-6 w-6 text-primary" />
              <span className="font-headline text-lg font-bold">Rentora</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Rent anything, anytime. Your one-stop shop for all rental needs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-2 md:grid-cols-3">
            <div>
              <h3 className="font-headline mb-4 text-sm font-semibold text-foreground">
                Company
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-headline mb-4 text-sm font-semibold text-foreground">
                Rentals
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/products?category=Electronics"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Electronics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=Outdoor+Gear"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Outdoor Gear
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=Tools"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Tools
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    All Items
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-headline mb-4 text-sm font-semibold text-foreground">
                Legal
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border/40 py-6 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Rentora. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#">
              <Github className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </Link>
            <Link href="#">
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </Link>
            <Link href="#">
              <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
