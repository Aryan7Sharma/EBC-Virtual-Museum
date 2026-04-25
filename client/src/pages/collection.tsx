import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useLocation, useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, Loader2, Tag, MapPin, FolderOpen, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/main-layout";
import { ArtifactGrid } from "@/components/artifacts/artifact-grid";
import { FilterSidebar, type FilterState } from "@/components/artifacts/filter-sidebar";
import type { ArtifactWithRelations, Category } from "@shared/schema";
import { NewHeader } from "@/components/new-home/header";
import { NewFooter } from "@/components/new-home/footer";

interface SearchSuggestion {
  type: string;
  value: string;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function CollectionPage() {
  const search = useSearch();
  const [, setLocation] = useLocation();

  const initialFilters = useMemo(() => {
    const params = new URLSearchParams(search);
    return {
      search: params.get("search") || "",
      categories: params.get("category") ? [params.get("category")!] : [],
      materials: params.get("material") ? params.get("material")!.split(",") : [],
      regions: params.get("region") ? params.get("region")!.split(",") : [],
      sortBy: params.get("sortBy") || "newest",
      periodFrom: params.get("periodFrom") || "",
      periodTo: params.get("periodTo") || "",
    };
  }, [search]);

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [searchInput, setSearchInput] = useState(filters.search);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const limit = 12;

  const debouncedSearchInput = useDebounce(searchInput, 300);

  const { data: suggestions = [] } = useQuery<SearchSuggestion[]>({
    queryKey: ["/api/v1/artifacts/suggestions", debouncedSearchInput],
    queryFn: async () => {
      if (debouncedSearchInput.length < 2) return [];
      const response = await fetch(`/api/v1/artifacts/suggestions?q=${encodeURIComponent(debouncedSearchInput)}`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: debouncedSearchInput.length >= 2,
  });

  const handleSuggestionClick = useCallback((suggestion: SearchSuggestion) => {
    setSearchInput(suggestion.value);
    setFilters({ ...filters, search: suggestion.value });
    setShowSuggestions(false);
    setPage(1);
  }, [filters]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedSuggestionIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  }, [showSuggestions, suggestions, selectedSuggestionIndex, handleSuggestionClick]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "artifact": return <FileText className="h-4 w-4 text-muted-foreground" />;
      case "category": return <FolderOpen className="h-4 w-4 text-muted-foreground" />;
      case "material": return <Tag className="h-4 w-4 text-muted-foreground" />;
      case "region": return <MapPin className="h-4 w-4 text-muted-foreground" />;
      default: return <Search className="h-4 w-4 text-muted-foreground" />;
    }
  };

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.categories.length) params.set("category", filters.categories.join(","));
    if (filters.materials.length) params.set("material", filters.materials.join(","));
    if (filters.regions.length) params.set("region", filters.regions.join(","));
    if (filters.sortBy !== "newest") params.set("sortBy", filters.sortBy);
    if (filters.periodFrom) params.set("periodFrom", filters.periodFrom);
    if (filters.periodTo) params.set("periodTo", filters.periodTo);

