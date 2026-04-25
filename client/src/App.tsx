import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
//import HomePage2 from "@/pages/home";
import CollectionPage from "@/pages/collection";
import ArtifactDetailPage from "@/pages/artifact-detail";
import AboutPage from "@/pages/about";
import SignupPage from "./pages/signup";
import SigninPage from "./pages/signin";
import NewHomePage from "./pages/new-home";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminArtifacts from "@/pages/admin/artifacts";
import ArtifactForm from "@/pages/admin/artifact-form";
import AdminComments from "@/pages/admin/comments";
import AdminUsers from "@/pages/admin/users";
import AdminCategories from "@/pages/admin/categories";

function Router() {
  return (
    <Switch>
      <Route path="/" component={NewHomePage} />
      {/* <Route path="/new-home" component={NewHomePage} /> */}
      <Route path="/collection" component={CollectionPage} />
      <Route path="/artifacts/:id" component={ArtifactDetailPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/signin" component={SigninPage} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/artifacts" component={AdminArtifacts} />
      <Route path="/admin/artifacts/new" component={ArtifactForm} />
      <Route path="/admin/artifacts/:id" component={ArtifactForm} />
      <Route path="/admin/comments" component={AdminComments} />
      {/* <Route path="/admin/users" component={AdminUsers} /> */}
      <Route path="/admin/categories" component={AdminCategories} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
