import type { Metadata } from "next";

import CrudAdminPage from "@/components/admin/CrudAdminPage";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Admin Feedbacks",
  description: "Quan ly phan anh kien nghi cua nguoi dan",
};

export default function Page() {
  return (
    <AppShell activeHref="/admin/feedbacks">
      <CrudAdminPage
        config={{
          activeHref: "/admin/feedbacks",
          columns: [
            { key: "id", label: "ID" },
            { key: "title", label: "Tiêu đề" },
            { key: "type", label: "Loại" },
            { key: "content", label: "Nội dung" },
            { key: "response", label: "Phản hồi" },
            { key: "creationTime", label: "Ngày gửi" },
          ],
          createTitle: "Tạo phản ánh",
          description:
            "Theo dõi phản ánh của người dân, cập nhật nội dung xử lý và xóa các bản ghi không hợp lệ.",
          emptyText: "Chưa có phản ánh nào.",
          eyebrow: "Feedbacks",
          fields: [
            {
              label: "Tiêu đề",
              name: "title",
              placeholder: "VD: Cần sửa đèn đường",
              required: true,
            },
            {
              label: "Nội dung phản ánh",
              name: "content",
              placeholder: "Nhập nội dung phản ánh...",
              required: true,
              type: "textarea",
            },
            {
              helper: "ID lấy từ trang loại phản ánh.",
              label: "Feedback type ID",
              name: "feedbackTypeId",
              placeholder: "1",
              required: true,
              type: "number",
            },
            {
              helper: "Nếu backend yêu cầu captcha/token, nhập tại đây.",
              label: "Token",
              name: "token",
              placeholder: "token",
            },
            {
              helper: "JSON array, ví dụ: [\"https://example.com/image.jpg\"]",
              label: "Image URLs",
              name: "imageUrls",
              placeholder: "[]",
              type: "json",
            },
          ],
          listTitle: "Danh sách phản ánh",
          resource: "feedbacks",
          title: "Quản lý phản ánh",
        }}
      />
    </AppShell>
  );
}