    const queryString = params.toString();
    setLocation(`/collection${queryString ? `?${queryString}` : ""}`, { replace: true });
  }, [filters, setLocation]);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/v1/categories"],
  });

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    if (filters.search) params.set("search", filters.search);
    if (filters.categories.length) params.set("category", filters.categories.join(","));
    if (filters.materials.length) params.set("material", filters.materials.join(","));
    if (filters.regions.length) params.set("region", filters.regions.join(","));
    params.set("sortBy", filters.sortBy);
    if (filters.periodFrom) params.set("periodFrom", filters.periodFrom);
    if (filters.periodTo) params.set("periodTo", filters.periodTo);
    return params.toString();
  }, [filters, page]);

  const { data, isLoading } = useQuery<{
    artifacts: ArtifactWithRelations[];
    total: number;
    page: number;
    totalPages: number;
  }>({
    queryKey: ["/api/v1/artifacts", queryParams],
    queryFn: async () => {
      const response = await fetch(`/api/v1/artifacts?${queryParams}`);
      if (!response.ok) throw new Error("Failed to fetch artifacts");
      return response.json();
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchInput });
    setPage(1);
  };

  const allMaterials = useMemo(() => {
    if (!data?.artifacts) return [];
    return [...new Set(data.artifacts.map((a) => a.material).filter(Boolean))] as string[];
  }, [data?.artifacts]);

  const allRegions = useMemo(() => {
    if (!data?.artifacts) return [];
    return [...new Set(data.artifacts.map((a) => a.region).filter(Boolean))] as string[];
  }, [data?.artifacts]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-hero-gradient">
        <NewHeader />
        <div className="pt-[130px] pb-12 px-4 sm:px-6 lg:px-8 bg-card/50 bg-none bg-transparent" data-testid="collection-header">
          <div className="flex flex-col items-center max-w-7xl mx-auto">
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold mb-4" data-testid="text-collection-title">
              Collection
            </h1>
            <p className="text-muted-foreground max-w-2xl text-centre" data-testid="text-collection-description">
              Explore our curated collection of artifacts spanning centuries and continents.
              Use the filters to discover items that interest you.
            </p>

            <form onSubmit={handleSearch} className="mt-6 flex gap-2 max-w-xl" data-testid="form-search">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search artifacts..."
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setShowSuggestions(true);
                    setSelectedSuggestionIndex(-1);
                  }}
                  onFocus={() => searchInput.length >= 2 && setShowSuggestions(true)}
                  onKeyDown={handleKeyDown}
                  className="pl-10 pt-[10px] pb-[10px] h-auto"
                  data-testid="input-search"
                  autoComplete="off"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 overflow-hidden"
                    data-testid="search-suggestions"
                  >
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={`${suggestion.type}-${suggestion.value}`}
                        type="button"
                        className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${index === selectedSuggestionIndex
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent/50"
                          }`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        data-testid={`suggestion-${index}`}
                      >
                        {getSuggestionIcon(suggestion.type)}
                        <span className="flex-1 truncate">{suggestion.value}</span>
                        <span className="text-xs text-muted-foreground capitalize">{suggestion.type}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button type="submit" data-testid="button-search-submit">
                Search
              </Button>
            </form>
          </div>
        </div>
      </div>
      <main className="bg-section-white flex-1">
        <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* <FilterSidebar
                categories={categories}
                filters={filters}
                onFiltersChange={(newFilters) => {
                  setFilters(newFilters);
                  setPage(1);
                }}
                materials={allMaterials}
                regions={allRegions}
              /> */}
            <div className="hidden lg:block">
              <FilterSidebar
                categories={categories}
                filters={filters}
                onFiltersChange={(newFilters) => {
                  setFilters(newFilters);
                  setPage(1);
                }}
                materials={allMaterials}
                regions={allRegions}
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                <p className="text-sm text-muted-foreground" data-testid="text-results-count">
                  {data?.total
                    ? `Showing ${(page - 1) * limit + 1}-${Math.min(page * limit, data.total)} of ${data.total} artifacts`
                    : "Loading..."}
                </p>

                <div className="flex items-center gap-2 lg:hidden">
                  <FilterSidebar
                    categories={categories}
                    filters={filters}
                    onFiltersChange={(newFilters) => {
                      setFilters(newFilters);
                      setPage(1);
                    }}
                    materials={allMaterials}
                    regions={allRegions}
                  />
                </div>
              </div>

              <ArtifactGrid
                artifacts={data?.artifacts || []}
                isLoading={isLoading}
                emptyMessage="No artifacts match your filters. Try adjusting your search criteria."
              />

              {data && data.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10" data-testid="pagination">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    data-testid="button-prev-page"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, data.totalPages) }).map((_, i) => {
                      let pageNum: number;
                      if (data.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= data.totalPages - 2) {
                        pageNum = data.totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setPage(pageNum)}
                          data-testid={`button-page-${pageNum}`}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    disabled={page === data.totalPages}
                    onClick={() => setPage(page + 1)}
                    data-testid="button-next-page"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <NewFooter />
    </div>
  );
}
