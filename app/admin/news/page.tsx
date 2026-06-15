import type { Metadata } from "next";

import CrudAdminPage from "@/components/feedbacks/Feedback";
import AppShell from "@/components/layout/AppShell";
import NewsAdminForms from "./NewsAdminForms";

export const metadata: Metadata = {
  title: "Admin News",
  description: "Quản lý tin tức",
};

export default function Page() {
  return (
    <AppShell activeHref="/admin/news">
      <NewsAdminForms />

      <CrudAdminPage
        config={{
          activeHref: "/admin/news",

          resource: "articles",

          title: "Quản lý tin tức",
          eyebrow: "News",
          description:
            "Quản lý tin tức, cẩm nang, hướng dẫn và thông báo hiển thị cho người dân.",

          createTitle: "Thêm tin tức",
          listTitle: "Danh sách tin tức",
          emptyText: "Chưa có tin tức nào.",

          columns: [
            {
              key: "id",
              label: "ID",
            },
            {
              key: "title",
              label: "Tiêu đề",
            },
            {
              key: "author",
              label: "Tác giả",
            },
            {
              key: "views",
              label: "Lượt xem",
            },
            {
              key: "likes",
              label: "Lượt thích",
            },
            {
              key: "publishedAt",
              label: "Ngày đăng",
            },
          ],

          fields: [
            {
              name: "title",
              label: "Tiêu đề tin tức",
              placeholder: "Ví dụ: Hướng dẫn đăng ký khai sinh trực tuyến",
              required: true,
            },
            {
              name: "author",
              label: "Tác giả",
              placeholder: "Nhập tên tác giả",
            },
            {
              name: "desc",
              label: "Mô tả ngắn",
              placeholder: "Nhập mô tả tóm tắt bài viết",
              type: "textarea",
            },
            {
              name: "link",
              label: "Đường dẫn tin tức",
              placeholder: "https://example.com/article",
            },
            {
              name: "thumb",
              label: "Ảnh đại diện",
              placeholder: "https://example.com/image.jpg",
            },
            {
              name: "publishedAt",
              label: "Ngày đăng",
              type: "datetime-local",
              required: true,
            },
          ],
        }}
      />
    </AppShell>
  );
}
