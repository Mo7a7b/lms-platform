"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CourseCard from "@/components/CourseCard";
import { Search, Filter } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useDebounce } from "@/hooks/useDebounce";
import { COURSE_CATEGORIES } from "@/lib/constants";

interface CourseDiscoveryProps {
  courses: App.Course[];
}

export function CourseDiscovery({ courses }: CourseDiscoveryProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL State
  const initialQuery = searchParams.get("query") || "";
  const initialCategory = searchParams.get("category") || "All";
  const initialSort = searchParams.get("sort") || "newest";

  // Local State
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  // Debounce expensive or rapid updates
  const debouncedSearchQuery = useDebounce(searchQuery, 0);
  const debouncedPriceRange = useDebounce(priceRange, 0);

  // Sync state with URL only when DEBOUNCED values change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearchQuery) params.set("query", debouncedSearchQuery);
    else params.delete("query");

    if (selectedCategory && selectedCategory !== "All")
      params.set("category", selectedCategory);
    else params.delete("category");

    params.set("sort", selectedSort);

    const newQueryString = params.toString();
    const currentQueryString = searchParams.toString();

    if (newQueryString !== currentQueryString) {
      router.replace(`/courses?${newQueryString}`, { scroll: false });
    }
  }, [
    debouncedSearchQuery,
    selectedCategory,
    selectedSort,
    router,
    searchParams,
  ]);

  // Categories Listing
  const categories = useMemo(() => {
    return ["All", ...COURSE_CATEGORIES];
  }, []);

  // Filter Logic (Uses Debounced Values)
  const filteredCourses = useMemo(() => {
    let result = courses;

    // 1. Search Query
    if (debouncedSearchQuery) {
      const q = debouncedSearchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q),
      );
    }

    // 2. Category
    if (selectedCategory !== "All") {
      result = result.filter((c) => {
        // Handle both Number (Enum index) and String (Name) from API
        const categoryName =
          typeof c.category === "number"
            ? COURSE_CATEGORIES[c.category]
            : String(c.category);
        return categoryName === selectedCategory;
      });
    }

    // 3. Price Filter
    if (showFreeOnly) {
      result = result.filter((c) => c.price === 0);
    } else {
      result = result.filter(
        (c) =>
          c.price >= debouncedPriceRange[0] &&
          c.price <= debouncedPriceRange[1],
      );
    }

    // 4. Sort
    return result.sort((a, b) => {
      if (selectedSort === "price-asc") return a.price - b.price;
      if (selectedSort === "price-desc") return b.price - a.price;
      if (selectedSort === "oldest")
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // newest default
    });
  }, [
    courses,
    debouncedSearchQuery,
    selectedCategory,
    selectedSort,
    showFreeOnly,
    debouncedPriceRange,
  ]);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <div className="relative bg-zinc-900 border-b border-zinc-800 overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-indigo-600/20" />
        <div className="container relative mx-auto px-4 md:px-6 py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white tracking-tight">
            Explore Courses
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl leading-relaxed">
            Discover professionally crafted courses to upskill your career.
            Filter by category, price, and popularity to find your perfect
            match.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 bg-white rounded-xl border p-6 shadow-sm">
              <FilterSidebar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                showFreeOnly={showFreeOnly}
                setShowFreeOnly={setShowFreeOnly}
              />
            </div>
          </aside>

          {/* Mobile Filter Sheet */}
          <div className="lg:hidden w-full mb-6 flex items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
            <span className="font-semibold text-zinc-800 ">Filters</span>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" /> Filter Courses
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <div className="py-6">
                  <h2 className="text-xl font-bold p-5">Filters</h2>
                  <FilterSidebar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    categories={categories}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    showFreeOnly={showFreeOnly}
                    setShowFreeOnly={setShowFreeOnly}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Bar Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="text-zinc-500 font-medium">
                Showing{" "}
                <span className="text-zinc-900 font-bold">
                  {filteredCourses.length}
                </span>{" "}
                courses
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-500 whitespace-nowrap hidden sm:inline">
                  Sort by:
                </span>
                <Select value={selectedSort} onValueChange={setSelectedSort}>
                  <SelectTrigger className="w-full sm:w-[180px] bg-white">
                    <SelectValue placeholder="Sort order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price-asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-desc">
                      Price: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Grid */}
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    price={course.price}
                    poster={course.poster}
                    rating={course.rating}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white border rounded-xl shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 mb-6">
                  <Search className="w-8 h-8 text-zinc-400" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">
                  No courses found
                </h3>
                <p className="text-zinc-500 max-w-sm mx-auto mb-6">
                  We couldn&apos;t find any courses matching your current
                  filters. Try adjusting your search query or removing some
                  filters.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setPriceRange([0, 500]);
                    setShowFreeOnly(false);
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Sidebar Content (Reusable)
const FilterSidebar = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  priceRange,
  setPriceRange,
  showFreeOnly,
  setShowFreeOnly,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  showFreeOnly: boolean;
  setShowFreeOnly: (show: boolean) => void;
}) => (
  <div className="space-y-8 p-5 md:p-0">
    {/* Search */}
    <div className="space-y-3">
      <Label className="text-base font-semibold">Search</Label>
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
        <Input
          placeholder="Search courses..."
          className="pl-9 bg-zinc-50/50 border-zinc-200 focus:bg-white transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>

    {/* Categories */}
    <div className="space-y-3">
      <Label className="text-base font-semibold">Category</Label>
      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat} className="flex items-center space-x-3 group">
            <Checkbox
              id={cat}
              checked={selectedCategory === cat}
              onCheckedChange={() => setSelectedCategory(cat)}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label
              htmlFor={cat}
              className="text-sm text-zinc-600 font-medium leading-none cursor-pointer group-hover:text-zinc-900 transition-colors"
            >
              {cat}
            </label>
          </div>
        ))}
      </div>
    </div>

    {/* Price Range */}
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Price Range</Label>
        <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
          ${priceRange[0]} - ${priceRange[1]}
        </span>
      </div>
      <Slider
        disabled={showFreeOnly}
        defaultValue={[0, 500]}
        min={0}
        max={500}
        step={10}
        value={priceRange}
        onValueChange={(val) => setPriceRange(val as [number, number])}
        className={showFreeOnly ? "opacity-30 pointer-events-none" : ""}
      />
      <div className="pt-2">
        <div className="flex items-center space-x-3 p-3 bg-zinc-50 rounded-lg border border-zinc-100">
          <Checkbox
            id="free-only"
            checked={showFreeOnly}
            onCheckedChange={(c) => setShowFreeOnly(c as boolean)}
          />
          <label
            htmlFor="free-only"
            className="text-sm font-medium text-zinc-700 cursor-pointer select-none"
          >
            Free Courses Only
          </label>
        </div>
      </div>
    </div>
  </div>
);
