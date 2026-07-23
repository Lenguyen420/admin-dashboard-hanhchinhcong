import type { Metadata } from "next";

import AppShell from "@/components/layout/AppShell";
import { PointReportPage } from "@/components/tasks/TaskManagementPages";

export const metadata: Metadata = {
  title: "Báo cáo điểm",
  description: "Báo cáo điểm công việc theo tháng",
};

export default function Page() {
  return (
    <AppShell activeHref="/admin/point-report">
      <PointReportPage />
    </AppShell>
  );
}
