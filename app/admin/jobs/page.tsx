import type { Metadata } from "next";

import CrudAdminPage from "@/components/feedbacks/Feedback";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Admin Jobs",
  description: "Quản lý tuyển dụng",
};

export default function Page() {
  return (
    <AppShell activeHref="/admin/jobs">
      <CrudAdminPage
        config={{
          activeHref: "/admin/jobs",

          resource: "jobs",

          title: "Quản lý tuyển dụng",

          eyebrow: "Jobs",

          description:
            "Quản lý tin tuyển dụng, khu vực tuyển dụng và hồ sơ ứng tuyển.",

          createTitle: "Thêm tin tuyển dụng",

          listTitle: "Danh sách tuyển dụng",

          emptyText: "Chưa có tin tuyển dụng nào.",

          columns: [
            {
              key: "id",
              label: "ID",
            },
            {
              key: "title",
              label: "Vị trí",
            },
            {
              key: "zone.name",
              label: "Khu vực",
            },
            {
              key: "salary",
              label: "Mức lương",
            },
            {
              key: "workType",
              label: "Hình thức",
            },
            {
              key: "views",
              label: "Lượt xem",
            },
            {
              key: "deadline",
              label: "Hạn nộp",
            },
          ],

          fields: [
            {
              name: "title",
              label: "Tên vị trí",
              placeholder: "Nhập tên vị trí tuyển dụng",
              required: true,
            },

            {
              name: "zoneId",
              label: "Khu vực",
              placeholder: "Nhập zoneId",
            },

            {
              name: "salary",
              label: "Mức lương",
              placeholder: "Ví dụ: 10 - 15 triệu",
            },

            {
              name: "workType",
              label: "Hình thức làm việc",
              placeholder: "Toàn thời gian / Bán thời gian",
            },

            {
              name: "deadline",
              label: "Hạn nộp hồ sơ",
              type: "datetime-local",
            },

            {
              name: "jobDescription",
              label: "Mô tả công việc",
              type: "textarea",
              placeholder: "Nhập mô tả công việc",
            },
          ],

          editFields: [
            {
              name: "title",
              label: "Tên vị trí",
              required: true,
            },

            {
              name: "salary",
              label: "Mức lương",
            },

            {
              name: "workType",
              label: "Hình thức làm việc",
            },

            {
              name: "deadline",
              label: "Hạn nộp hồ sơ",
              type: "datetime-local",
            },

            {
              name: "jobDescription",
              label: "Mô tả công việc",
              type: "textarea",
            },
          ],
        }}
      />
    </AppShell>
  );
}