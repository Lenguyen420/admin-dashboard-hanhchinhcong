import type { Metadata } from "next";

import CrudAdminPage from "@/components/feedbacks/Feedback";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Admin OCOP",
  description: "Quản lý sản phẩm OCOP",
};

export default function Page() {
  return (
    <AppShell activeHref="/admin/ocops">
      <CrudAdminPage
        config={{
          activeHref: "/admin/ocop",

          resource: "ocops",

          title: "Quản lý sản phẩm OCOP",

          eyebrow: "OCOP",

          description:
            "Quản lý sản phẩm OCOP, cửa hàng và đánh giá của người dùng.",

          createTitle: "Thêm sản phẩm OCOP",

          listTitle: "Danh sách sản phẩm OCOP",

          emptyText: "Chưa có sản phẩm OCOP nào.",

          columns: [
            {
              key: "id",
              label: "ID",
            },
            {
              key: "name",
              label: "Tên sản phẩm",
            },
            {
              key: "type.name",
              label: "Loại OCOP",
            },
            {
              key: "store.name",
              label: "Cửa hàng",
            },
            {
              key: "star",
              label: "Đánh giá",
            },
            {
              key: "createdAt",
              label: "Ngày tạo",
            },
          ],

          fields: [
            {
              name: "name",
              label: "Tên sản phẩm",
              placeholder: "Nhập tên sản phẩm",
              required: true,
            },

            {
              name: "description",
              label: "Mô tả",
              placeholder: "Nhập mô tả sản phẩm",
              type: "textarea",
            },

            {
              name: "star",
              label: "Điểm đánh giá",
              placeholder: "0 - 5",
              type: "number",
            },

            {
              name: "typeId",
              label: "ID Loại OCOP",
              placeholder: "Nhập typeId",
            },

            {
              name: "storeId",
              label: "ID Cửa hàng",
              placeholder: "Nhập storeId",
            },
          ],

          editFields: [
            {
              name: "name",
              label: "Tên sản phẩm",
              required: true,
            },

            {
              name: "description",
              label: "Mô tả",
              type: "textarea",
            },

            {
              name: "star",
              label: "Điểm đánh giá",
              type: "number",
            },

            {
              name: "typeId",
              label: "ID Loại OCOP",
            },

            {
              name: "storeId",
              label: "ID Cửa hàng",
            },
          ],
        }}
      />
    </AppShell>
  );
}