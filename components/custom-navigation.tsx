// components/custom-navigation.tsx
"use client";

import { useRouter } from "next/navigation";
import { Baby, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CustomNavigation() {
  const router = useRouter();

  return (
    <nav className="border-b bg-white">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8     bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-300 border-b">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Button
                className="text-xl font-ibm font-extrabold -ml-4 "
                variant="ghost"
                onClick={() => router.push("/service")}
              >
                AutoRAG GUI
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* <Button size="sm" variant="ghost" onClick={() => router.push("/")}>
              <Home className="h-5 w-5 mr-2" />
              Home
            </Button> */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => router.push("/service")}
            >
              <Baby className="h-5 w-5 mr-2" />
              Newbie
            </Button>
            {/* <Button
              size="sm"
              variant="ghost"
              onClick={() => router.push("/projects")}
            >
              <Home className="h-5 w-5 mr-2" />
              Projects
            </Button> */}
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
