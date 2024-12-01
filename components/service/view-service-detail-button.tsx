"use client";

import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface ViewServiceDetailButtonProps {
  service_id: string;
}

export function ViewServiceDetailButton({ service_id }: ViewServiceDetailButtonProps) {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/service/${service_id}/knowledge`);
    
    console.log(`Viewing details for service: ${service_id}`);
  };

  return (
    <Button
      size="icon"
      title="View Details"
      variant="ghost"
      onClick={handleViewDetails}
    >
      <Eye className="h-4 w-4" />
    </Button>
  );
}
