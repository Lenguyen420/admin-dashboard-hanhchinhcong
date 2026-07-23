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
    { key: "date", label: "Ngày họp" },
    { key: "mode", label: "Hình thức" },
    { key: "status", label: "Trạng thái" },
    { key: "startTime", label: "Bắt đầu" },
    { key: "endTime", label: "Kết thúc" },
    { key: "hostName", label: "Chủ trì" },
    { key: "roomName", label: "Phòng họp" },
  ],
  fields: [
    {
      name: "title",
      label: "Tiêu đề",
      placeholder: "Tiêu đề cuộc họp",
      required: true,
    },
    {
      name: "date",
      label: "Ngày họp",
      type: "date",
      required: true,
    },
    {
      name: "startTime",
      label: "Giờ bắt đầu",
      type: "time",
      required: true,
    },
    {
      name: "endTime",
      label: "Giờ kết thúc",
      type: "time",
      required: true,
    },
    {
      name: "mode",
      label: "Hình thức",
      type: "select",
      required: true,
      options: [
        { label: "Trực tiếp", value: "DIRECT" },
        { label: "Trực tuyến", value: "ONLINE" },
        { label: "Kết hợp", value: "HYBRID" },
      ],
    },
    {
      name: "hostId",
      label: "UUID người chủ trì",
      placeholder: "UUID của người chủ trì",
      required: true,
    },
    {
      name: "roomId",
      label: "UUID phòng họp",
      placeholder: "UUID phòng họp nếu họp trực tiếp/kết hợp",
    },
    {
      name: "typeId",
      label: "UUID loại cuộc họp",
      placeholder: "UUID loại cuộc họp",
    },
    {
      name: "allDay",
      label: "Họp cả ngày",
      type: "checkbox",
      placeholder: "Họp cả ngày",
    },
    { name: "description", label: "Mô tả", type: "textarea" },
    { name: "agenda", label: "Chương trình họp", type: "textarea" },
    {
      name: "departmentIds",
      label: "Phòng ban tham gia JSON",
      type: "json",
      placeholder: "[\"uuid-phong-ban-1\", \"uuid-phong-ban-2\"]",
    },
    {
      name: "guests",
      label: "Khách mời JSON",
      type: "json",
      placeholder:
        "[{\"name\":\"Nguyễn Văn A\",\"unit\":\"UBND\",\"email\":\"a@example.com\",\"phone\":\"090...\"}]",
    },
    {
      name: "reminderMinutes",
      label: "Nhắc trước JSON",
      type: "json",
      placeholder: "[15, 30]",
    },
  ],
};

export default function Page() {
  return (
    <AppShell activeHref="/admin/meetings">
      <GenericAdminPage config={config} />
    </AppShell>
  );
}
