"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import {
  ArrowLeft,
  Send,
  Heart,
  User,
  Mail,
  Phone,
  MapPin,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { petService } from "@/services/pet.service";
import {
  adoptionService,
  CreateAdoptionRequest,
} from "@/services/adoption.service";
import { Pet } from "@/types/pet";
import { useToast } from "@/components/ui/toast";

export default function AdoptionFormPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("AdoptionForm");
  const plT = useTranslations("PetList");
  const commonT = useTranslations("Common");
  const pt = useTranslations("PetManagement");
  const { toast } = useToast();

  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState<CreateAdoptionRequest>({
    applicantName: "",
    email: "",
    phone: "",
    address: "",
    reason: "",
    experience: "",
    hasOtherPets: false,
    otherPetsDetail: "",
    livingSituation: "",
    hasYard: false,
    commitment: "",
  });

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await petService.getPetById(params.id as string);
        setPet(response.data);
      } catch (error) {
        console.error("Failed to fetch pet:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPet();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await adoptionService.submitRequest(params.id as string, formData);
      setIsSuccess(true);
      toast({
        type: "success",
        message: t("success"),
      });
      // Optionally redirect after some time
      // setTimeout(() => router.push(`/pets/${params.id}`), 3000);
    } catch (error) {
      console.error("Failed to submit adoption request:", error);
      toast({
        type: "error",
        message: t("error"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-bold">{pt("noPetsFound")}</h2>
        <Link
          href="/pets"
          className={cn(buttonVariants({ variant: "outline" }), "rounded-xl")}>
          {commonT("back")}
        </Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-12 text-center shadow-xl space-y-8 animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-serif font-bold text-foreground">
              {t("title")}
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              {t("success")}
            </p>
          </div>
          <Link
            href={`/pets/${pet.id}`}
            className={cn(
              buttonVariants({ variant: "default" }),
              "w-full h-12 rounded-xl font-bold",
            )}>
            {commonT("back")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-24">
      {/* Header */}
      <section className="pt-20 pb-16 bg-white border-b border-border/10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-6">
            <Link
              href={`/pets/${pet.id}`}
              className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-4">
              <ArrowLeft className="h-4 w-4" /> {commonT("back")}
            </Link>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              {t("title")}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-8 mt-16">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Form Fields */}
            <div className="lg:col-span-8 space-y-12">
              {/* Section 1: Personal Info */}
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <User className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold">
                    {t("personalInfo")}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-bold">
                      {t("fullName")} *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        required
                        className="pl-10 h-12 rounded-xl"
                        placeholder="John Doe"
                        value={formData.applicantName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            applicantName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-bold">
                      {t("email")} *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        required
                        className="pl-10 h-12 rounded-xl"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-bold">
                      {t("phone")} *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        required
                        className="pl-10 h-12 rounded-xl"
                        placeholder="+84 123 456 789"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-bold">
                      {t("address")}
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="address"
                        className="pl-10 h-12 rounded-xl"
                        placeholder="Hanoi, Vietnam"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Survey */}
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <ClipboardList className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold">
                    {t("survey")}
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="reason" className="text-sm font-bold">
                      {t("reasonLabel")} *
                    </Label>
                    <textarea
                      id="reason"
                      required
                      className="w-full min-h-[120px] p-4 rounded-xl border border-input bg-background focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none"
                      placeholder="..."
                      value={formData.reason}
                      onChange={(e) =>
                        setFormData({ ...formData, reason: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience" className="text-sm font-bold">
                      {t("experienceLabel")}
                    </Label>
                    <textarea
                      id="experience"
                      className="w-full min-h-[100px] p-4 rounded-xl border border-input bg-background focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none"
                      placeholder="..."
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData({ ...formData, experience: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="hasOtherPets"
                        className="mt-1"
                        checked={formData.hasOtherPets}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            hasOtherPets: checked as boolean,
                          })
                        }
                      />
                      <Label
                        htmlFor="hasOtherPets"
                        className="text-sm font-medium leading-relaxed">
                        {t("hasOtherPetsLabel")}
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="hasYard"
                        className="mt-1"
                        checked={formData.hasYard}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            hasYard: checked as boolean,
                          })
                        }
                      />
                      <Label
                        htmlFor="hasYard"
                        className="text-sm font-medium leading-relaxed">
                        {t("hasYardLabel")}
                      </Label>
                    </div>
                  </div>

                  {formData.hasOtherPets && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <Label
                        htmlFor="otherPetsDetail"
                        className="text-sm font-bold">
                        {t("otherPetsDetailLabel")}
                      </Label>
                      <Input
                        id="otherPetsDetail"
                        className="h-12 rounded-xl"
                        placeholder="..."
                        value={formData.otherPetsDetail}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            otherPetsDetail: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label
                      htmlFor="livingSituation"
                      className="text-sm font-bold">
                      {t("livingSituationLabel")}
                    </Label>
                    <Input
                      id="livingSituation"
                      className="h-12 rounded-xl"
                      placeholder="..."
                      value={formData.livingSituation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          livingSituation: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="commitment" className="text-sm font-bold">
                      {t("commitmentLabel")}
                    </Label>
                    <textarea
                      id="commitment"
                      className="w-full min-h-[100px] p-4 rounded-xl border border-input bg-background focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none"
                      placeholder="..."
                      value={formData.commitment}
                      onChange={(e) =>
                        setFormData({ ...formData, commitment: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Agreement */}
              <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 space-y-6">
                <div className="flex items-start space-x-4">
                  <Checkbox id="agreement" required className="mt-1" />
                  <Label
                    htmlFor="agreement"
                    className="text-sm font-medium leading-relaxed cursor-pointer">
                    {t("agreement")}
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-xl text-lg font-bold shadow-lg shadow-primary/20">
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-5 w-5" />
                  )}
                  {isSubmitting ? t("submitting") : t("submit")}
                </Button>
              </div>
            </div>

            {/* Right: Pet Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-[2rem] border border-border/30 shadow-xl overflow-hidden sticky top-24">
                <div className="aspect-square relative">
                  <img
                    src={
                      pet.images?.find((img) => img.isPrimary)?.imageUrl ||
                      pet.images?.[0]?.imageUrl ||
                      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop"
                    }
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1">
                    <Heart className="h-3 w-3 fill-current" /> {t("petInfo")}
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  <div>
                    <h3 className="text-3xl font-serif font-bold text-foreground mb-1">
                      {pet.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {pet.breed?.name} • {pet.ageGroup}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground/60 mb-1">
                        {plT("genderLabel")}
                      </p>
                      <p className="font-bold">
                        {pt(`Genders.${pet.gender.toLowerCase()}`)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground/60 mb-1">
                        {plT("ageGroupLabel")}
                      </p>
                      <p className="font-bold">
                        {pt(`AgeGroups.${pet.ageGroup.toLowerCase()}`)}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/20 rounded-xl space-y-2">
                    <p className="text-xs text-muted-foreground italic leading-relaxed">
                      {t("quote")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
