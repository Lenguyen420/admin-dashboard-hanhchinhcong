import type { Metadata } from "next";

import {
  ResourceCrudPanel,
  type CrudAdminConfig,
} from "@/components/admin/CrudAdminPage";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Quản lý phản ánh",
  description: "Quản lý loại phản ánh và phản ánh, kiến nghị của người dân",
};

const feedbackTypeConfig: CrudAdminConfig = {
  activeHref: "/admin/feedbacks",
  columns: [
    { key: "id", label: "ID" },
    { key: "title", label: "Tên loại" },
    { key: "order", label: "Thứ tự" },
    { key: "createdAt", label: "Ngày tạo" },
  ],
  createTitle: "Thêm loại phản ánh",
  description:
    "Quản lý danh mục loại phản ánh để người dân lựa chọn khi gửi phản ánh, kiến nghị.",
  emptyText: "Chưa có loại phản ánh nào.",
  eyebrow: "Danh mục phản ánh",
  fields: [
    {
      label: "Tên loại phản ánh",
      name: "title",
      placeholder: "Ví dụ: Hạ tầng đô thị",
      required: true,
    },
    {
      label: "Thứ tự hiển thị",
      name: "order",
      placeholder: "1",
      required: true,
      type: "number",
    },
  ],
  listTitle: "Danh sách loại phản ánh",
  mockData: [
    {
      id: 1,
      title: "Hạ tầng đô thị",
      order: 1,
      createdAt: "2026-06-12T01:00:00.000Z",
    },
    {
      id: 2,
      title: "Vệ sinh môi trường",
      order: 2,
      createdAt: "2026-06-11T02:30:00.000Z",
    },
    {
      id: 3,
      title: "Thái độ phục vụ",
      order: 3,
      createdAt: "2026-06-10T03:45:00.000Z",
    },
  ],
  resource: "feedback-types",
  title: "Loại phản ánh",
};

const feedbackConfig: CrudAdminConfig = {
  activeHref: "/admin/feedbacks",
  columns: [
    { key: "id", label: "ID" },
    { key: "title", label: "Tiêu đề" },
    { key: "feedbackType.title", label: "Loại phản ánh" },
    { key: "receivingUnitName", label: "Đơn vị tiếp nhận" },
    { key: "senderFullName", label: "Người gửi" },
    { key: "senderPhone", label: "Số điện thoại" },
    { key: "status", label: "Trạng thái" },
    { key: "isAnonymous", label: "Ẩn danh" },
    { key: "isPublic", label: "Công khai" },
    { key: "creationTime", label: "Ngày gửi" },
  ],
  createTitle: "Tạo phản ánh",
  description:
    "Theo dõi phản ánh của người dân, cập nhật trạng thái và nội dung xử lý.",
  emptyText: "Chưa có phản ánh nào.",
  eyebrow: "Phản ánh, kiến nghị",
  fields: [],
  editFields: [
    {
      label: "Trạng thái xử lý",
      name: "status",
      options: [
        { label: "Đã tiếp nhận", value: "RECEIVED" },
        { label: "Đang xử lý", value: "PROCESSING" },
        { label: "Đã xử lý", value: "RESOLVED" },
        { label: "Từ chối", value: "REJECTED" },
      ],
      required: true,
      type: "select",
    },
    {
      label: "Nội dung phản hồi",
      name: "response",
      placeholder: "Nhập nội dung phản hồi cho người dân...",
      type: "textarea",
    },
    {
      label: "Đơn vị tiếp nhận",
      name: "receivingUnitName",
      placeholder: "Ví dụ: UBND phường...",
    },
    {
      label: "Công khai phản ánh",
      name: "isPublic",
      type: "checkbox",
    },
    {
      label: "Công khai kết quả xử lý",
      name: "isResultPublic",
      type: "checkbox",
    },
  ],
  listTitle: "Danh sách phản ánh",
  mockData: [
    {
      id: 1,
      title: "Đèn chiếu sáng trên đường Nguyễn Huệ bị hỏng",
      content:
        "Khu vực trước số nhà 24 đường Nguyễn Huệ mất đèn ba ngày, gây khó khăn cho người dân đi lại buổi tối.",
      feedbackType: { id: 1, title: "Hạ tầng đô thị" },
      receivingUnitName: "Phòng Quản lý đô thị",
      senderFullName: "Phạm Văn An",
      senderPhone: "0901234567",
      status: "PROCESSING",
      isAnonymous: false,
      isPublic: true,
      isResultPublic: false,
      creationTime: "2026-06-12T02:15:00.000Z",
    },
    {
      id: 2,
      title: "Rác thải tồn đọng tại khu vực chợ trung tâm",
      content:
        "Rác sinh hoạt tập kết quá giờ thu gom, phát sinh mùi hôi và ảnh hưởng đến hộ kinh doanh xung quanh.",
      feedbackType: { id: 2, title: "Vệ sinh môi trường" },
      receivingUnitName: "Công ty Môi trường đô thị",
      senderFullName: "Trần Thị Hoa",
      senderPhone: "0912345678",
      status: "RECEIVED",
      isAnonymous: false,
      isPublic: true,
      isResultPublic: false,
      creationTime: "2026-06-11T04:40:00.000Z",
    },
    {
      id: 3,
      title: "Đề nghị cải thiện thái độ hướng dẫn hồ sơ",
      content:
        "Khi đến nộp hồ sơ xác nhận tình trạng hôn nhân, công dân chưa được hướng dẫn rõ ràng về thành phần hồ sơ cần bổ sung.",
      feedbackType: { id: 3, title: "Thái độ phục vụ" },
      receivingUnitName: "Bộ phận Một cửa",
      senderFullName: "Nguyễn Minh Châu",
      senderPhone: "0987654321",
      status: "RESOLVED",
      response:
        "Đơn vị đã rà soát quy trình hướng dẫn và nhắc nhở cán bộ phụ trách.",
      isAnonymous: false,
      isPublic: true,
      isResultPublic: true,
      creationTime: "2026-06-10T08:05:00.000Z",
      responseTime: "2026-06-11T09:20:00.000Z",
    },
  ],
  resource: "feedbacks",
  showCreateForm: false,
  title: "Phản ánh",
};

export default function Page() {
  return (
    <AppShell activeHref="/admin/feedbacks">
      <main className="mx-auto max-w-[1288px] space-y-6 px-4 py-6">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-wide text-[#667085]">
            Phản ánh, kiến nghị
          </p>

          <h1 className="mt-1 text-xl font-semibold tracking-tight text-[#182433]">
            Quản lý phản ánh
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#526071]">
            Quản lý danh mục loại phản ánh, theo dõi nội dung do người dân gửi
            và cập nhật kết quả xử lý trên cùng một trang.
          </p>
        </div>

        <ResourceCrudPanel config={feedbackTypeConfig} showHeader />
        <ResourceCrudPanel config={feedbackConfig} showHeader />
      </main>
    </AppShell>
  );
}
