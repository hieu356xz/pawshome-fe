import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { Button, buttonVariants } from "@/components/ui/button";
import { PostCard } from "@/components/shared/PostCard";
import { PetCard } from "@/components/shared/PetCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />

        {/* Recent Pet Posts Section */}
        <section className="py-24 bg-muted/20">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex justify-between items-end mb-12">
              <div className="space-y-4">
                <h2 className="text-4xl">Community Notice Board</h2>
                <p className="text-muted-foreground">Recent lost, found, and adoption posts from our members.</p>
              </div>
              <Link 
                href="/pet-posts" 
                className={cn(buttonVariants({ variant: "link" }), "text-primary font-bold group flex items-center")}
              >
                View All Posts <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <PostCard 
                type="LOST"
                title="Golden Retriever - &quot;Buddy&quot;"
                description="Last seen near the Central Park area. Very friendly, wearing a blue collar. Please contact if seen."
                location="District 1, HCM"
                time="2 hours ago"
              />
              <PostCard 
                type="FOUND"
                title="Small White Terrier"
                description="Found wandering in the residential area. No collar, seems well-cared for. Currently safe with us."
                location="District 7, HCM"
                time="5 hours ago"
              />
              <PostCard 
                type="LOST"
                title="Black Cat with White Paws"
                description="Scared away by fireworks. Very timid, please do not chase. Call immediately if spotted."
                location="District 2, HCM"
                time="1 day ago"
              />
            </div>
          </div>
        </section>

        {/* Available Pets Section */}
        <section className="py-24">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-5xl">Meet Our Residents</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These beautiful souls are looking for a forever home. Each one has been health-checked and is ready to join your family.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <PetCard 
                name="Milo"
                ageGroup="ADULT"
                breed="Domestic Shorthair"
                species="Cat"
                gender="Male"
                adoptionStatus="SEEKING"
              />
              <PetCard 
                name="Luna"
                ageGroup="YOUNG"
                breed="Husky Mix"
                species="Dog"
                gender="Female"
                adoptionStatus="PENDING"
              />
              <PetCard 
                name="Oliver"
                ageGroup="BABY"
                breed="Golden Retriever"
                species="Dog"
                gender="Male"
                adoptionStatus="NEW_INTAKE"
              />
              <PetCard 
                name="Bella"
                ageGroup="SENIOR"
                breed="Persian"
                species="Cat"
                gender="Female"
                adoptionStatus="SEEKING"
              />
            </div>

            <div className="mt-16 text-center">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md h-14 px-10 text-lg">
                Find Your Perfect Companion
              </Button>
            </div>
          </div>
        </section>

        {/* Blog Preview Section */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-1 space-y-6">
                <h2 className="text-5xl leading-tight">Educational Corner & <span className="text-accent italic">Pet Stories</span></h2>
                <p className="text-primary-foreground/80 text-lg">
                  Learn about pet care, nutrition, and read heartwarming stories of adoption from our community members.
                </p>
                <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Read Our Blog
                </Button>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
                    <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">Article</p>
                    <h4 className="text-xl font-serif mb-4 line-clamp-2">How to prepare your home for a new puppy</h4>
                    <Link href="/blog/1" className="text-sm font-bold flex items-center hover:underline">
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                 </div>
                 <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 mt-8 sm:mt-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-accent mb-4">Adoption Story</p>
                    <h4 className="text-xl font-serif mb-4 line-clamp-2">Mochi&apos;s journey from the streets to a warm bed</h4>
                    <Link href="/blog/2" className="text-sm font-bold flex items-center hover:underline">
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                 </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
