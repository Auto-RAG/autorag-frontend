// components/custom-navigation.tsx
"use client";

import { useRouter } from "next/navigation";
import { Home, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CustomNavigation() {
  const router = useRouter();

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Button
                className="text-xl font-bold"
                variant="ghost"
                onClick={() => router.push("/")}
              >
                AutoRAG Console
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button size="sm" variant="ghost" onClick={() => router.push("/")}>
              <Home className="h-5 w-5 mr-2" />
              Home
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => router.push("/projects")}
            >
              <Home className="h-5 w-5 mr-2" />
              Projects
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => router.push("/settings")}
            >
              <Settings className="h-5 w-5 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
