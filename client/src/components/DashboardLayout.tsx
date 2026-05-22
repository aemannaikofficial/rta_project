import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { getLoginUrl } from "@/const";
import { useIsMobile } from "@/hooks/useMobile";
import { LayoutDashboard, LogOut, PanelLeft, Users, Newspaper, Globe, Shield, FileText, Video, Image, MessageSquare, Mail } from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation, Link } from "wouter";
import { DashboardLayoutSkeleton } from './DashboardLayoutSkeleton';
import { Button } from "./ui/button";
import { LOGO_URL } from "@/data/newsletter";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Newspaper, label: "Editions", path: "/admin/editions" },
  { icon: Mail, label: "Newsletters", path: "/admin/newsletters" },
  { icon: FileText, label: "Articles", path: "/admin/articles" },
  { icon: Video, label: "Videos", path: "/admin/videos" },
  { icon: Image, label: "Posters", path: "/admin/posters" },
  { icon: MessageSquare, label: "Comments", path: "/admin/comments" },
  { icon: Users, label: "Users", path: "/admin/users" },
];

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 200;
const MAX_WIDTH = 480;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading, user } = useAuth();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  if (loading) {
    return <DashboardLayoutSkeleton />
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#003B71]">
        <div className="flex flex-col items-center gap-8 p-8 max-w-md w-full bg-white rounded-xl shadow-2xl">
          <img src={LOGO_URL} alt="RTA" className="h-16 w-auto" />
          <div className="flex flex-col items-center gap-3">
            <h1 className="text-2xl font-bold text-[#003B71] text-center">
              Admin Panel
            </h1>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              Sign in to access the RTA AI Newsletter administration dashboard.
            </p>
          </div>
          <Button
            onClick={() => {
              window.location.href = getLoginUrl();
            }}
            size="lg"
            className="w-full bg-[#C8102E] hover:bg-[#a00d24] text-white shadow-lg hover:shadow-xl transition-all"
          >
            <Shield className="w-4 h-4 mr-2" />
            Sign in to Admin
          </Button>
          <Link href="/">
            <span className="text-sm text-[#003B71] hover:text-[#C8102E] cursor-pointer transition-colors">
              ← Back to Newsletter
            </span>
          </Link>
        </div>
      </div>
    );
  }

  // Check if user is admin
  if (user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#003B71]">
        <div className="flex flex-col items-center gap-6 p-8 max-w-md w-full bg-white rounded-xl shadow-2xl">
          <img src={LOGO_URL} alt="RTA" className="h-16 w-auto" />
          <Shield className="w-12 h-12 text-[#C8102E]" />
          <h1 className="text-xl font-bold text-[#003B71] text-center">
            Access Denied
          </h1>
          <p className="text-sm text-gray-500 text-center">
            You do not have admin privileges. Contact the system administrator to request access.
          </p>
          <Link href="/">
            <span className="text-sm text-[#003B71] hover:text-[#C8102E] cursor-pointer transition-colors">
              ← Back to Newsletter
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": `${sidebarWidth}px`,
        } as CSSProperties
      }
    >
      <DashboardLayoutContent setSidebarWidth={setSidebarWidth}>
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}

type DashboardLayoutContentProps = {
  children: React.ReactNode;
  setSidebarWidth: (width: number) => void;
};

function DashboardLayoutContent({
  children,
  setSidebarWidth,
}: DashboardLayoutContentProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeMenuItem = menuItems.find(item => item.path === location);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isCollapsed) {
      setIsResizing(false);
    }
  }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - sidebarLeft;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setSidebarWidth(newWidth);
      }
    };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  return (
    <>
      <div className="relative" ref={sidebarRef}>
        <Sidebar
          collapsible="icon"
          className="border-r-0 bg-[#003B71]"
          disableTransition={isResizing}
        >
          <SidebarHeader className="h-16 justify-center bg-[#003B71]">
            <div className="flex items-center gap-3 px-2 transition-all w-full">
              <button
                onClick={toggleSidebar}
                className="h-8 w-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors focus:outline-none shrink-0"
                aria-label="Toggle navigation"
              >
                <PanelLeft className="h-4 w-4 text-white/70" />
              </button>
              {!isCollapsed ? (
                <div className="flex items-center gap-2 min-w-0">
                  <img src={LOGO_URL} alt="RTA" className="h-8 w-auto" />
                  <span className="font-semibold tracking-tight truncate text-white text-sm">
                    Admin Panel
                  </span>
                </div>
              ) : null}
            </div>
          </SidebarHeader>

          <SidebarContent className="gap-0 bg-[#003B71]">
            <SidebarMenu className="px-2 py-1">
              {menuItems.map(item => {
                const isActive = location === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => setLocation(item.path)}
                      tooltip={item.label}
                      className={`h-10 transition-all font-normal text-white/70 hover:text-white hover:bg-white/10 ${isActive ? "!bg-[#C8102E] !text-white" : ""}`}
                    >
                      <item.icon className={`h-4 w-4 ${isActive ? "text-white" : ""}`} />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
            {/* Back to site link */}
            <div className="px-4 mt-6">
              <Link href="/">
                <span className="flex items-center gap-2 text-white/50 hover:text-white text-xs transition-colors cursor-pointer">
                  <Globe className="w-3.5 h-3.5" />
                  {!isCollapsed && "View Newsletter"}
                </span>
              </Link>
            </div>
          </SidebarContent>

          <SidebarFooter className="p-3 bg-[#003B71]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-lg px-1 py-1 hover:bg-white/10 transition-colors w-full text-left group-data-[collapsible=icon]:justify-center focus:outline-none">
                  <Avatar className="h-9 w-9 border border-white/20 shrink-0">
                    <AvatarFallback className="text-xs font-medium bg-[#C8102E] text-white">
                      {user?.name?.charAt(0).toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-medium truncate leading-none text-white">
                      {user?.name || "Admin"}
                    </p>
                    <p className="text-xs text-white/50 truncate mt-1.5">
                      {user?.email || "admin"}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <div
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-white/20 transition-colors ${isCollapsed ? "hidden" : ""}`}
          onMouseDown={() => {
            if (isCollapsed) return;
            setIsResizing(true);
          }}
          style={{ zIndex: 50 }}
        />
      </div>

      <SidebarInset>
        {isMobile && (
          <div className="flex border-b h-14 items-center justify-between bg-background/95 px-2 backdrop-blur supports-[backdrop-filter]:backdrop-blur sticky top-0 z-40">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="h-9 w-9 rounded-lg bg-background" />
              <span className="tracking-tight text-foreground">
                {activeMenuItem?.label ?? "Admin"}
              </span>
            </div>
          </div>
        )}
        <main className="flex-1 p-6 bg-gray-50 min-h-screen">{children}</main>
      </SidebarInset>
    </>
  );
}
