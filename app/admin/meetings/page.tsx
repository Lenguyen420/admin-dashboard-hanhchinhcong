import type { Metadata } from "next";

import GenericAdminPage, {
  type GenericAdminConfig,
} from "@/components/admin/GenericAdminPage";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Admin Meetings",
  description: "Quản lý cuộc họp",
};

const config: GenericAdminConfig = {
  title: "Quản lý cuộc họp",
  eyebrow: "Meetings",
  description: "Tạo, cập nhật và theo dõi lịch họp trong hệ thống.",
  resource: "meetings",
  columns: [
    { key: "id", label: "ID" },
    { key: "title", label: "Tiêu đề" },
    { key: "status", label: "Trạng thái" },
    { key: "startTime", label: "Bắt đầu" },
    { key: "endTime", label: "Kết thúc" },
    { key: "hostName", label: "Chủ trì" },
    { key: "roomName", label: "Phòng họp" },
  ],
  fields: [
    { name: "title", label: "Tiêu đề", required: true },
    { name: "status", label: "Trạng thái", type: "select", options: [
      { label: "Nháp", value: "DRAFT" },
      { label: "Đã lên lịch", value: "SCHEDULED" },
      { label: "Đang diễn ra", value: "IN_PROGRESS" },
      { label: "Hoàn tất", value: "COMPLETED" },
      { label: "Đã hủy", value: "CANCELLED" },
    ] },
    { name: "startTime", label: "Thời gian bắt đầu", type: "datetime-local" },
    { name: "endTime", label: "Thời gian kết thúc", type: "datetime-local" },
    { name: "hostId", label: "ID người chủ trì" },
    { name: "roomId", label: "ID phòng họp" },
    { name: "typeId", label: "ID loại cuộc họp" },
    { name: "departmentIds", label: "departmentIds JSON", type: "json" },
    { name: "guests", label: "guests JSON", type: "json" },
    { name: "description", label: "Mô tả", type: "textarea" },
  ],
};

export default function Page() {
  return (
    <AppShell activeHref="/admin/meetings">
      <GenericAdminPage config={config} />
    </AppShell>
  );
}
