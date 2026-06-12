"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  AlertCircle,
  Archive,
  BookOpenText,
  Bot,
  CheckCircle2,
  ChevronRight,
  Database,
  FileText,
  FolderOpen,
  Globe2,
  Info,
  Layers3,
  Loader2,
  Plus,
  Search,
  Send,
  Sparkles,
  Tags,
} from "lucide-react";

import {
  archiveKnowledge,
  createKnowledge,
  getKnowledgeItems,
  publishKnowledge,
} from "@/services/knowledge.service";
import type {
  CreateKnowledgePayload,
  KnowledgeItem,
  KnowledgeStatus,
} from "@/services/knowledge.service";

type StatusFilter = "ALL" | KnowledgeStatus;

type Notice = {
  kind: "success" | "error" | "info";
  message: string;
};

const categories = [
  "Dịch vụ công",
  "Hộ tịch",
  "Đất đai",
  "Thuế phí",
  "Văn bản mẫu",
  "Hỏi đáp",
];

const statusOptions: Array<{ value: StatusFilter; label: string }> = [
  { value: "ALL", label: "Tất cả" },
  { value: "PUBLISHED", label: "Đã xuất bản" },
  { value: "DRAFT", label: "Bản nháp" },
  { value: "ARCHIVED", label: "Lưu trữ" },
];

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function StatusBadge({ status }: { status: KnowledgeStatus }) {
  const config = {
    DRAFT: {
      label: "Bản nháp",
      className: "border-amber-200 bg-amber-50 text-amber-700",
    },
    PUBLISHED: {
      label: "Đã xuất bản",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    ARCHIVED: {
      label: "Lưu trữ",
      className: "border-slate-200 bg-slate-100 text-slate-600",
    },
  }[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${config.className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}

function StatisticCard({
  title,
  value,
  description,
  icon,
  iconClassName,
}: {
  title: string;
  value: number;
  description: string;
  icon: ReactNode;
  iconClassName: string;
}) {
  return (
    <article className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconClassName}`}
        >
          {icon}
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">{description}</p>
    </article>
  );
}

export default function KnowledgeAdminPage() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [notice, setNotice] = useState<Notice>({
    kind: "info",
    message: "Đang tải dữ liệu từ kho tri thức AI...",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadKnowledge() {
      try {
        const data = await getKnowledgeItems();

        if (isMounted) {
          setItems(data);
          setNotice({
            kind: "success",
            message: "Đã tải danh sách tri thức từ backend.",
          });
        }
      } catch (error) {
        if (isMounted) {
          setNotice({
            kind: "error",
            message:
              error instanceof Error
                ? error.message
                : "Không tải được dữ liệu từ backend.",
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadKnowledge();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchesKeyword = !keyword
        ? true
        : [
            item.title,
            item.category,
            item.sourceLabel,
            item.sourceUrl ?? "",
            item.content,
            ...item.keywords,
          ]
            .join(" ")
            .toLowerCase()
            .includes(keyword);

      const matchesStatus =
        statusFilter === "ALL" || item.status === statusFilter;

      return matchesKeyword && matchesStatus;
    });
  }, [items, query, statusFilter]);

  const publishedCount = items.filter(
    (item) => item.status === "PUBLISHED",
  ).length;
  const draftCount = items.filter((item) => item.status === "DRAFT").length;
  const archivedCount = items.filter(
    (item) => item.status === "ARCHIVED",
  ).length;

  async function submitKnowledge(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload: CreateKnowledgePayload = {
      title: String(formData.get("title") ?? "").trim(),
      category: String(formData.get("category") ?? "").trim(),
      sourceLabel: String(formData.get("sourceLabel") ?? "").trim(),
      sourceUrl: String(formData.get("sourceUrl") ?? "").trim() || null,
      content: String(formData.get("content") ?? "").trim(),
      keywords: String(formData.get("keywords") ?? "")
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean),
    };

    try {
      const created = await createKnowledge(payload);

      setItems((current) => [created, ...current]);
      form.reset();

      setNotice({
        kind: "success",
        message: "Đã lưu tri thức mới dưới dạng bản nháp.",
      });
    } catch (error) {
      setNotice({
        kind: "error",
        message:
          error instanceof Error ? error.message : "Không lưu được dữ liệu.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function changeStatus(
    id: string,
    status: Extract<KnowledgeStatus, "PUBLISHED" | "ARCHIVED">,
  ) {
    const previousItems = items;

    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    );

    try {
      const updated =
        status === "PUBLISHED"
          ? await publishKnowledge(id)
          : await archiveKnowledge(id);

      setItems((current) =>
        current.map((item) => (item.id === id ? updated : item)),
      );

      setNotice({
        kind: "success",
        message:
          status === "PUBLISHED"
            ? "Đã xuất bản tri thức cho AI sử dụng."
            : "Đã lưu trữ tri thức.",
      });
    } catch (error) {
      setItems(previousItems);
      setNotice({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "Không cập nhật được trạng thái.",
      });
    }
  }

  const noticeStyles = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    error: "border-red-200 bg-red-50 text-red-700",
    info: "border-blue-200 bg-blue-50 text-blue-700",
  }[notice.kind];

  const noticeIcon = {
    success: <CheckCircle2 className="h-4 w-4 shrink-0" />,
    error: <AlertCircle className="h-4 w-4 shrink-0" />,
    info: <Info className="h-4 w-4 shrink-0" />,
  }[notice.kind];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#082f72] via-[#0753a7] to-[#0ea5e9] text-white">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-[1440px] px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-blue-50 backdrop-blur">
                <Bot className="h-4 w-4" />
                Trung tâm dữ liệu AI
              </div>
              <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
                Quản lý kho tri thức hành chính công
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                Kiểm duyệt nội dung, quản lý nguồn dữ liệu và xuất bản thông tin
                chính xác để trợ lý AI trả lời người dân hiệu quả hơn.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-5 max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatisticCard
            description="Tổng số nội dung trong toàn bộ kho dữ liệu."
            icon={<Layers3 className="h-5 w-5" />}
            iconClassName="bg-blue-50 text-blue-600"
            title="Tổng tri thức"
            value={items.length}
          />
          <StatisticCard
            description="Nội dung đang được AI sử dụng để trả lời."
            icon={<CheckCircle2 className="h-5 w-5" />}
            iconClassName="bg-emerald-50 text-emerald-600"
            title="Đã xuất bản"
            value={publishedCount}
          />
          <StatisticCard
            description="Nội dung cần rà soát trước khi đưa vào hệ thống."
            icon={<FileText className="h-5 w-5" />}
            iconClassName="bg-amber-50 text-amber-600"
            title="Bản nháp"
            value={draftCount}
          />
          <StatisticCard
            description="Nội dung cũ đã ngừng sử dụng nhưng vẫn được lưu lại."
            icon={<Archive className="h-5 w-5" />}
            iconClassName="bg-slate-100 text-slate-600"
            title="Lưu trữ"
            value={archivedCount}
          />
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-5 px-4 py-6 sm:px-6 lg:px-8 xl:grid-cols-[390px_minmax(0,1fr)]">
        <form
          className="h-fit rounded-2xl border border-slate-200 bg-white shadow-sm xl:sticky xl:top-5"
          id="create-knowledge"
          onSubmit={submitKnowledge}
        >
          <div className="border-b border-slate-100 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
              Biểu mẫu nhập liệu
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              Thêm tri thức mới
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Nội dung mới được lưu dưới dạng bản nháp để kiểm duyệt.
            </p>
          </div>

          <div className="space-y-4 p-5">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                Tiêu đề tri thức
              </span>
              <input
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                name="title"
                placeholder="VD: Thủ tục cấp giấy khai sinh"
                required
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                Nhóm dữ liệu
              </span>
              <select
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                name="category"
                required
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                Tên nguồn tham chiếu
              </span>
              <input
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                name="sourceLabel"
                placeholder="VD: Phòng Tư pháp"
                required
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                URL nguồn tham chiếu
              </span>
              <input
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                name="sourceUrl"
                placeholder="https://..."
                type="url"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Tags className="h-4 w-4 text-slate-400" />
                Từ khóa tìm kiếm
              </span>
              <input
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                name="keywords"
                placeholder="hộ-tịch, khai-sinh, hồ-sơ"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <BookOpenText className="h-4 w-4 text-slate-400" />
                Nội dung cung cấp cho AI
              </span>
              <textarea
                className="min-h-[200px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-3 text-sm leading-6 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                name="content"
                placeholder="Nhập câu hỏi, câu trả lời, quy trình, điều kiện hoặc thành phần hồ sơ..."
                required
              />
            </label>
          </div>

          <div className="border-t border-slate-100 p-5">
            <button
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Lưu vào kho AI
            </button>
          </div>
        </form>

        <div className="min-w-0 space-y-4">
          <div
            className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${noticeStyles}`}
          >
            {noticeIcon}
            <span>{notice.message}</span>
          </div>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
                    Danh sách dữ liệu
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    Kho tri thức
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Có {filteredItems.length} nội dung phù hợp với bộ lọc hiện
                    tại.
                  </p>
                </div>

                <label className="relative block w-full lg:w-[340px]">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Tìm tiêu đề, từ khóa, nguồn..."
                    value={query}
                  />
                </label>
              </div>

              <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
                {statusOptions.map((option) => {
                  const active = statusFilter === option.value;

                  return (
                    <button
                      className={`whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-semibold transition ${
                        active
                          ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      }`}
                      key={option.value}
                      onClick={() => setStatusFilter(option.value)}
                      type="button"
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    <th className="px-5 py-3.5">Nội dung tri thức</th>
                    <th className="px-5 py-3.5">Phân loại và nguồn</th>
                    <th className="px-5 py-3.5">Trạng thái</th>
                    <th className="px-5 py-3.5">Cập nhật</th>
                    <th className="px-5 py-3.5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr
                      className="group border-b border-slate-100 align-top transition last:border-0 hover:bg-blue-50/30"
                      key={item.id}
                    >
                      <td className="px-5 py-4">
                        <div className="flex gap-3">
                          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Database className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold leading-6 text-slate-800">
                              {item.title}
                            </p>
                            <p className="mt-1 line-clamp-2 max-w-[480px] text-sm leading-6 text-slate-500">
                              {item.content}
                            </p>
                            {item.keywords.length > 0 ? (
                              <div className="mt-2.5 flex flex-wrap gap-1.5">
                                {item.keywords.map((keyword) => (
                                  <span
                                    className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                                    key={keyword}
                                  >
                                    #{keyword}
                                  </span>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                          <FolderOpen className="h-3.5 w-3.5 text-blue-500" />
                          {item.category}
                        </p>
                        <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                          <Globe2 className="h-3.5 w-3.5" />
                          {item.sourceLabel}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatDate(item.updatedAt)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                          <button
                            aria-label={
                              item.status === "PUBLISHED"
                                ? "Tri thức đã được xuất bản"
                                : "Xuất bản tri thức"
                            }
                            className="
        group inline-flex h-9 items-center justify-center gap-1.5
        rounded-xl bg-emerald-600 px-3.5
        text-xs font-semibold text-white
        shadow-sm shadow-emerald-200
        transition-all duration-200
        hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md
        active:translate-y-0
        disabled:cursor-not-allowed disabled:bg-slate-100
        disabled:text-slate-400 disabled:shadow-none
      "
                            disabled={item.status === "PUBLISHED" || isLoading}
                            onClick={() => changeStatus(item.id, "PUBLISHED")}
                            title={
                              item.status === "PUBLISHED"
                                ? "Tri thức đã được xuất bản cho AI sử dụng"
                                : "Xuất bản tri thức cho AI sử dụng"
                            }
                            type="button"
                          >
                            <CheckCircle2 className="h-4 w-4 transition-transform group-hover:scale-110" />

                            {item.status === "PUBLISHED"
                              ? "Đã xuất bản"
                              : "Xuất bản"}
                          </button>

                          <button
                            aria-label={
                              item.status === "ARCHIVED"
                                ? "Tri thức đã được lưu trữ"
                                : "Lưu trữ tri thức"
                            }
                            className="
        group inline-flex h-9 w-9 items-center justify-center
        rounded-xl border border-slate-200
        bg-white text-slate-500 shadow-sm
        transition-all duration-200
        hover:-translate-y-0.5 hover:border-amber-200
        hover:bg-amber-50 hover:text-amber-600 hover:shadow-md
        active:translate-y-0
        disabled:cursor-not-allowed disabled:bg-slate-100
        disabled:text-slate-300 disabled:shadow-none
      "
                            disabled={item.status === "ARCHIVED" || isLoading}
                            onClick={() => changeStatus(item.id, "ARCHIVED")}
                            title={
                              item.status === "ARCHIVED"
                                ? "Tri thức đã được lưu trữ"
                                : "Lưu trữ tri thức và ngừng cung cấp cho AI"
                            }
                            type="button"
                          >
                            <Archive className="h-4 w-4 transition-transform group-hover:scale-110" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredItems.length === 0 ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center px-5 py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Sparkles className="h-7 w-7" />
                </div>
                <p className="mt-4 font-bold text-slate-800">
                  Không tìm thấy tri thức phù hợp
                </p>
                <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                  Hãy thay đổi từ khóa, chọn bộ lọc khác hoặc tạo nội dung tri
                  thức mới.
                </p>
              </div>
            ) : null}

            <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Hiển thị{" "}
                <strong className="text-slate-700">
                  {filteredItems.length}
                </strong>{" "}
                / {items.length} nội dung
              </span>
              <span className="inline-flex items-center gap-1 font-medium text-blue-600">
                Dữ liệu được đồng bộ với kho AI
                <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
