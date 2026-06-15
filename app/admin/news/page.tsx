import type { Metadata } from "next";

import CrudAdminPage from "@/components/admin/feedback";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Admin News",
  description: "Quản lý tin tức",
};

export default function Page() {
  return (
    <AppShell activeHref="/admin/news">
      <CrudAdminPage
        config={{
          activeHref: "/admin/news",

          resource: "news",

          title: "Quản lý tin tức",

          eyebrow: "News",

          description:
            "Quản lý tin tức, cẩm nang, hướng dẫn và thông báo hiển thị cho người dân.",

          createTitle: "Thêm tin tức",

          listTitle: "Danh sách tin tức",

          emptyText: "Chưa có tin tức nào.",

          mockData: [
            {
              id: 1,
              title: "Triển khai dịch vụ công trực tuyến mức độ toàn trình",
              author: "Ban biên tập",
              desc: "Cập nhật danh sách thủ tục hành chính được tiếp nhận và giải quyết trực tuyến.",
              link: "/tin-tuc/dich-vu-cong-truc-tuyen-toan-trinh",
              thumb: "/logo.png",
              views: 1280,
              likes: 86,
              publishedAt: "2026-06-12T08:00:00.000Z",
              createdAt: "2026-06-12T07:20:00.000Z",
            },
            {
              id: 2,
              title: "Hướng dẫn nộp hồ sơ đăng ký kinh doanh qua mạng",
              author: "Phòng Kinh tế",
              desc: "Người dân và doanh nghiệp có thể chuẩn bị hồ sơ, thanh toán lệ phí và theo dõi kết quả trực tuyến.",
              link: "/tin-tuc/huong-dan-dang-ky-kinh-doanh",
              thumb: "/logo.png",
              views: 934,
              likes: 64,
              publishedAt: "2026-06-11T09:30:00.000Z",
              createdAt: "2026-06-11T08:45:00.000Z",
            },
            {
              id: 3,
              title: "Lịch tiếp công dân định kỳ tháng 6/2026",
              author: "Văn phòng UBND",
              desc: "Công bố lịch tiếp công dân, địa điểm và đường dây hỗ trợ tiếp nhận phản ánh.",
              link: "/tin-tuc/lich-tiep-cong-dan-thang-6-2026",
              thumb: "/logo.png",
              views: 711,
              likes: 42,
              publishedAt: "2026-06-10T02:00:00.000Z",
              createdAt: "2026-06-09T10:15:00.000Z",
            },
          ],

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
