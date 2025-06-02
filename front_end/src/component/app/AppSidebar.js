"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "./Layout";
import {
  LayoutDashboard,
  Users,
  Server,
  Wrench,
  AlertTriangle,
  BarChart,
  FileText,
  LogOut,
  Menu,
  X,
  Accueil,
  ChevronDown,
  User,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
  Bell,
  Activity,
  Shield,
  Database,
} from "lucide-react";

// Navigation Data with Role Permissions
const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    id: "dashboard",
    allowedRoles: ["Admin", "Manager", "Operator", "Viewer"],
    
  },
  {
    title: "Accueil",
    url: "/Accueil",
    icon: LayoutDashboard,
    id: "Accueil",
    allowedRoles: ["Superadmin", "Admin", "Manager"],
    
  },
  {
    title: "Superadmin Dashboard",
    url: "/superadmin/dashboard",
    icon: Shield,
    id: "superadmin-dashboard",
    allowedRoles: ["Superadmin"],
    
  },
  {
    title: "Machines",
    url: "/machines",
    icon: Server,
    id: "machines",
    allowedRoles: ["Superadmin", "Admin", "Manager", "Operator", "Viewer"],
    
  },
  {
    title: "Operations",
    url: "/operations",
    icon: Wrench,
    id: "operations",
    allowedRoles: ["Superadmin", "Admin", "Manager", "Operator", "Viewer"],
    
  },
  {
    title: "Incidents",
    url: "/incidents",
    icon: AlertTriangle,
    id: "incidents",
    allowedRoles: ["Superadmin", "Admin", "Manager", "Operator", "Viewer"],
      },
  {
    title: "Performance",
    url: "/performances",
    icon: BarChart,
    id: "performances",
    allowedRoles: ["Superadmin", "Admin", "Manager", "Operator", "Viewer"],
    
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
    id: "reports",
    allowedRoles: ["Superadmin", "Admin", "Manager", "Viewer"],
      },
  {
    title: "User Management",
    url: "/users",
    icon: Users,
    id: "users",
    allowedRoles: ["Superadmin", "Admin", "Manager"],
    
  },
];

export function AppSidebar() {
  const { isOpen, setIsOpen } = useSidebar();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState("Viewer");
  const [notifications, setNotifications] = useState(3);
  const navigate = useNavigate();

  // Mock User Data
  const userData = {
    name: "John Doe",
    email: "john@ocp.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: userRole,
    status: "online",
  };



  useEffect(() => {
    const role = localStorage.getItem("role") || "Viewer";
    setUserRole(role);

    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile && isOpen) {
        setIsOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [isOpen, setIsOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
    console.log("Logout clicked");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleMobileSidebar = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (item) => {
    setActiveItem(item.id);
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
    navigate(item.url);
  };

  // Filter navigation items based on user role
  const filteredNavMain = navMain.filter((item) =>
    item.allowedRoles.map((role) => role.toLowerCase()).includes(userRole.toLowerCase())
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileSidebar}
        className="fixed top-4 left-4 z-50 md:hidden rounded-xl bg-white/95 backdrop-blur-sm p-3 shadow-xl border border-emerald-200/50 hover:bg-emerald-50 transition-all duration-200 hover:scale-105"
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5 text-emerald-700" />
        ) : (
          <Menu className="h-5 w-5 text-emerald-700" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out md:relative md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:block ${isOpen ? "w-80 sm:w-64 md:w-80" : "w-20"} bg-gradient-to-b from-emerald-900 via-emerald-800 to-green-900 shadow-2xl border-r border-emerald-700/30`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-pattern opacity-30"></div>

        {/* Header */}
        <div className="relative border-b border-emerald-700/30 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 transition-all duration-300 ${!isOpen && "md:justify-center"}`}>
              <div className="relative">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg">
                  <span className="text-base sm:text-lg font-bold text-white">OCP</span>
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 bg-green-400 rounded-full border-2 border-emerald-800 animate-pulse"></div>
              </div>
              {isOpen && (
                <div className="overflow-hidden">
                  <h1 className="text-lg sm:text-xl font-bold text-white">OCP Portal</h1>
                  <p className="text-xs text-emerald-200">Management System</p>
                </div>
              )}
            </div>

            {/* Desktop Toggle Button */}
            <button
              onClick={toggleSidebar}
              className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-700/50 hover:bg-emerald-600/50 text-emerald-200 hover:text-white transition-all duration-200 hover:scale-110"
            >
              {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="relative flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-emerald-600 scrollbar-track-emerald-800">
          <nav className="space-y-2">
            {filteredNavMain.map((item) => {
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.title}
                  onClick={() => handleNavClick(item)}
                  className={`group relative flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg transform scale-[1.02]"
                      : "text-emerald-100 hover:bg-emerald-700/50 hover:text-white hover:scale-[1.01]"
                  } ${!isOpen && "md:justify-center md:px-2"}`}
                >
                  <item.icon
                    className={`h-5 w-5 transition-all duration-200 ${
                      isActive ? "text-white" : "text-emerald-300 group-hover:text-emerald-100"
                    }`}
                  />
                  {isOpen && (
                    <>
                      <span className="flex-1 text-left">{item.title}</span>
                      {item.badge }
                      {isActive && (
                        <div className="absolute right-2 h-2 w-2 rounded-full bg-white shadow-sm" />
                      )}
                    </>
                  )}


                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="relative border-t border-emerald-700/30 p-4">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all duration-200 hover:bg-emerald-700/50 group ${!isOpen && "md:justify-center md:px-2"}`}
            >


              {isOpen && (
                <>
                  <div className="flex-1 min-w-0">

                    <p className="text-xs text-emerald-200 truncate">{userData.role}</p>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-emerald-300 transition-transform duration-200 ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </>
              )}

              {/* Tooltip for collapsed state */}
              {!isOpen && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
                  <div className="font-semibold">{userData.name}</div>
                  <div className="text-xs text-gray-300">{userData.role}</div>
                  <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                </div>
              )}
            </button>

            {/* User Dropdown Menu */}
            {userMenuOpen && isOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 rounded-xl bg-white shadow-2xl border border-gray-200 py-2 z-50 backdrop-blur-sm">


                <div className="my-1 border-t border-gray-100" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4 text-red-500" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}