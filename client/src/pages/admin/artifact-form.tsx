import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, Loader2, ArrowLeft, Upload, X, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { AdminLayout } from "./layout";
import type { Artifact, Category, ArtifactImage } from "@shared/schema";
import { ImageUpload } from "../../components/artifacts/image-upload";
import { ModelUpload } from "@/components/artifacts/model-upload";

const artifactFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  shortDescription: z.string().max(200, "Max 200 characters").optional(),
  longDescription: z.string().optional(),
  categoryId: z.string().optional(),
  material: z.string().optional(),
  region: z.string().optional(),
  period: z.string().optional(),
  year: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(["draft", "published"]),
  featured: z.boolean(),
  has3dModel: z.boolean(),
  thumbnailUrl: z.string().optional(),
  modelUrl: z.string().optional(),
});

type ArtifactFormValues = z.infer<typeof artifactFormSchema>;

export default function ArtifactForm() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isEditing = !!id && id !== "new";

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/v1/categories"],
  });

  const { data: artifact, isLoading: isLoadingArtifact } = useQuery<Artifact & { images?: ArtifactImage[] }>({
    queryKey: ["/api/v1/artifacts", id],
    enabled: isEditing,
  });

  const form = useForm<ArtifactFormValues>({
    resolver: zodResolver(artifactFormSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      longDescription: "",
      categoryId: "",
      material: "",
      region: "",
      period: "",
      year: "",
      location: "",
      status: "draft",
      featured: false,
      has3dModel: false,
      thumbnailUrl:"",
      modelUrl: "",
    },
  });

  useEffect(() => {
    if (artifact) {
      form.reset({
        title: artifact.title || "",
        shortDescription: artifact.shortDescription || "",
        longDescription: artifact.longDescription || "",
        categoryId: artifact.categoryId || "",
        material: artifact.material || "",
        region: artifact.region || "",
        period: artifact.period || "",
        year: artifact.year || "",
        location: artifact.location || "",
        status: artifact.status || "draft",
        featured: artifact.featured || false,
        has3dModel: artifact.has3dModel || false,
        thumbnailUrl: artifact.thumbnailUrl || "",
        modelUrl: artifact.modelUrl || "",
      });
    }
  }, [artifact, form]);

  const saveMutation = useMutation({
    mutationFn: async (data: ArtifactFormValues) => {
      if (isEditing) {
        return apiRequest("PUT", `/api/v1/admin/artifacts/${id}`, data);
      }
      return apiRequest("POST", "/api/v1/admin/artifacts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/v1/artifacts"] });
      toast({ title: isEditing ? "Artifact updated" : "Artifact created" });
      setLocation("/admin/artifacts");
    },
    onError: () => {
      toast({ title: "Failed to save artifact", variant: "destructive" });
    },
  });

  const onSubmit = (data: ArtifactFormValues) => {
    saveMutation.mutate(data);
  };

  if (isEditing && isLoadingArtifact) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl" data-testid="artifact-form">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/admin/artifacts")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-serif text-2xl font-semibold" data-testid="text-form-title">
              {isEditing ? "Edit Artifact" : "New Artifact"}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? "Update artifact details" : "Add a new artifact to the collection"}
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter artifact title" {...field} data-testid="input-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description (max 200 characters)"
                          className="resize-none"
                          {...field}
                          data-testid="input-short-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="longDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detailed Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed historical context and description"
                          className="min-h-[150px]"
                          {...field}
                          data-testid="input-long-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="material"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Bronze, Ceramic" {...field} data-testid="input-material" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Ancient Egypt" {...field} data-testid="input-region" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="period"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Historical Period</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Bronze Age" {...field} data-testid="input-period" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year/Date</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 1500 BCE" {...field} data-testid="input-year" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Current Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Where is the artifact housed?" {...field} data-testid="input-location" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3D Model</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                    control={form.control}
                    name="thumbnailUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Artifact Thumbnail</FormLabel>
                        <FormControl>
                          <ImageUpload
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="has3dModel"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between gap-4">
                      <div>
                        <FormLabel>Has 3D Model</FormLabel>
                        <p className="text-sm text-muted-foreground">Enable to add a 3D model URL</p>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-has-3d-model" />
                      </FormControl>
                    </FormItem>
                  )}
                />          
                {form.watch("has3dModel") && (
                  <FormField
                    control={form.control}
                    name="modelUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>3D Model</FormLabel>
                        <FormControl>
                          <ModelUpload
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-status">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between gap-4">
                      <div>
                        <FormLabel>Featured Artifact</FormLabel>
                        <p className="text-sm text-muted-foreground">Display on homepage featured section</p>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-featured" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex items-center justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/admin/artifacts")}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saveMutation.isPending} data-testid="button-save">
                {saveMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isEditing ? "Update Artifact" : "Create Artifact"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}
