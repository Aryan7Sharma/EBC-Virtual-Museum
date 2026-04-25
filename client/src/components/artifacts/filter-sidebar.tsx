import { useState } from "react";
import { X, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { Category } from "@shared/schema";

interface FilterState {
  search: string;
  categories: string[];
  materials: string[];
  regions: string[];
  sortBy: string;
  periodFrom: string;
  periodTo: string;
}

interface FilterSidebarProps {
  categories: Category[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  materials?: string[];
  regions?: string[];
}

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "a-z", label: "Alphabetical (A-Z)" },
  { value: "z-a", label: "Alphabetical (Z-A)" },
];

function FilterContent({ categories, filters, onFiltersChange, materials = [], regions = [] }: FilterSidebarProps) {
  const activeFiltersCount = 
    filters.categories.length + 
    filters.materials.length + 
    filters.regions.length +
    (filters.periodFrom ? 1 : 0) +
    (filters.periodTo ? 1 : 0);

  const clearAllFilters = () => {
    onFiltersChange({
      ...filters,
      categories: [],
      materials: [],
      regions: [],
      periodFrom: "",
      periodTo: "",
    });
  };

  const toggleCategory = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((c) => c !== categoryId)
      : [...filters.categories, categoryId];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const toggleMaterial = (material: string) => {
    const newMaterials = filters.materials.includes(material)
      ? filters.materials.filter((m) => m !== material)
      : [...filters.materials, material];
    onFiltersChange({ ...filters, materials: newMaterials });
  };

  const toggleRegion = (region: string) => {
    const newRegions = filters.regions.includes(region)
      ? filters.regions.filter((r) => r !== region)
      : [...filters.regions, region];
    onFiltersChange({ ...filters, regions: newRegions });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif font-semibold text-lg">Filters</h3>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} data-testid="button-clear-filters">
            Clear all
          </Button>
        )}
      </div>

      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2" data-testid="active-filters">
          {filters.categories.map((catId) => {
            const category = categories.find((c) => c.id === catId);
            return category ? (
              <Badge key={catId} variant="secondary" className="gap-1">
                {category.name}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => toggleCategory(catId)}
                />
              </Badge>
            ) : null;
          })}
          {filters.materials.map((material) => (
            <Badge key={material} variant="secondary" className="gap-1">
              {material}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleMaterial(material)}
              />
            </Badge>
          ))}
          {filters.regions.map((region) => (
            <Badge key={region} variant="secondary" className="gap-1">
              {region}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleRegion(region)}
              />
            </Badge>
          ))}
        </div>
      )}

      <div>
        <Label className="text-sm font-medium mb-2 block">Sort By</Label>
        <Select
          value={filters.sortBy}
          onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value })}
        >
          <SelectTrigger data-testid="select-sort">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium">
          Categories
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pt-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={filters.categories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
                data-testid={`checkbox-category-${category.id}`}
              />
              <Label
                htmlFor={`category-${category.id}`}
                className="text-sm font-normal cursor-pointer"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {materials.length > 0 && (
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium">
            Materials
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-2">
            {materials.map((material) => (
              <div key={material} className="flex items-center space-x-2">
                <Checkbox
                  id={`material-${material}`}
                  checked={filters.materials.includes(material)}
                  onCheckedChange={() => toggleMaterial(material)}
                  data-testid={`checkbox-material-${material}`}
                />
                <Label
                  htmlFor={`material-${material}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {material}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      {regions.length > 0 && (
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium">
            Regions
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-2">
            {regions.map((region) => (
              <div key={region} className="flex items-center space-x-2">
                <Checkbox
                  id={`region-${region}`}
                  checked={filters.regions.includes(region)}
                  onCheckedChange={() => toggleRegion(region)}
                  data-testid={`checkbox-region-${region}`}
                />
                <Label
                  htmlFor={`region-${region}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {region}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium">
          Historical Period
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-2">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Year From</Label>
            <Input
              type="text"
              placeholder="e.g., -3000 or 1500"
              value={filters.periodFrom}
              onChange={(e) => onFiltersChange({ ...filters, periodFrom: e.target.value })}
              data-testid="input-period-from"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Year To</Label>
            <Input
              type="text"
              placeholder="e.g., 1900 or 2000"
              value={filters.periodTo}
              onChange={(e) => onFiltersChange({ ...filters, periodTo: e.target.value })}
              data-testid="input-period-to"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Use negative numbers for BCE dates
          </p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export function FilterSidebar(props: FilterSidebarProps) {
  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0" data-testid="sidebar-filters">
        <div className="sticky top-20 p-4 rounded-lg border border-border bg-card">
          <FilterContent {...props} />
        </div>
      </aside>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden gap-2" data-testid="button-open-filters">
            <Filter className="h-4 w-4" />
            Filtersss
            {(props.filters.categories.length + props.filters.materials.length + props.filters.regions.length) > 0 && (
              <Badge variant="secondary" className="ml-1">
                {props.filters.categories.length + props.filters.materials.length + props.filters.regions.length}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle className="font-serif">Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent {...props} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export type { FilterState };
