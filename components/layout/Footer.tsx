import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t bg-muted/30 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-serif text-2xl font-bold text-primary">
                PawsHome
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Providing a warm and trustworthy community for pet lovers, adopters, and owners since 2024.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-foreground mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/pets" className="hover:text-primary transition-colors">Find a Pet</Link></li>
              <li><Link href="/pet-posts" className="hover:text-primary transition-colors">Lost & Found</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Pet Blog</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-serif font-bold text-foreground mb-6">Community</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/adoption" className="hover:text-primary transition-colors">Adoption Process</Link></li>
              <li><Link href="/volunteer" className="hover:text-primary transition-colors">Volunteer</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif font-bold text-foreground mb-6">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Stay updated with our latest furry friends and stories.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-background border px-4 py-2 text-sm rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium rounded-r-md hover:bg-primary/90 transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground gap-4">
          <p>© 2024 PawsHome. All rights reserved. Your trusted pet shelter companion.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
