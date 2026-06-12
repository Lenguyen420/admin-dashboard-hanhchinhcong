import type { Metadata } from "next";

import CrudAdminPage from "@/components/admin/CrudAdminPage";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Admin Articles",
  description: "Quản lý bài viết",
};

export default function Page() {
  return (
    <AppShell activeHref="/admin/articles">
      <CrudAdminPage
        config={{
          activeHref: "/admin/articles",

          resource: "articles",

          title: "Quản lý bài viết",

          eyebrow: "Articles",

          description:
            "Quản lý bài viết, cẩm nang, hướng dẫn và tin tức hiển thị cho người dân.",

          createTitle: "Thêm bài viết",

          listTitle: "Danh sách bài viết",

          emptyText: "Chưa có bài viết nào.",

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
              label: "Tiêu đề bài viết",
              placeholder:
                "Ví dụ: Hướng dẫn đăng ký khai sinh trực tuyến",
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
              placeholder:
                "Nhập mô tả tóm tắt bài viết",
              type: "textarea",
            },

            {
              name: "link",
              label: "Đường dẫn bài viết",
              placeholder:
                "https://example.com/article",
            },

            {
              name: "thumb",
              label: "Ảnh đại diện",
              placeholder:
                "https://example.com/image.jpg",
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