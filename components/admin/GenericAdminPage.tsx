"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  Download,
  Eye,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import {
  createAdminResource,
  deleteAdminResource,
  downloadBlob,
  getAdminResource,
  listAdminResource,
  updateAdminResource,
  uploadAttachment,
  type AdminRecord,
} from "@/services/admin-api";

export type GenericField = {
  name: string;
  label: string;
  type?:
    | "text"
    | "number"
    | "textarea"
    | "select"
    | "datetime-local"
    | "date"
    | "time"
    | "checkbox"
    | "json";
  placeholder?: string;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
};

export type GenericAction = {
  label: string;
  path: string;
  kind: "download" | "open";
};

export type GenericAdminConfig = {
  title: string;
  eyebrow: string;
  description: string;
  resource: string;
  columns: Array<{ key: string; label: string }>;
  fields?: GenericField[];
  createTitle?: string;
  listTitle?: string;
  emptyText?: string;
  updateMethod?: "PATCH" | "PUT";
  allowCreate?: boolean;
  allowEdit?: boolean;
  allowDelete?: boolean;
  allowUpload?: boolean;
  actions?: GenericAction[];
};

type Notice = {
  kind: "success" | "error" | "info";
  message: string;
};

function getRecordId(record: AdminRecord) {
  const id = record.id ?? record._id ?? record.uuid;

  if (typeof id === "string" || typeof id === "number") {
    return id;
  }

  return undefined;
}

function readValue(record: AdminRecord, key: string): unknown {
  return key.split(".").reduce<unknown>((current, part) => {
    if (typeof current !== "object" || current === null) {
      return undefined;
    }

    return (current as AdminRecord)[part];
  }, record);
}

