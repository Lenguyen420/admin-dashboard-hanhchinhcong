import type { Metadata } from "next";

import {
  ResourceCrudPanel,
  type CrudAdminConfig,
} from "@/components/feedbacks/Feedback";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Quản lý phản ánh",
  description: "Quản lý loại phản ánh và phản ánh, kiến nghị của người dân",
};

const feedbackTypeConfig: CrudAdminConfig = {
  activeHref: "/admin/feedbacks",

  title: "Loại phản ánh",

  eyebrow: "Danh mục phản ánh",

  description:
    "Quản lý danh mục loại phản ánh để người dân lựa chọn khi gửi phản ánh, kiến nghị.",

  resource: "feedback-types",

  createTitle: "Thêm loại phản ánh",

  listTitle: "Danh sách loại phản ánh",

  emptyText: "Chưa có loại phản ánh nào.",

  columns: [
    { key: "id", label: "ID" },
    { key: "title", label: "Tên loại" },
    { key: "order", label: "Thứ tự" },
    { key: "createdAt", label: "Ngày tạo" },
  ],

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

  editFields: [
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
};

const feedbackConfig: CrudAdminConfig = {
  activeHref: "/admin/feedbacks",

  title: "Phản ánh",

  eyebrow: "Phản ánh, kiến nghị",

  description:
    "Theo dõi phản ánh của người dân, cập nhật trạng thái và nội dung xử lý.",

  resource: "feedbacks",

  createTitle: "Tạo phản ánh",

  listTitle: "Danh sách phản ánh",

  emptyText: "Chưa có phản ánh nào.",

  showCreateForm: false,

  columns: [
    { key: "id", label: "ID" },
    { key: "title", label: "Tiêu đề" },
    { key: "type", label: "Loại phản ánh" },
    { key: "receivingUnitName", label: "Đơn vị tiếp nhận" },
    { key: "senderFullName", label: "Người gửi" },
    { key: "senderPhone", label: "Số điện thoại" },
    { key: "status", label: "Trạng thái" },
    { key: "isAnonymous", label: "Ẩn danh" },
    { key: "isPublic", label: "Công khai" },
    { key: "creationTime", label: "Ngày gửi" },
  ],

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
