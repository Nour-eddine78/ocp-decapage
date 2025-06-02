"use client";

import { createContext, useContext, useState } from "react";
import { AppSidebar } from "./AppSidebar";

const SidebarContext = createContext();

export function useSidebar() {
  return useContext(SidebarContext);
}

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="flex min-h-screen bg-gray-100">
        {/* Fixed Sidebar */}
        <div className="fixed top-0 left-0 z-50 h-full">
          <AppSidebar />
        </div>

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ease-in-out overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-600 scrollbar-track-gray-100 ${
            isOpen ? "ml-80 sm:ml-64 md:ml-80" : "ml-20"
          } p-4 sm:p-6 md:p-8`}
        >
          {children}
        </main>
      </div>
    </SidebarContext.Provider>
  );
}