function formatValue(value: unknown): string {
  if (value === undefined || value === null || value === "") {
    return "-";
  }

  if (typeof value === "boolean") {
    return value ? "Có" : "Không";
  }

  if (typeof value === "string") {
    const date = new Date(value);

    if (
      /\d{4}-\d{2}-\d{2}T/.test(value) &&
      !Number.isNaN(date.getTime())
    ) {
      return date.toLocaleString("vi-VN");
    }

    return value;
  }

  if (typeof value === "number") {
    return new Intl.NumberFormat("vi-VN").format(value);
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Có lỗi xảy ra.";
}

function toDateTimeLocal(value: unknown) {
  if (!value) {
    return "";
  }

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

function buildPayload(fields: GenericField[], formData: FormData) {
  const payload: AdminRecord = {};

  fields.forEach((field) => {
    const rawValue = formData.get(field.name);
    const value = typeof rawValue === "string" ? rawValue.trim() : "";

    if (field.type === "checkbox") {
      payload[field.name] = rawValue === "on";
      return;
    }

    if (!value) {
      return;
    }

    if (field.type === "number") {
      const numberValue = Number(value);

      if (!Number.isNaN(numberValue)) {
        payload[field.name] = numberValue;
      }

      return;
    }

    if (field.type === "datetime-local") {
      payload[field.name] = new Date(value).toISOString();
      return;
    }

    if (field.type === "date" || field.type === "time") {
      payload[field.name] = value;
      return;
    }

    if (field.type === "json") {
      payload[field.name] = JSON.parse(value) as unknown;
      return;
    }

    payload[field.name] = value;
  });

  return payload;
}

function FieldControl({
  defaultValue,
  field,
}: {
  defaultValue?: unknown;
  field: GenericField;
}) {
  const className =
    "mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100";
  const value =
    field.type === "datetime-local"
      ? toDateTimeLocal(defaultValue)
      : field.type === "json" && defaultValue
        ? JSON.stringify(defaultValue, null, 2)
        : typeof defaultValue === "string" || typeof defaultValue === "number"
          ? String(defaultValue)
          : "";

  if (field.type === "checkbox") {
    return (
      <label className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm text-slate-800">
        <input
          className="h-4 w-4 rounded border-slate-300 text-blue-700"
          defaultChecked={Boolean(defaultValue)}
          name={field.name}
          type="checkbox"
        />
        <span>{field.placeholder ?? "Bật tùy chọn này"}</span>
      </label>
    );
  }

  if (field.type === "textarea" || field.type === "json") {
    return (
      <textarea
        className={className}
        defaultValue={value}
        name={field.name}
        placeholder={field.placeholder}
        required={field.required}
        rows={field.type === "json" ? 5 : 3}
      />
    );
  }

  if (field.type === "select") {
    return (
      <select
        className={className}
        defaultValue={value}
        name={field.name}
        required={field.required}
      >
        <option value="">Chọn {field.label.toLowerCase()}</option>
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      className={className}
      defaultValue={value}
      name={field.name}
      placeholder={field.placeholder}
      required={field.required}
      type={
        field.type === "datetime-local" ||
        field.type === "date" ||
        field.type === "time"
          ? field.type
          : field.type ?? "text"
      }
    />
  );
}

function ResourceForm({
  fields,
  isSaving,
  onCancel,
  onSubmit,
  record,
  title,
}: {
  fields: GenericField[];
  isSaving: boolean;
  onCancel?: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  record?: AdminRecord | null;
  title: string;
}) {
  return (
    <form
      className="grid gap-5 rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-2"
      onSubmit={onSubmit}
    >
      <div className="lg:col-span-2">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
          {title}
        </p>
      </div>

      {fields.map((field) => (
        <label
          className={field.type === "textarea" || field.type === "json" ? "lg:col-span-2" : ""}
          key={field.name}
        >
          <span className="text-sm font-bold text-slate-700">
            {field.label}
            {field.required ? <span className="text-red-600"> *</span> : null}
          </span>
          <FieldControl defaultValue={record?.[field.name]} field={field} />
        </label>
      ))}

      <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5 lg:col-span-2">
        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSaving}
          type="submit"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          {isSaving ? "Đang lưu..." : "Lưu dữ liệu"}
        </button>

        {onCancel ? (
          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            onClick={onCancel}
            type="button"
          >
            <X className="h-4 w-4" />
            Hủy
          </button>
        ) : null}
      </div>
    </form>
  );
}

export default function GenericAdminPage({ config }: { config: GenericAdminConfig }) {
  const fields = config.fields ?? [];
  const [items, setItems] = useState<AdminRecord[]>([]);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [editingRecord, setEditingRecord] = useState<AdminRecord | null>(null);
  const [detailRecord, setDetailRecord] = useState<AdminRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState<Notice>({
    kind: "info",
    message: "Đang tải dữ liệu từ backend...",
  });

  const loadItems = useCallback(
    async (keyword: string) => {
      setIsLoading(true);

      try {
        const data = await listAdminResource(config.resource, {
          keyword: keyword.trim() || undefined,
          size: 200,
        });

        setItems(data);
        setNotice({
          kind: "success",
          message: `Đã tải ${data.length} bản ghi từ /${config.resource}.`,
        });
      } catch (error) {
        setItems([]);
        setNotice({
          kind: "error",
          message: getErrorMessage(error),
        });
      } finally {
        setIsLoading(false);
      }
    },
    [config.resource],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadItems(debouncedQuery);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [debouncedQuery, loadItems]);

  const noticeClassName = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    error: "border-red-200 bg-red-50 text-red-700",
    info: "border-blue-200 bg-blue-50 text-blue-700",
  }[notice.kind];

  const allowCreate = config.allowCreate ?? fields.length > 0;
  const allowEdit = config.allowEdit ?? fields.length > 0;
  const allowDelete = config.allowDelete ?? true;

  async function submitCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    try {
      const payload = buildPayload(fields, new FormData(event.currentTarget));
      await createAdminResource(config.resource, payload);
      event.currentTarget.reset();
      await loadItems(debouncedQuery);
    } catch (error) {
      setNotice({ kind: "error", message: getErrorMessage(error) });
    } finally {
      setIsSaving(false);
    }
  }

  async function submitUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const id = editingRecord ? getRecordId(editingRecord) : undefined;

    if (id === undefined) {
      setNotice({ kind: "error", message: "Bản ghi không có id để cập nhật." });
      return;
    }

    setIsSaving(true);

    try {
      const payload = buildPayload(fields, new FormData(event.currentTarget));
      await updateAdminResource(
        config.resource,
        id,
        payload,
        config.updateMethod ?? "PATCH",
      );
      setEditingRecord(null);
      await loadItems(debouncedQuery);
    } catch (error) {
      setNotice({ kind: "error", message: getErrorMessage(error) });
    } finally {
      setIsSaving(false);
    }
  }

  async function openDetail(record: AdminRecord) {
    const id = getRecordId(record);

    if (id === undefined) {
      setDetailRecord(record);
      return;
    }

    try {
      setDetailRecord(await getAdminResource(config.resource, id));
    } catch {
      setDetailRecord(record);
    }
  }

  async function removeRecord(record: AdminRecord) {
    const id = getRecordId(record);

    if (id === undefined) {
      setNotice({ kind: "error", message: "Bản ghi không có id để xóa." });
      return;
    }

    if (!window.confirm(`Xóa bản ghi #${id}?`)) {
      return;
    }

    try {
      await deleteAdminResource(config.resource, id);
      await loadItems(debouncedQuery);
    } catch (error) {
      setNotice({ kind: "error", message: getErrorMessage(error) });
    }
  }

  async function handleAction(action: GenericAction, record: AdminRecord) {
    const id = getRecordId(record);
    const path = action.path.replace(":id", encodeURIComponent(String(id ?? "")));

    try {
      if (action.kind === "open") {
        window.open(
          `https://be.government.kidoedu.vn${path}`,
          "_blank",
          "noopener,noreferrer",
        );
        return;
      }

      const blob = await downloadBlob(path);
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${config.resource}-${getRecordId(record) ?? "download"}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      setNotice({ kind: "error", message: getErrorMessage(error) });
    }
  }

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      setNotice({ kind: "error", message: "Vui lòng chọn tệp để tải lên." });
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setNotice({ kind: "error", message: "Tệp đính kèm tối đa 20 MB." });
      return;
    }

    setIsSaving(true);

    try {
      await uploadAttachment(file);
      event.currentTarget.reset();
      await loadItems(debouncedQuery);
    } catch (error) {
      setNotice({ kind: "error", message: getErrorMessage(error) });
    } finally {
      setIsSaving(false);
    }
  }

  const visibleItems = useMemo(() => items, [items]);

  return (
    <section className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-blue-900/10 bg-white shadow-sm">
        <div className="h-2 bg-gradient-to-r from-red-700 via-yellow-400 to-blue-900" />
        <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 p-6 text-white">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-yellow-200">
                {config.eyebrow}
              </div>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
                {config.title}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-blue-100">
                {config.description}
              </p>
            </div>

            <button
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-yellow-300 bg-yellow-400 px-5 py-3 text-sm font-bold text-blue-950 shadow-sm transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoading}
              onClick={() => void loadItems(debouncedQuery)}
              type="button"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              {isLoading ? "Đang tải..." : "Làm mới"}
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
            Tổng bản ghi
          </p>
          <p className="mt-3 text-3xl font-extrabold text-blue-950">
            {items.length}
          </p>
        </div>
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-700">
            Endpoint
          </p>
          <p className="mt-3 truncate text-2xl font-extrabold text-blue-950">
            /{config.resource}
          </p>
        </div>
        <div className={`rounded-2xl border p-5 shadow-sm ${noticeClassName}`}>
          <p className="text-xs font-bold uppercase tracking-[0.18em]">
            Trạng thái
          </p>
          <p className="mt-3 text-sm font-semibold">{notice.message}</p>
        </div>
      </section>

      {config.allowUpload ? (
        <form
          className="flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-end"
          onSubmit={handleUpload}
        >
          <label className="flex-1">
            <span className="text-sm font-bold text-slate-700">
              Tải tệp đính kèm
            </span>
            <input
              className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-800"
              name="file"
              type="file"
            />
          </label>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
            disabled={isSaving}
            type="submit"
          >
            <Upload className="h-4 w-4" />
            Tải lên
          </button>
        </form>
      ) : null}

      {allowCreate && !editingRecord ? (
        <ResourceForm
          fields={fields}
          isSaving={isSaving}
          onSubmit={submitCreate}
          title={config.createTitle ?? "Tạo bản ghi"}
        />
      ) : null}

      {editingRecord ? (
        <ResourceForm
          fields={fields}
          isSaving={isSaving}
          onCancel={() => setEditingRecord(null)}
          onSubmit={submitUpdate}
          record={editingRecord}
          title="Cập nhật bản ghi"
        />
      ) : null}

      <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
              GET /{config.resource}
            </p>
            <h2 className="mt-2 text-xl font-extrabold text-blue-950">
              {config.listTitle ?? "Danh sách dữ liệu"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Đang hiển thị {visibleItems.length} bản ghi.
            </p>
          </div>

          <label className="relative block w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-11 w-full rounded-xl border border-slate-300 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm kiếm phía server..."
              value={query}
            />
          </label>
        </div>

        <div className="overflow-x-auto p-6">
          <table className="w-full min-w-[1100px] border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="bg-blue-950 text-white">
                {config.columns.map((column, index) => (
                  <th
                    className={`px-4 py-4 font-bold ${index === 0 ? "rounded-l-xl" : ""}`}
                    key={column.key}
                  >
                    {column.label}
                  </th>
                ))}
                <th className="rounded-r-xl px-4 py-4 font-bold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    className="px-4 py-10 text-center text-slate-500"
                    colSpan={config.columns.length + 1}
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : null}

              {!isLoading && visibleItems.length === 0 ? (
                <tr>
                  <td
                    className="px-4 py-10 text-center text-slate-500"
                    colSpan={config.columns.length + 1}
                  >
                    {config.emptyText ?? "Chưa có dữ liệu."}
                  </td>
                </tr>
              ) : null}

              {!isLoading
                ? visibleItems.map((record, index) => {
                    const id = getRecordId(record) ?? index;

                    return (
                      <tr
                        className="text-slate-700 transition hover:bg-blue-50/60"
                        key={String(id)}
                      >
                        {config.columns.map((column) => (
                          <td
                            className="max-w-[260px] border-b border-slate-100 px-4 py-4 align-top"
                            key={column.key}
                          >
                            <span className="line-clamp-3 break-words">
                              {formatValue(readValue(record, column.key))}
                            </span>
                          </td>
                        ))}
                        <td className="border-b border-slate-100 px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100"
                              onClick={() => void openDetail(record)}
                              title="Xem chi tiết"
                              type="button"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {allowEdit ? (
                              <button
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                                onClick={() => setEditingRecord(record)}
                                title="Sửa"
                                type="button"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                            ) : null}
                            {config.actions?.map((action) => (
                              <button
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                key={action.label}
                                onClick={() => void handleAction(action, record)}
                                title={action.label}
                                type="button"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                            ))}
                            {allowDelete ? (
                              <button
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-700 hover:bg-red-100"
                                onClick={() => void removeRecord(record)}
                                title="Xóa"
                                type="button"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>
        </div>
      </section>

      {detailRecord ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-4 sm:items-center">
          <section className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-md border border-slate-200 bg-white shadow-2xl">
            <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-xs font-bold uppercase text-blue-700">
                  Chi tiết bản ghi
                </p>
                <h3 className="mt-1 text-base font-bold text-blue-950">
                  #{formatValue(getRecordId(detailRecord))}
                </h3>
              </div>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
                onClick={() => setDetailRecord(null)}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </header>
            <pre className="max-h-[calc(90vh-74px)] overflow-auto bg-slate-950 p-5 text-xs leading-6 text-slate-100">
              {JSON.stringify(detailRecord, null, 2)}
            </pre>
          </section>
        </div>
      ) : null}
    </section>
  );
}
