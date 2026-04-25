import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Box, Users, MessageSquare, Eye, ArrowRight, Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminLayout } from "./layout";
import type { ArtifactWithRelations } from "@shared/schema";

interface DashboardStats {
  totalArtifacts: number;
  totalUsers: number;
  pendingComments: number;
  totalViews: number;
}

interface RecentActivity {
  id: string;
  type: "artifact" | "comment" | "user";
  title: string;
  date: string;
}

export default function AdminDashboard() {
  const { data: stats, isLoading: isLoadingStats } = useQuery<DashboardStats>({
    queryKey: ["/api/v1/admin/stats"],
  });

  const { data: recentActivity, isLoading: isLoadingActivity } = useQuery<RecentActivity[]>({
    queryKey: ["/api/v1/admin/recent-activity"],
    queryFn: async () => {
      const response = await fetch("/api/v1/admin/recent-activity");
      if (!response.ok) throw new Error("Failed to fetch activity");
      return response.json();
    },
  });

  const { data: popularArtifacts, isLoading: isLoadingPopular } = useQuery<ArtifactWithRelations[]>({
    queryKey: ["/api/v1/admin/popular-artifacts"],
    queryFn: async () => {
      const response = await fetch("/api/v1/admin/popular-artifacts?limit=5");
      if (!response.ok) throw new Error("Failed to fetch popular artifacts");
      return response.json();
    },
  });

  const statCards = [
    {
      title: "Total Artifacts",
      value: stats?.totalArtifacts ?? 0,
      icon: Box,
      href: "/admin/artifacts",
      color: "text-primary",
    },
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      href: "/admin/users",
      color: "text-blue-500",
    },
    {
      title: "Pending Comments",
      value: stats?.pendingComments ?? 0,
      icon: MessageSquare,
      href: "/admin/comments",
      color: "text-amber-500",
      badge: stats?.pendingComments ? stats.pendingComments > 0 : false,
    },
    {
      title: "Total Views",
      value: stats?.totalViews ?? 0,
      icon: Eye,
      href: "#",
      color: "text-green-500",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8" data-testid="admin-dashboard">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-serif text-2xl font-semibold" data-testid="text-dashboard-title">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to your museum admin panel</p>
          </div>
          <Link href="/admin/artifacts/new">
            <Button className="gap-2" data-testid="button-new-artifact">
              <Plus className="h-4 w-4" />
              New Artifact
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" data-testid="stats-grid">
          {statCards.map((stat) => (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover-elevate cursor-pointer transition-all" data-testid={`stat-card-${stat.title.toLowerCase().replace(" ", "-")}`}>
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className="relative">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    {stat.badge && (
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingStats ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="text-2xl font-semibold" data-testid={`text-stat-value-${stat.title.toLowerCase().replace(" ", "-")}`}>
                      {stat.value.toLocaleString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card data-testid="quick-actions-card">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/admin/artifacts/new">
                <Button variant="outline" className="w-full justify-start gap-2" data-testid="button-add-artifact">
                  <Box className="h-4 w-4" />
                  Add New Artifact
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Button>
              </Link>
              <Link href="/admin/categories">
                <Button variant="outline" className="w-full justify-start gap-2" data-testid="button-manage-categories">
                  <Box className="h-4 w-4" />
                  Manage Categories
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Button>
              </Link>
              <Link href="/admin/comments">
                <Button variant="outline" className="w-full justify-start gap-2" data-testid="button-review-comments">
                  <MessageSquare className="h-4 w-4" />
                  Review Comments
                  {stats?.pendingComments && stats.pendingComments > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {stats.pendingComments}
                    </Badge>
                  )}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card data-testid="recent-activity-card">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingActivity ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivity && recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3" data-testid={`activity-${activity.id}`}>
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        {activity.type === "artifact" && <Box className="h-4 w-4 text-primary" />}
                        {activity.type === "comment" && <MessageSquare className="h-4 w-4 text-amber-500" />}
                        {activity.type === "user" && <Users className="h-4 w-4 text-blue-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No recent activity</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6" data-testid="popular-artifacts-card">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <CardTitle className="text-lg">Popular Artifacts</CardTitle>
            </div>
            <Link href="/admin/artifacts">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoadingPopular ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-1/3 mt-1" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : popularArtifacts && popularArtifacts.length > 0 ? (
              <div className="space-y-3">
                {popularArtifacts.map((artifact, index) => (
                  <Link key={artifact.id} href={`/admin/artifacts/${artifact.id}`}>
                    <div 
                      className="flex items-center gap-4 p-2 -mx-2 rounded-md hover-elevate cursor-pointer"
                      data-testid={`popular-artifact-${artifact.id}`}
                    >
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-sm font-medium">
                        {index + 1}
                      </div>
                      {artifact.images && artifact.images.length > 0 ? (
                        <img 
                          src={artifact.images[0].url} 
                          alt={artifact.title}
                          className="h-12 w-12 object-cover rounded-md"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                          <Box className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{artifact.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {artifact.category?.name || "Uncategorized"}
                        </p>
                      </div>
                      <Badge variant="secondary" className="gap-1">
                        <Eye className="h-3 w-3" />
                        {artifact.views?.toLocaleString() || 0}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No artifacts yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
