type TrialStatus = "not_started" | "in_progress" | "completed" | "failed";

export function getStatusColor(status: TrialStatus): string {
  switch (status) {
    case "not_started":
      return "bg-gray-100 text-gray-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

// 더 상세한 배지 컴포넌트로 만들 수도 있습니다:
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: TrialStatus;
  className?: string;
}

// export function StatusBadge({ status, className }: StatusBadgeProps) {
//   return (
//     <span
//       className={cn(
//         "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
//         getStatusColor(status),
//         className
//       )}
//     >
//       {status}
//     </span>
//   );
// }
