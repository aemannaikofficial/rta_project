import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import Editions from "./pages/Editions";
import Newsletters from "./pages/Newsletters";
import VideosPage from "./pages/VideosPage";
import VideoDetail from "./pages/VideoDetail";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetail from "./pages/ArticleDetail";
import PostersPage from "./pages/PostersPage";
import PosterDetail from "./pages/PosterDetail";
import DashboardLayout from "./components/DashboardLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminEditions from "./pages/AdminEditions";
import AdminVideos from "./pages/AdminVideos";
import AdminArticles from "./pages/AdminArticles";
import AdminPosters from "./pages/AdminPosters";

import AdminComments from "./pages/AdminComments";
import AdminNewsletters from "./pages/AdminNewsletters";

function AdminRouter() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/users" component={AdminUsers} />
        <Route path="/admin/editions" component={AdminEditions} />
        <Route path="/admin/videos" component={AdminVideos} />
        <Route path="/admin/articles" component={AdminArticles} />
        <Route path="/admin/posters" component={AdminPosters} />

        <Route path="/admin/newsletters" component={AdminNewsletters} />
        <Route path="/admin/comments" component={AdminComments} />
        <Route component={AdminDashboard} />
      </Switch>
    </DashboardLayout>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Editions} />
      <Route path="/edition/:id" component={Home} />
      <Route path="/newsletters" component={Newsletters} />
      <Route path="/videos" component={VideosPage} />
      <Route path="/videos/:id" component={VideoDetail} />
      <Route path="/articles" component={ArticlesPage} />
      <Route path="/articles/:id" component={ArticleDetail} />
      <Route path="/posters" component={PostersPage} />
      <Route path="/posters/:id" component={PosterDetail} />

      {/* Admin routes */}
      <Route path="/admin/:rest*" component={AdminRouter} />
      <Route path="/admin" component={AdminRouter} />

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
