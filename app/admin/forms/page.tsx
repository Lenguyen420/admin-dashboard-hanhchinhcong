import type { Metadata } from "next";

import CrudAdminPage from "@/components/admin/CrudAdminPage";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Admin Forms",
  description: "Quản lý danh mục biểu mẫu",
};

export default function Page() {
  return (
    <AppShell activeHref="/admin/forms">
      <CrudAdminPage
        config={{
          activeHref: "/admin/forms",

          title: "Quản lý biểu mẫu",

          eyebrow: "Forms",

          description:
            "Quản lý danh mục biểu mẫu, đơn từ và văn bản hành chính.",

          resource: "document-categories",

          createTitle: "Thêm loại biểu mẫu",

          listTitle: "Danh sách biểu mẫu",

          emptyText: "Chưa có biểu mẫu nào.",

          columns: [
            {
              key: "id",
              label: "ID",
            },
            {
              key: "name",
              label: "Tên biểu mẫu",
            },
            {
              key: "description",
              label: "Mô tả",
            },
            {
              key: "order",
              label: "Thứ tự",
            },
            {
              key: "createdAt",
              label: "Ngày tạo",
            },
          ],

          fields: [
            {
              name: "name",
              label: "Tên biểu mẫu",
              placeholder: "VD: Đơn xin nghỉ phép",
              required: true,
            },
            {
              name: "description",
              label: "Mô tả",
              placeholder:
                "Nhập mô tả cho biểu mẫu",
              type: "textarea",
            },
            {
              name: "order",
              label: "Thứ tự hiển thị",
              placeholder: "1",
              type: "number",
              required: true,
            },
          ],
        }}
      />
    </AppShell>
  );
}