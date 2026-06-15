import type { Metadata } from "next";

import CrudAdminPage from "@/components/feedbacks/Feedback";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Admin Documents",
  description: "Quản lý văn bản pháp luật",
};

export default function Page() {
  return (
    <AppShell activeHref="/admin/document">
      <CrudAdminPage
        config={{
          activeHref: "/admin/document",
          title: "Quản lý văn bản pháp luật",
          eyebrow: "Documents",
          description:
            "Quản lý văn bản pháp luật, quyết định, thông báo và hướng dẫn hành chính.",

          // Endpoint quản lý văn bản pháp luật.
          resource: "documents",

          createTitle: "Thêm văn bản",
          listTitle: "Danh sách văn bản pháp luật",
          emptyText: "Chưa có văn bản pháp luật nào.",

          mockData: [
            {
              id: 1,
              name: "Quyết định công bố danh mục thủ tục hành chính",
              description:
                "Văn bản công bố danh mục thủ tục hành chính thuộc thẩm quyền giải quyết của địa phương.",
              order: 1,
              createdAt: "2026-06-12T02:00:00.000Z",
            },
            {
              id: 2,
              name: "Kế hoạch chuyển đổi số trong cải cách hành chính",
              description:
                "Định hướng triển khai hồ sơ điện tử, kết quả số hóa và các kênh hỗ trợ người dân.",
              order: 2,
              createdAt: "2026-06-11T07:30:00.000Z",
            },
            {
              id: 3,
              name: "Hướng dẫn tiếp nhận và xử lý phản ánh, kiến nghị",
              description:
                "Quy trình phân loại, chuyển đơn vị phụ trách và phản hồi kết quả xử lý cho công dân.",
              order: 3,
              createdAt: "2026-06-10T09:45:00.000Z",
            },
            {
              id: 4,
              name: "Thông báo áp dụng biểu mẫu hồ sơ điện tử",
              description:
                "Danh mục biểu mẫu được chấp nhận khi nộp hồ sơ trực tuyến trên cổng dịch vụ công.",
              order: 4,
              createdAt: "2026-06-09T04:20:00.000Z",
            },
            {
              id: 5,
              name: "Quy chế phối hợp giải quyết thủ tục liên thông",
              description:
                "Văn bản quy định trách nhiệm phối hợp giữa các phòng ban khi xử lý hồ sơ liên thông.",
              order: 5,
              createdAt: "2026-06-08T06:10:00.000Z",
            },
          ],

          columns: [
            { key: "id", label: "ID" },
            { key: "name", label: "Tên văn bản" },
            { key: "description", label: "Mô tả" },
            { key: "order", label: "Thứ tự" },
            { key: "createdAt", label: "Ngày tạo" },
          ],

          fields: [
            {
              name: "name",
              label: "Tên văn bản",
              placeholder: "VD: Quyết định công bố thủ tục hành chính",
              required: true,
            },
            {
              name: "description",
              label: "Mô tả",
              placeholder: "Nhập mô tả cho văn bản",
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
