import type { Metadata } from "next";

import CrudAdminPage from "@/components/admin/CrudAdminPage";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Admin Feedback Types",
  description: "Quan ly loai phan anh kien nghi",
};

export default function Page() {
  return (
    <AppShell activeHref="/admin/feedback-types">
      <CrudAdminPage
        config={{
          activeHref: "/admin/feedback-types",
          columns: [
            { key: "id", label: "ID" },
            { key: "title", label: "Tên loại" },
            { key: "order", label: "Thứ tự" },
            { key: "createdAt", label: "Ngày tạo" },
          ],
          createTitle: "Thêm loại phản ánh",
          description:
            "Quản lý danh mục loại phản ánh để người dân chọn khi gửi phản ánh, kiến nghị.",
          emptyText: "Chưa có loại phản ánh nào.",
          eyebrow: "Feedback types",
          fields: [
            {
              label: "Tên loại phản ánh",
              name: "title",
              placeholder: "VD: Hạ tầng đô thị",
              required: true,
            },
            {
              label: "Thứ tự hiển thị",
              name: "order",
              placeholder: "1",
              required: true,
              type: "number",
            },
          ],
          listTitle: "Danh sách loại phản ánh",
          resource: "feedback-types",
          title: "Quản lý loại phản ánh",
        }}
      />
    </AppShell>
  );
}
