import type { Metadata } from "next";

import CrudAdminPage from "@/components/admin/CrudAdminPage";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Admin Users",
  description: "Quan ly nguoi dung he thong",
};

export default function Page() {
  return (
    <AppShell activeHref="/admin/users">
      <CrudAdminPage
        config={{
          activeHref: "/admin/users",
          columns: [
            { key: "id", label: "ID" },
            { key: "name", label: "Tên" },
            { key: "email", label: "Email" },
            { key: "role", label: "Vai trò" },
            { key: "createdAt", label: "Ngày tạo" },
          ],
          createTitle: "Tạo người dùng",
          description:
            "Quản lý tài khoản người dùng, vai trò và các thông tin định danh từ endpoint /users.",
          emptyText: "Chưa có người dùng nào.",
          eyebrow: "Users",
          fields: [
            {
              label: "Tên người dùng",
              name: "name",
              placeholder: "Nguyễn Văn A",
              required: true,
            },
            {
              label: "Email",
              name: "email",
              placeholder: "user@example.com",
              required: true,
              type: "email",
            },
            {
              label: "Mật khẩu",
              name: "password",
              placeholder: "••••••••",
              required: true,
              type: "password",
            },
            {
              label: "Vai trò",
              name: "role",
              options: [
                { label: "User", value: "USER" },
                { label: "Admin", value: "ADMIN" },
              ],
              required: true,
              type: "select",
            },
          ],
          listTitle: "Danh sách người dùng",
          resource: "users",
          title: "Quản lý người dùng",
        }}
      />
    </AppShell>
  );
}
