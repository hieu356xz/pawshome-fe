"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Link } from "@/lib/navigation";
import {
  ChevronLeft,
  Heart,
  Share2,
  ShieldCheck,
  ShieldX,
  Scale,
  Calendar,
  Info,
  Activity,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Stethoscope,
  Palette,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { petService } from "@/services/pet.service";
import { Pet } from "@/types/pet";
import { cn } from "@/lib/utils";

export default function PetDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const t = useTranslations("PetDetail");
  const pt = useTranslations("PetManagement");
  const commonT = useTranslations("PetList");

  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await petService.getPetById(id);
        if (response.success) {
          setPet(response.data);
          // Set initial active image
          const primary = response.data.images?.find((img) => img.isPrimary);
          setActiveImage(
            primary?.imageUrl || response.data.images?.[0]?.imageUrl || "",
          );
        }
      } catch (error) {
        console.error("Failed to fetch pet details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary/30" />
        <p className="font-serif text-xl font-bold text-muted-foreground animate-pulse">
          {commonT("loading")}
        </p>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-serif font-bold mb-4">
          {commonT("noPetsFound")}
        </h2>
        <Link href="/pets">
          <Button variant="outline" className="rounded-xl">
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t("backToList")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-24">
      {/* Navigation & Header */}
      <div className="container mx-auto px-4 md:px-8 pt-8 mb-8">
        <Link
          href="/pets"
          className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors group mb-6">
          <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {t("backToList")}
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-primary/5 rounded-full text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/10">
                {pet.species?.name}
              </span>
              <span className="text-muted-foreground/30 text-xs font-bold tracking-widest uppercase">
                {pet.petCode}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              {pet.name}
            </h1>
            <p className="text-lg text-muted-foreground font-medium italic">
              {pet.breed?.name}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl h-12 w-12 shadow-sm">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold group">
              {t("adoptMe")}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Gallery & Details */}
          <div className="lg:col-span-7 space-y-12">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden border border-border/40 shadow-xl bg-white group">
                <img
                  src={activeImage}
                  alt={pet.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full border border-border/10 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    {pt(`AdoptionStatuses.${pet.adoptionStatus.toLowerCase()}`)}
                  </p>
                </div>
              </div>

              {pet.images && pet.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                  {pet.images.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(img.imageUrl)}
                      className={cn(
                        "relative flex-shrink-0 w-24 aspect-square rounded-2xl overflow-hidden border-2 transition-all",
                        activeImage === img.imageUrl
                          ? "border-primary shadow-md scale-105"
                          : "border-transparent opacity-70 hover:opacity-100",
                      )}>
                      <img
                        src={img.imageUrl}
                        alt={pet.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* About Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-primary rounded-full" />
                <h2 className="text-2xl font-serif font-bold text-foreground">
                  {t("about")}
                </h2>
              </div>
              <div className="prose prose-stone max-w-none">
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {pet.description || t("noDescription")}
                </p>
              </div>
            </div>

            {/* Health & Personality Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="bg-white rounded-[1.5rem] border border-border/30 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-50 rounded-lg text-green-600">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif font-bold text-lg">
                    {t("health")}
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={cn(
                        "h-4 w-4",
                        pet.isVaccinated
                          ? "text-green-500"
                          : "text-muted-foreground/30",
                      )}
                    />
                    <span className="text-sm font-medium">
                      {pet.isVaccinated ? t("vaccinated") : t("notVaccinated")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={cn(
                        "h-4 w-4",
                        pet.isNeutered
                          ? "text-green-500"
                          : "text-muted-foreground/30",
                      )}
                    />
                    <span className="text-sm font-medium">
                      {pet.isNeutered ? t("neutered") : t("notNeutered")}
                    </span>
                  </div>
                  {pet.healthSummary && (
                    <p className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-xl italic mt-2">
                      {pet.healthSummary}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-[1.5rem] border border-border/30 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                    <Activity className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif font-bold text-lg">
                    {t("description")}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pet.description || t("noNotes")}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Key Characteristics & Sidebar Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-[2rem] border border-border/30 shadow-sm p-8 sticky top-32">
              <h3 className="text-xl font-serif font-bold mb-8 flex items-center gap-2">
                <Info className="h-5 w-5 text-primary/40" />
                {t("characteristics")}
              </h3>

              <div className="grid grid-cols-2 gap-y-10 gap-x-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-muted/20 rounded-2xl text-primary">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
                      {commonT("ageGroupLabel")}
                    </p>
                    <p className="font-serif font-bold text-lg">
                      {pt(`AgeGroups.${pet.ageGroup.toLowerCase()}`)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-muted/20 rounded-2xl text-primary">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
                      {commonT("genderLabel")}
                    </p>
                    <p className="font-serif font-bold text-lg">
                      {pt(`Genders.${pet.gender.toLowerCase()}`)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-muted/20 rounded-2xl text-primary">
                    <Palette className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
                      {commonT("colorLabel")}
                    </p>
                    <p className="font-serif font-bold text-lg">
                      {pet.color || t("unknown")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-muted/20 rounded-2xl text-primary">
                    <Scale className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">
                      {t("weight")}
                    </p>
                    <p className="font-serif font-bold text-lg">
                      {pet.weight ? `${pet.weight} kg` : commonT("unknown")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-10 border-t border-border/40 space-y-6">
                <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <div className="p-2 bg-primary text-white rounded-lg">
                    <Stethoscope className="h-4 w-4" />
                  </div>
                  <Link href="/adoption" className="flex-1 group/process">
                    <p className="text-xs font-bold text-primary group-hover/process:underline flex items-center gap-1">
                      {t("adoptionProcess")} <ArrowRight className="h-3 w-3" />
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      {t("adoptionProcessDesc")}
                    </p>
                  </Link>
                </div>

                <Link
                  href={`/pets/${pet.id}/adopt`}
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-bold shadow-xl shadow-primary/20 group",
                  )}>
                  {t("adoptMe")}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>

                <div className="flex items-center justify-center">
                  <Link
                    href={"/contact"}
                    className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-[0.2em]">
                    {t("contactSupport")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
