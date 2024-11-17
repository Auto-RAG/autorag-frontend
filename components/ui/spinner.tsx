import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8'
};

export function Spinner({ className, size = 'md', ...props }: SpinnerProps) {
  return (
    <div role="status" {...props}>
      <Loader2 
        className={cn(
          "animate-spin",
          sizeClasses[size],
          className
        )} 
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
} 