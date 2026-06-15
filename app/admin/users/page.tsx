import type { Metadata } from "next";

import CrudAdminPage from "@/components/feedbacks/Feedback";
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
          mockData: [
            {
              id: 1,
              name: "Nguyễn Văn Minh",
              email: "minh.nguyen@example.gov.vn",
              role: "ADMIN",
              createdAt: "2026-06-12T01:30:00.000Z",
            },
            {
              id: 2,
              name: "Trần Thị Lan",
              email: "lan.tran@example.gov.vn",
              role: "USER",
              createdAt: "2026-06-11T03:15:00.000Z",
            },
            {
              id: 3,
              name: "Lê Quang Huy",
              email: "huy.le@example.gov.vn",
              role: "USER",
              createdAt: "2026-06-10T08:45:00.000Z",
            },
          ],
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
