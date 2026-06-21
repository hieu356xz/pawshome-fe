"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  Search as SearchIcon,
  Camera,
  X,
  Loader2,
  AlertCircle,
  PawPrint,
  MessageSquare,
  ImageIcon,
  Sparkles,
  SlidersHorizontal,
  MapPin,
  Filter,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AppPagination } from "@/components/shared/AppPagination";
import { PetCard } from "@/components/shared/PetCard";
import { PostCard } from "@/components/shared/PostCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { petService } from "@/services/pet.service";
import { petPostService } from "@/services/pet-post.service";
import { speciesService } from "@/services/species.service";
import { breedService } from "@/services/breed.service";
import {
  Pet,
  PetSearchResult,
  Species,
  Breed,
  PetGender,
  PetAgeGroup,
  AdoptionStatus,
} from "@/types/pet";
import { PetPost, PostSearchResult, PostType, PostStatus } from "@/types/post";

enum SearchTarget {
  PETS = "pets",
  POSTS = "posts",
}

export default function SearchPage() {
  const t = useTranslations("Search");
  const commonT = useTranslations("Common");
  const plT = useTranslations("PetList");
  const ptT = useTranslations("PetManagement");
  const cbT = useTranslations("CommunityBoard");

  const [target, setTarget] = useState<SearchTarget>(SearchTarget.PETS);
  const [query, setQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Data State
  const [petResults, setPetResults] = useState<PetSearchResult[]>([]);
  const [postResults, setPostResults] = useState<PostSearchResult[]>([]);
  const [species, setSpecies] = useState<Species[]>([]);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 9;

  // Filter State - Pets
  const [selectedSpecies, setSelectedSpecies] = useState<string>("all");
  const [selectedBreed, setSelectedBreed] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [selectedAge, setSelectedAge] = useState<string>("all");
  const [selectedAdoptionStatus, setSelectedAdoptionStatus] =
    useState<string>("all");

  // Filter State - Posts
  const [selectedPostType, setSelectedPostType] = useState<string>("all");
  const [selectedPostStatus, setSelectedPostStatus] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState("");

  const [detectedSpeciesMessage, setDetectedSpeciesMessage] = useState<
    string | null
  >(null);
  const skipSearchRef = useRef(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch initial metadata
  useEffect(() => {
    const fetchMetadata = async () => {
      const [speciesRes, breedsRes] = await Promise.all([
        speciesService.getAll(),
        breedService.getAll(),
      ]);
      if (speciesRes.success) setSpecies(speciesRes.data);
      if (breedsRes.success) setBreeds(breedsRes.data);
    };
    fetchMetadata();
  }, []);

  const handleSearch = useCallback(async () => {
    // We allow search if there's either text, image, or at least one filter selected
    // For simplicity, let's keep the user's rule: must have text or image
    if (!query.trim() && !selectedImage) return;

    setLoading(true);
    try {
      let currentSpeciesId =
        selectedSpecies !== "all" ? parseInt(selectedSpecies) : undefined;

      // Automatically detect species if searching pets, image is present, and species filter is "all"
      if (
        target === SearchTarget.PETS &&
        selectedImage &&
        selectedSpecies === "all"
      ) {
        try {
          const res = await petService.detectSpecies(selectedImage);
          if (res.success && res.data?.speciesId) {
            setDetectedSpeciesMessage(
              `Hệ thống tự động nhận dạng giống loài: ${res.data.name}. Nếu nhận dạng sai, bạn có thể thay đổi bộ lọc.`,
            );
            const speciesIdStr = String(res.data.speciesId);

            // Set local variable to use immediately in this search query
            currentSpeciesId = res.data.speciesId;

            // Update filter select in UI without triggering duplicate search call
            skipSearchRef.current = true;
            setSelectedSpecies(speciesIdStr);
          }
        } catch (err) {
          console.error("Species detection failed in handleSearch:", err);
        }
      }

      if (target === SearchTarget.PETS) {
        const searchParams = {
          text: query || undefined,
          page,
          limit: pageSize,
          speciesId: currentSpeciesId,
          breedId:
            selectedBreed !== "all" ? parseInt(selectedBreed) : undefined,
          gender:
            selectedGender !== "all"
              ? (selectedGender as PetGender)
              : undefined,
          ageGroup:
            selectedAge !== "all" ? (selectedAge as PetAgeGroup) : undefined,
          adoptionStatus:
            selectedAdoptionStatus !== "all"
              ? (selectedAdoptionStatus as AdoptionStatus)
              : undefined,
        };
        const response = await petService.searchPets(
          searchParams,
          selectedImage || undefined,
        );
        if (response.success) {
          setPetResults(response.data as any);
          setTotalItems(response.meta?.totalItems || response.data.length);
        }
      } else {
        const searchParams = {
          text: query || undefined,
          page,
          limit: pageSize,
          postType:
            selectedPostType !== "all"
              ? (selectedPostType as PostType)
              : undefined,
          postStatus:
            selectedPostStatus !== "all"
              ? (selectedPostStatus as PostStatus)
              : undefined,
          location: selectedLocation || undefined,
        };
        const response = await petPostService.search(
          searchParams,
          selectedImage || undefined,
        );
        if (response.success) {
          setPostResults(response.data as any);
          setTotalItems(response.meta?.totalItems || response.data.length);
        }
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  }, [
    target,
    query,
    selectedImage,
    page,
    selectedSpecies,
    selectedBreed,
    selectedGender,
    selectedAge,
    selectedAdoptionStatus,
    selectedPostType,
    selectedPostStatus,
    selectedLocation,
  ]);

  useEffect(() => {
    if (skipSearchRef.current) {
      skipSearchRef.current = false;
      return;
    }
    if (query.trim() || selectedImage) {
      handleSearch();
    }
  }, [
    page,
    selectedSpecies,
    selectedBreed,
    selectedGender,
    selectedAge,
    selectedAdoptionStatus,
    selectedPostType,
    selectedPostStatus,
    selectedLocation,
  ]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPetResults([]);
      setPostResults([]);
      setTotalItems(0);
      setDetectedSpeciesMessage(null);
      setSelectedImage(file);
      setSelectedSpecies("all"); // Reset species filter to "all" for a new image
      setPage(1);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setQuery("");
    setSelectedImage(null);
    setImagePreview(null);
    setPage(1);
    setDetectedSpeciesMessage(null);
    // Reset all filters
    setSelectedSpecies("all");
    setSelectedBreed("all");
    setSelectedGender("all");
    setSelectedAge("all");
    setSelectedAdoptionStatus("all");
    setSelectedPostType("all");
    setSelectedPostStatus("all");
    setSelectedLocation("");
    if (fileInputRef.current) fileInputRef.current.value = "";

    setPetResults([]);
    setPostResults([]);
    setTotalItems(0);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setDetectedSpeciesMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setPage(1);
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  const hasActiveFilters = () => {
    if (target === SearchTarget.PETS) {
      return (
        selectedSpecies !== "all" ||
        selectedBreed !== "all" ||
        selectedGender !== "all" ||
        selectedAge !== "all" ||
        selectedAdoptionStatus !== "all"
      );
    }
    return (
      selectedPostType !== "all" ||
      selectedPostStatus !== "all" ||
      selectedLocation !== ""
    );
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-24">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        badgeIcon={SearchIcon}
        badgeText={t("title")}
        variant="primary"
      />

      <div className="container mx-auto px-4 md:px-8 mt-12 space-y-12">
        {/* Unified Search Bar (Top) */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-[2.5rem] p-4 shadow-xl shadow-primary/5 border border-border/30 flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 relative w-full">
              <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={t("searchPlaceholder")}
                className="pl-16 h-16 rounded-[1.5rem] border-transparent bg-muted/20 focus:bg-white focus:ring-primary/20 transition-all text-lg"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <Button
                variant="ghost"
                className={cn(
                  "h-16 px-6 rounded-[1.5rem] font-bold transition-all",
                  selectedImage
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground",
                )}
                onClick={() => fileInputRef.current?.click()}>
                <Camera className="h-6 w-6" />
              </Button>
              <Button
                className="h-16 px-10 rounded-[1.5rem] font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90"
                onClick={() => {
                  setPage(1);
                  handleSearch();
                }}
                disabled={!query.trim() && !selectedImage}>
                {commonT("search")}
              </Button>
            </div>
          </div>

          {/* Image Preview Area */}
          {imagePreview && (
            <div className="bg-white rounded-[2rem] p-6 border border-primary/20 shadow-lg flex items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 rounded-2xl overflow-hidden border-2 border-primary/10">
                  <img
                    src={imagePreview}
                    alt="Search Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-lg">
                    {loading ? t("analyzing") : t("selectedImage")}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t("uploadHint")}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearImage}
                className="h-12 w-12 rounded-xl hover:bg-red-50 hover:text-red-500">
                <X className="h-6 w-6" />
              </Button>
            </div>
          )}

          {/* Target Toggle */}
          <div className="flex justify-center">
            <div className="bg-white p-2 rounded-2xl border border-border/30 shadow-sm flex gap-2">
              <button
                onClick={() => {
                  setTarget(SearchTarget.PETS);
                  setPage(1);
                }}
                className={cn(
                  "flex items-center gap-3 px-8 py-4 rounded-xl text-sm font-bold transition-all",
                  target === SearchTarget.PETS
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted/50",
                )}>
                <PawPrint className="h-5 w-5" />
                {t("searchPets")}
              </button>
              <button
                onClick={() => {
                  setTarget(SearchTarget.POSTS);
                  setPage(1);
                }}
                className={cn(
                  "flex items-center gap-3 px-8 py-4 rounded-xl text-sm font-bold transition-all",
                  target === SearchTarget.POSTS
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted/50",
                )}>
                <MessageSquare className="h-5 w-5" />
                {t("searchPosts")}
              </button>
            </div>
          </div>
        </div>

        {/* Layout with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-[2rem] border border-border/30 shadow-sm p-6 sticky top-24 space-y-8">
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  <h3 className="font-serif font-bold text-lg">
                    {plT("filters")}
                  </h3>
                </div>
                {(hasActiveFilters() || query || selectedImage) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="h-8 px-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg text-xs font-bold">
                    <X className="mr-1 h-3 w-3" />
                    {plT("clearFilters")}
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                {target === SearchTarget.PETS ? (
                  <>
                    {/* Pet Filters */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 px-1">
                        {plT("speciesLabel")}
                      </label>
                      <select
                        value={selectedSpecies}
                        onChange={(e) => {
                          setSelectedSpecies(e.target.value);
                          setPage(1);
                          setDetectedSpeciesMessage(null);
                        }}
                        disabled={loading}
                        className="w-full h-11 px-4 rounded-xl border-none bg-muted/30 text-xs font-bold focus:ring-1 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                        <option value="all">{plT("all")}</option>
                        {species.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 px-1">
                        {plT("breedLabel")}
                      </label>
                      <select
                        value={selectedBreed}
                        onChange={(e) => {
                          setSelectedBreed(e.target.value);
                          setPage(1);
                          setDetectedSpeciesMessage(null);
                        }}
                        disabled={loading}
                        className="w-full h-11 px-4 rounded-xl border-none bg-muted/30 text-xs font-bold focus:ring-1 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                        <option value="all">{plT("all")}</option>
                        {breeds
                          .filter(
                            (b) =>
                              selectedSpecies === "all" ||
                              b.speciesId === parseInt(selectedSpecies),
                          )
                          .map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 px-1">
                        {plT("genderLabel")}
                      </label>
                      <select
                        value={selectedGender}
                        onChange={(e) => {
                          setSelectedGender(e.target.value);
                          setPage(1);
                          setDetectedSpeciesMessage(null);
                        }}
                        disabled={loading}
                        className="w-full h-11 px-4 rounded-xl border-none bg-muted/30 text-xs font-bold focus:ring-1 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                        <option value="all">{plT("all")}</option>
                        {Object.entries(PetGender).map(([key, value]) => (
                          <option key={key} value={value}>
                            {ptT(`Genders.${value.toLowerCase()}`)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 px-1">
                        {plT("ageGroupLabel")}
                      </label>
                      <select
                        value={selectedAge}
                        onChange={(e) => {
                          setSelectedAge(e.target.value);
                          setPage(1);
                          setDetectedSpeciesMessage(null);
                        }}
                        disabled={loading}
                        className="w-full h-11 px-4 rounded-xl border-none bg-muted/30 text-xs font-bold focus:ring-1 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                        <option value="all">{plT("all")}</option>
                        {Object.entries(PetAgeGroup).map(([key, value]) => (
                          <option key={key} value={value}>
                            {ptT(`AgeGroups.${value.toLowerCase()}`)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 px-1">
                        {plT("statusLabel")}
                      </label>
                      <select
                        value={selectedAdoptionStatus}
                        onChange={(e) => {
                          setSelectedAdoptionStatus(e.target.value);
                          setPage(1);
                          setDetectedSpeciesMessage(null);
                        }}
                        disabled={loading}
                        className="w-full h-11 px-4 rounded-xl border-none bg-muted/30 text-xs font-bold focus:ring-1 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                        <option value="all">{plT("all")}</option>
                        {Object.entries(AdoptionStatus).map(([key, value]) => (
                          <option key={key} value={value}>
                            {ptT(`AdoptionStatuses.${value.toLowerCase()}`)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Post Filters */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 px-1">
                        {cbT("postType")}
                      </label>
                      <select
                        value={selectedPostType}
                        onChange={(e) => {
                          setSelectedPostType(e.target.value);
                          setPage(1);
                          setDetectedSpeciesMessage(null);
                        }}
                        disabled={loading}
                        className="w-full h-11 px-4 rounded-xl border-none bg-muted/30 text-xs font-bold focus:ring-1 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                        <option value="all">{plT("all")}</option>
                        {Object.entries(PostType).map(([key, value]) => (
                          <option key={key} value={value}>
                            {cbT(`PostTypes.${value.toLowerCase()}`)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 px-1">
                        {cbT("status")}
                      </label>
                      <select
                        value={selectedPostStatus}
                        onChange={(e) => {
                          setSelectedPostStatus(e.target.value);
                          setPage(1);
                          setDetectedSpeciesMessage(null);
                        }}
                        disabled={loading}
                        className="w-full h-11 px-4 rounded-xl border-none bg-muted/30 text-xs font-bold focus:ring-1 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                        <option value="all">{plT("all")}</option>
                        {Object.entries(PostStatus).map(([key, value]) => (
                          <option key={key} value={value}>
                            {cbT(`PostStatuses.${value.toLowerCase()}`)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 px-1 flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        {cbT("location")}
                      </label>
                      <Input
                        value={selectedLocation}
                        onChange={(e) => {
                          setSelectedLocation(e.target.value);
                          setPage(1);
                          setDetectedSpeciesMessage(null);
                        }}
                        disabled={loading}
                        placeholder={
                          cbT("locationPlaceholder") || "Enter location..."
                        }
                        className="h-11 rounded-xl border-none bg-muted/30 text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 space-y-8">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-serif font-bold text-foreground">
                {loading
                  ? t("analyzing")
                  : `${totalItems} ${commonT("results")}`}
              </h2>
            </div>

            {detectedSpeciesMessage && !loading && (
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-start gap-3 text-sm text-primary animate-in fade-in slide-in-from-top-2 duration-300">
                <Sparkles className="h-5 w-5 mt-0.5 text-primary flex-shrink-0 animate-pulse" />
                <div>
                  <p className="font-semibold">{detectedSpeciesMessage}</p>
                </div>
              </div>
            )}

            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary/30" />
                <p className="font-serif text-xl font-bold text-muted-foreground animate-pulse">
                  {plT("loading")}
                </p>
              </div>
            ) : (target === SearchTarget.PETS ? petResults : postResults)
                .length > 0 ? (
              <div className="flex flex-col h-full justify-between">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                  {target === SearchTarget.PETS
                    ? petResults.map((result, index) => (
                        <div
                          key={`${result.pet.id}-${index}`}
                          className="relative group/result animate-in fade-in slide-in-from-bottom-4 duration-500"
                          style={{ animationDelay: `${index * 50}ms` }}>
                          <PetCard
                            id={result.pet.id}
                            name={result.pet.name}
                            ageGroup={ptT(
                              `AgeGroups.${result.pet.ageGroup.toLowerCase()}`,
                            )}
                            breed={result.pet.breed?.name || plT("unknown")}
                            species={result.pet.species?.name || plT("unknown")}
                            gender={ptT(
                              `Genders.${result.pet.gender.toLowerCase()}`,
                            )}
                            adoptionStatus={ptT(
                              `AdoptionStatuses.${result.pet.adoptionStatus.toLowerCase()}`,
                            )}
                            imageUrl={
                              result.pet.images?.find((img) => img.isPrimary)
                                ?.imageUrl || result.pet.images?.[0]?.imageUrl
                            }
                          />
                          {result.similarityScore > 0 && (
                            <div className="absolute top-4 left-4 z-30 pointer-events-none">
                              <div className="bg-accent/90 backdrop-blur-sm text-accent-foreground text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg border border-accent/20">
                                <Sparkles className="h-3 w-3" />
                                {Math.round(result.similarityScore * 100)}%
                                Match
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    : postResults.map((result, index) => (
                        <div
                          key={`${result.post.id}-${index}`}
                          className="relative group/result animate-in fade-in slide-in-from-bottom-4 duration-500"
                          style={{ animationDelay: `${index * 50}ms` }}>
                          <PostCard
                            type={result.post.postType.toUpperCase() as any}
                            title={result.post.title}
                            description={result.post.description || ""}
                            location={result.post.location || "N/A"}
                            time={new Date(
                              result.post.createdAt,
                            ).toLocaleDateString()}
                            imageUrl={result.post.images?.[0]?.imageUrl}
                          />
                          {result.similarityScore > 0 && (
                            <div className="absolute top-4 left-4 z-30 pointer-events-none">
                              <div className="bg-accent/90 backdrop-blur-sm text-accent-foreground text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg border border-accent/20">
                                <Sparkles className="h-3 w-3" />
                                {Math.round(result.similarityScore * 100)}%
                                Match
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pt-8 border-t border-border/20">
                    <AppPagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={(p) => {
                        setPage(p);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="py-24 text-center space-y-6 bg-white rounded-[3rem] border border-dashed border-border/50 flex flex-col items-center justify-center flex-1">
                <div className="h-24 w-24 bg-muted/30 rounded-full flex items-center justify-center mx-auto">
                  <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-bold">
                    {!query.trim() && !selectedImage && !hasActiveFilters()
                      ? t("title")
                      : t("noResults")}
                  </h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    {!query.trim() && !selectedImage && !hasActiveFilters()
                      ? t("subtitle")
                      : t("noResultsDesc")}
                  </p>
                </div>
                {(hasActiveFilters() || query || selectedImage) && (
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="rounded-xl px-8 h-10">
                    {plT("clearFilters")}
                  </Button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
