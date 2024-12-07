"use client";

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { Button } from "@/components/ui/button";

interface PaginationProps {
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  totalPages = 1501,
  onPageChange,
}: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const handlePrevious = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1

      setCurrentPage(newPage)
      onPageChange(newPage)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1

      setCurrentPage(newPage)
      onPageChange(newPage)
    }
  }

  return (
    <div className="flex items-center gap-4 bg-muted/50 px-4 py-2 rounded-lg">
      <Button
        aria-label="Previous page"
        disabled={currentPage <= 1}
        size="icon"
        variant="ghost"
        onClick={handlePrevious}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="text-sm">
        {currentPage} of {totalPages}
      </div>
      <Button
        aria-label="Next page"
        disabled={currentPage >= totalPages}
        size="icon"
        variant="ghost"
        onClick={handleNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

