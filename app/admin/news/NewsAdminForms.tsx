"use client";

import { FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";

import {
  createArticle,
  createArticleType,
  getArticleTypes,
  type ArticleType,
} from "@/services/news";

type ArticleFormState = {
  title: string;
  author: string;
  desc: string;
  link: string;
  thumb: string;
  typeId: string;
  publishedAt: string;
};

const initialArticleForm: ArticleFormState = {
  title: "",
  author: "",
  desc: "",
  link: "",
  thumb: "",
  typeId: "",
  publishedAt: "",
};

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

function FormField({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {children}

      {hint && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

export default function NewsAdminForms() {
  const [articleTypes, setArticleTypes] = useState<ArticleType[]>([]);

  const [typeTitle, setTypeTitle] = useState("");
  const [typeOrder, setTypeOrder] = useState("");

  const [articleForm, setArticleForm] =
    useState<ArticleFormState>(initialArticleForm);

  const [loadingTypes, setLoadingTypes] = useState(false);
  const [creatingType, setCreatingType] = useState(false);
  const [creatingArticle, setCreatingArticle] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const selectedTypeTitle = useMemo(() => {
    return articleTypes.find((type) => type.id === articleForm.typeId)?.title;
  }, [articleForm.typeId, articleTypes]);

  const loadArticleTypes = async () => {
    setLoadingTypes(true);

    try {
      const data = await getArticleTypes();
      setArticleTypes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi tải loại tin tức:", error);
      setErrorMessage("Không thể tải danh sách loại tin tức.");
    } finally {
      setLoadingTypes(false);
    }
  };

  useEffect(() => {
    loadArticleTypes();
  }, []);

  const handleCreateArticleType = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!typeTitle.trim()) {
      setErrorMessage("Vui lòng nhập tên loại tin tức.");
      return;
    }

    setCreatingType(true);
    setMessage("");
    setErrorMessage("");

    try {
      const created = await createArticleType({
        title: typeTitle.trim(),
        order: typeOrder ? Number(typeOrder) : undefined,
      });

      setArticleTypes((prev) =>
        [...prev, created].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
      );

      setTypeTitle("");
      setTypeOrder("");
      setMessage("Tạo loại tin tức thành công.");
    } catch (error) {
      console.error("Lỗi tạo loại tin tức:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Không thể tạo loại tin tức.",
      );
    } finally {
      setCreatingType(false);
    }
  };

  const handleCreateArticle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!articleForm.title.trim()) {
      setErrorMessage("Vui lòng nhập tiêu đề tin tức.");
      return;
    }

    if (!articleForm.publishedAt) {
      setErrorMessage("Vui lòng chọn ngày đăng.");
      return;
    }

    setCreatingArticle(true);
    setMessage("");
    setErrorMessage("");

    try {
      await createArticle({
        title: articleForm.title.trim(),
        author: articleForm.author.trim() || undefined,
        desc: articleForm.desc.trim() || undefined,
        link: articleForm.link.trim() || undefined,
        thumb: articleForm.thumb.trim() || undefined,
        typeId: articleForm.typeId || undefined,
        publishedAt: new Date(articleForm.publishedAt).toISOString(),
      });

      setArticleForm(initialArticleForm);
      setMessage("Tạo tin tức thành công.");
    } catch (error) {
      console.error("Lỗi tạo tin tức:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Không thể tạo tin tức.",
      );
    } finally {
      setCreatingArticle(false);
    }
  };

  const hasThumb = articleForm.thumb.trim().startsWith("http");

  return (
    <section className="w-full bg-slate-50 py-6">
      <div className="mx-auto w-full max-w-[1500px] space-y-6 px-4 sm:px-6 lg:px-8">
        {(message || errorMessage) && (
          <div
            className={[
              "rounded-3xl border px-5 py-4 text-sm font-semibold shadow-sm",
              message
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700",
            ].join(" ")}
          >
            {message || errorMessage}
          </div>
        )}

        <div className="overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-950 via-blue-800 to-sky-600 p-6 text-white shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-blue-100">
                News management
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-tight">
                Quản lý tin tức
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-50">
                Tạo loại tin tức, đăng bài viết và kiểm tra nhanh nội dung trước
                khi hiển thị lên mini app công dân số.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs font-semibold text-blue-100">Loại tin</p>
                <p className="mt-1 text-2xl font-black">
                  {articleTypes.length}
                </p>
              </div>

              <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-xs font-semibold text-blue-100">
                  Trạng thái
                </p>
                <p className="mt-1 text-lg font-black">
                  {loadingTypes ? "Đang tải" : "Sẵn sàng"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="space-y-5">
            <form
              onSubmit={handleCreateArticleType}
              className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-5">
                <div className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-blue-700">
                  Category
                </div>

                <h2 className="mt-3 text-xl font-black text-slate-900">
                  Thêm loại tin tức
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Ví dụ: Thông báo, Chuyển đổi số, Văn hóa - Xã hội.
                </p>
              </div>

              <div className="space-y-4">
                <FormField label="Tên loại tin tức" required>
                  <input
                    value={typeTitle}
                    onChange={(event) => setTypeTitle(event.target.value)}
                    className={inputClass}
                    placeholder="Ví dụ: Chuyển đổi số"
                  />
                </FormField>

                <FormField label="Thứ tự">
                  <input
                    type="number"
                    value={typeOrder}
                    onChange={(event) => setTypeOrder(event.target.value)}
                    className={inputClass}
                    placeholder="Ví dụ: 1"
                  />
                </FormField>

                <button
                  type="submit"
                  disabled={creatingType}
                  className="w-full rounded-2xl bg-blue-700 px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creatingType ? "Đang tạo..." : "Tạo loại tin tức"}
                </button>
              </div>
            </form>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Danh sách loại tin
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sắp xếp theo thứ tự hiển thị
                  </p>
                </div>

                <button
                  type="button"
                  onClick={loadArticleTypes}
                  disabled={loadingTypes}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-blue-700 transition hover:bg-blue-50 disabled:opacity-60"
                >
                  Tải lại
                </button>
              </div>

              {loadingTypes ? (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                  Đang tải loại tin tức...
                </div>
              ) : articleTypes.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                  Chưa có loại tin tức nào.
                </div>
              ) : (
                <div className="max-h-[430px] space-y-2 overflow-y-auto pr-1">
                  {articleTypes.map((type) => (
                    <div
                      key={type.id}
                      className="group rounded-2xl border border-slate-100 bg-slate-50 p-3 transition hover:border-blue-100 hover:bg-blue-50/50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-slate-800">
                            {type.title}
                          </p>

                          <p className="mt-1 truncate text-xs text-slate-400">
                            ID: {type.id}
                          </p>
                        </div>

                        <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-black text-blue-700 shadow-sm">
                          #{type.order ?? 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>

          <form
            onSubmit={handleCreateArticle}
            className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm lg:p-6"
          >
            <div className="mb-6 flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-sky-700">
                  Article
                </div>

                <h2 className="mt-3 text-2xl font-black text-slate-900">
                  Thêm tin tức mới
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Nhập nội dung bài viết hiển thị trên mini app công dân số.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                  {selectedTypeTitle || "Chưa chọn loại"}
                </span>

                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  Bản nháp
                </span>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <FormField label="Tiêu đề" required>
                    <input
                      value={articleForm.title}
                      onChange={(event) =>
                        setArticleForm((prev) => ({
                          ...prev,
                          title: event.target.value,
                        }))
                      }
                      className={inputClass}
                      placeholder="Ví dụ: Hướng dẫn đăng ký khai sinh trực tuyến"
                    />
                  </FormField>
                </div>

                <FormField label="Loại tin tức">
                  <select
                    value={articleForm.typeId}
                    onChange={(event) =>
                      setArticleForm((prev) => ({
                        ...prev,
                        typeId: event.target.value,
                      }))
                    }
                    disabled={loadingTypes}
                    className={inputClass}
                  >
                    <option value="">
                      {loadingTypes ? "Đang tải..." : "Chọn loại tin tức"}
                    </option>

                    {articleTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.title}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Tác giả">
                  <input
                    value={articleForm.author}
                    onChange={(event) =>
                      setArticleForm((prev) => ({
                        ...prev,
                        author: event.target.value,
                      }))
                    }
                    className={inputClass}
                    placeholder="Nhập tên tác giả"
                  />
                </FormField>

                <div className="md:col-span-2">
                  <FormField label="Mô tả ngắn">
                    <textarea
                      value={articleForm.desc}
                      onChange={(event) =>
                        setArticleForm((prev) => ({
                          ...prev,
                          desc: event.target.value,
                        }))
                      }
                      rows={4}
                      className={`${inputClass} resize-none`}
                      placeholder="Nhập mô tả tóm tắt bài viết"
                    />
                  </FormField>
                </div>

                <div className="md:col-span-2">
                  <FormField label="Đường dẫn tin tức">
                    <input
                      value={articleForm.link}
                      onChange={(event) =>
                        setArticleForm((prev) => ({
                          ...prev,
                          link: event.target.value,
                        }))
                      }
                      className={inputClass}
                      placeholder="https://example.com/article"
                    />
                  </FormField>
                </div>

                <FormField label="Ảnh đại diện">
                  <input
                    value={articleForm.thumb}
                    onChange={(event) =>
                      setArticleForm((prev) => ({
                        ...prev,
                        thumb: event.target.value,
                      }))
                    }
                    className={inputClass}
                    placeholder="https://example.com/image.jpg"
                  />
                </FormField>

                <FormField label="Ngày đăng" required>
                  <input
                    type="datetime-local"
                    value={articleForm.publishedAt}
                    onChange={(event) =>
                      setArticleForm((prev) => ({
                        ...prev,
                        publishedAt: event.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </FormField>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
                <p className="mb-3 text-sm font-black text-slate-800">
                  Xem trước bài viết
                </p>

                <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
                  <div
                    className="flex h-44 items-center justify-center bg-gradient-to-br from-blue-100 to-sky-50"
                    style={
                      hasThumb
                        ? {
                            backgroundImage: `url(${articleForm.thumb})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }
                        : undefined
                    }
                  >
                    {!hasThumb && (
                      <span className="text-sm font-bold text-blue-500">
                        Ảnh đại diện
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                        {selectedTypeTitle || "Tin tức"}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                        {articleForm.publishedAt
                          ? new Date(
                              articleForm.publishedAt,
                            ).toLocaleDateString("vi-VN")
                          : "Chưa chọn ngày"}
                      </span>
                    </div>

                    <h3 className="line-clamp-2 text-base font-black leading-6 text-slate-900">
                      {articleForm.title ||
                        "Tiêu đề tin tức sẽ hiển thị tại đây"}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                      {articleForm.desc ||
                        "Mô tả ngắn giúp người dân nắm nhanh nội dung chính của bài viết."}
                    </p>

                    <div className="mt-4 border-t border-slate-100 pt-3 text-xs font-semibold text-slate-400">
                      {articleForm.author || "Chưa nhập tác giả"}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={creatingArticle}
                  className="mt-4 w-full rounded-2xl bg-blue-700 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creatingArticle ? "Đang tạo..." : "Tạo tin tức"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
