import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
const AnalyticsView = dynamic(
  () => import("@/components/dashboard/AnalyticsView"),
  {
    loading: () => (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    ),
  },
);
export default function AnalyticsPage() {
  return <AnalyticsView />;
}
