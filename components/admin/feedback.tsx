"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  FileJson,
  Loader2,
  MessageSquareText,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Tags,
  Trash2,
  Users,
  X,
} from "lucide-react";

import {
  createResource,
  deleteResource,
  getRecordId,
  getResourceById,
  listResource,
  updateResource,
} from "@/services/feedback";
import type { AdminRecord } from "@/services/feedback";

export type CrudField = {
  name: string;
  label: string;
  type?:
    | "text"
    | "email"
    | "number"
    | "password"
    | "textarea"
    | "select"
    | "json"
    | "datetime-local"
    | "checkbox";
  placeholder?: string;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  helper?: string;
};

export type CrudAdminConfig = {
  activeHref: string;
  title: string;
  eyebrow: string;
  description: string;
  resource: string;
  createTitle: string;
  listTitle: string;
  emptyText: string;

  columns: {
    key: string;
    label: string;
  }[];

  fields: CrudField[];

  editFields?: CrudField[];

  mockData?: AdminRecord[];

  showCreateForm?: boolean;
};

type Notice = {
  kind: "success" | "error" | "info";
  message: string;
};

function readValue(record: AdminRecord, key: string) {
  return key.split(".").reduce<unknown>((current, part) => {
    if (typeof current !== "object" || current === null) {
      return undefined;
    }

    return (current as Record<string, unknown>)[part];
  }, record);
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "boolean") {
    return value ? "Có" : "Không";
  }

  if (Array.isArray(value)) {
    return value.map(formatValue).join(", ");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function parseFieldValue(
  field: CrudField,
  rawValue: FormDataEntryValue | null,
) {
  const value = String(rawValue ?? "").trim();

  if (field.type === "checkbox") {
    return rawValue !== null;
  }

  if (!value && !field.required) {
    return undefined;
  }

  if (field.type === "number") {
    return Number(value);
  }

  if (field.type === "json") {
    return value ? JSON.parse(value) : undefined;
  }

  return value;
}

function buildPayload(fields: CrudField[], formData: FormData) {
  return fields.reduce<AdminRecord>((payload, field) => {
    const value = parseFieldValue(field, formData.get(field.name));

    if (value !== undefined) {
      payload[field.name] = value;
    }

    return payload;
  }, {});
}

function formatDateTimeLocalValue(value: unknown): string {
  if (!value) {
    return "";
  }

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offsetMs = date.getTimezoneOffset() * 60 * 1000;

  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function getFieldDefaultValue(field: CrudField, record?: AdminRecord) {
  const value = record?.[field.name];

  if (field.type === "datetime-local") {
    return formatDateTimeLocalValue(value);
  }

  if (field.type === "json") {
    return value === undefined || value === null
      ? ""
      : JSON.stringify(value, null, 2);
  }

  return value === undefined || value === null ? "" : String(value);
}

function FieldControl({
  field,
  record,
}: {
  field: CrudField;
  record?: AdminRecord;
}) {
  const defaultValue = getFieldDefaultValue(field, record);

  return (
    <label className="block" key={field.name}>
      <span className="mb-1.5 block text-sm font-semibold text-[#3f454d]">
        {field.label}
      </span>
      {field.type === "checkbox" ? (
        <div className="flex items-start gap-3 rounded-md border border-[#d8dee8] bg-[#f8fafc] px-3 py-2.5">
          <input
            className="mt-0.5 h-4 w-4 rounded border-[#b8c2d0] text-[#0d6efd] focus:ring-[#c7defd]"
            defaultChecked={Boolean(record?.[field.name])}
            name={field.name}
            type="checkbox"
          />
          <span className="text-sm leading-5 text-[#526071]">
            Bat truong nay
          </span>
        </div>
      ) : field.type === "textarea" || field.type === "json" ? (
        <textarea
          className="min-h-[110px] w-full resize-y rounded-md border border-[#d8dee8] bg-[#f8fafc] px-3 py-2 text-sm leading-6 outline-none transition focus:border-[#0d6efd] focus:bg-white focus:ring-2 focus:ring-[#c7defd]"
          defaultValue={defaultValue}
          name={field.name}
          placeholder={field.placeholder}
          required={field.required}
        />
      ) : field.type === "select" ? (
        <select
          className="h-10 w-full rounded-md border border-[#d8dee8] bg-[#f8fafc] px-3 text-sm outline-none transition focus:border-[#0d6efd] focus:bg-white focus:ring-2 focus:ring-[#c7defd]"
          defaultValue={defaultValue || field.options?.[0]?.value}
          name={field.name}
          required={field.required}
        >
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          className="h-10 w-full rounded-md border border-[#d8dee8] bg-[#f8fafc] px-3 text-sm outline-none transition focus:border-[#0d6efd] focus:bg-white focus:ring-2 focus:ring-[#c7defd]"
          defaultValue={defaultValue}
          name={field.name}
          placeholder={field.placeholder}
          required={field.required}
          type={field.type ?? "text"}
        />
      )}
      {field.helper ? (
        <span className="mt-1.5 block text-xs leading-5 text-[#667085]">
          {field.helper}
        </span>
      ) : null}
    </label>
  );
}

function stripReadonlyFields(record: AdminRecord) {
  const next: AdminRecord = {};

  for (const [key, value] of Object.entries(record)) {
    if (
      [
        "id",
        "_id",
        "createdAt",
        "updatedAt",
        "creationTime",
        "responseTime",
      ].includes(key)
    ) {
      continue;
    }

    next[key] = value;
  }

  return next;
}

function ResourceIcon({ resource }: { resource: string }) {
  const Icon =
    resource === "users"
      ? Users
      : resource === "feedback-types"
        ? Tags
        : MessageSquareText;

  return <Icon className="h-5 w-5" />;
}

function RecordModal({
  fields,
  isSaving,
  onClose,
  onSave,
  record,
}: {
  fields?: CrudField[];
  isSaving: boolean;
  onClose: () => void;
  onSave: (payload: AdminRecord) => Promise<void>;
  record: AdminRecord;
}) {
  const [json, setJson] = useState(() =>
    JSON.stringify(stripReadonlyFields(record), null, 2),
  );
  const [error, setError] = useState("");

  async function submitEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      const payload = fields
        ? buildPayload(fields, new FormData(event.currentTarget))
        : (JSON.parse(json) as AdminRecord);

      await onSave(payload);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Không thể cập nhật bản ghi.",
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-4 sm:items-center">
      <section className="w-full max-w-2xl overflow-hidden rounded-md border border-[#dfe3e8] bg-white shadow-2xl">
        <header className="flex items-center justify-between gap-3 border-b border-[#dfe3e8] px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase text-[#0d6efd]">
              PATCH
            </p>
            <h2 className="text-base font-semibold text-[#182433]">
              Cập nhật bản ghi
            </h2>
          </div>
          <button
            aria-label="Đóng"
            className="flex h-9 w-9 items-center justify-center rounded-md text-[#667085] hover:bg-[#f1f5f9]"
            onClick={onClose}
            title="Đóng"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <form onSubmit={submitEdit}>
          <div className="space-y-3 p-5">
            {error ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : null}
            {fields ? (
              fields.map((field) => (
                <FieldControl field={field} key={field.name} record={record} />
              ))
            ) : (
              <textarea
                className="min-h-[360px] w-full resize-y rounded-md border border-[#d8dee8] bg-[#f8fafc] px-3 py-3 font-mono text-sm leading-6 text-[#182433] outline-none focus:border-[#0d6efd] focus:ring-2 focus:ring-[#c7defd]"
                onChange={(event) => setJson(event.target.value)}
                value={json}
              />
            )}
          </div>

          <footer className="flex items-center justify-end gap-2 border-t border-[#dfe3e8] bg-[#f8fafc] px-5 py-4">
            <button
              className="h-10 rounded-md border border-[#dfe3e8] bg-white px-4 text-sm font-medium text-[#182433] hover:bg-[#f1f5f9]"
              onClick={onClose}
              type="button"
            >
              Hủy
            </button>
            <button
              className="inline-flex h-10 items-center gap-2 rounded-md bg-[#0d6efd] px-4 text-sm font-semibold text-white hover:bg-[#0b5ed7] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}
              Lưu
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export function ResourceCrudPanel({
  config,
  showHeader = true,
}: {
  config: CrudAdminConfig;
  showHeader?: boolean;
}) {
  const [items, setItems] = useState<AdminRecord[]>(config.mockData ?? []);
  const [query, setQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<AdminRecord | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState<Notice>({
    kind: "info",
    message: "Đang tải dữ liệu từ backend...",
  });

  const resolveItems = useCallback((data: AdminRecord[]) => {
    if (data.length > 0 || !config.mockData?.length) {
      return data;
    }

    return config.mockData;
  }, [config.mockData]);

  const getLoadSuccessMessage = useCallback((data: AdminRecord[]) => {
    if (data.length > 0 || !config.mockData?.length) {
      return `Đã tải ${data.length} bản ghi từ /${config.resource}.`;
    }

    return `Endpoint /${config.resource} chưa có dữ liệu, đang hiển thị ${config.mockData.length} bản ghi mẫu.`;
  }, [config.mockData, config.resource]);

  const getLoadFallbackMessage = useCallback((error: unknown) => {
    if (config.mockData?.length) {
      return `Không kết nối được /${config.resource}, đang hiển thị ${config.mockData.length} bản ghi mẫu.`;
    }

    return error instanceof Error
      ? error.message
      : `Không tải được dữ liệu /${config.resource}.`;
  }, [config.mockData, config.resource]);

  async function loadItems() {
    setIsLoading(true);

    try {
      const data = await listResource(config.resource);
      setItems(resolveItems(data));
      setNotice({
        kind: "success",
        message: getLoadSuccessMessage(data),
      });
    } catch (error) {
      if (config.mockData?.length) {
        setItems(config.mockData);
      }

      setNotice({
        kind: config.mockData?.length ? "info" : "error",
        message: getLoadFallbackMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadInitialItems() {
      try {
        const data = await listResource(config.resource);

        if (!isMounted) {
          return;
        }

        setItems(resolveItems(data));
        setNotice({
          kind: "success",
          message: getLoadSuccessMessage(data),
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (config.mockData?.length) {
          setItems(config.mockData);
        }

        setNotice({
          kind: config.mockData?.length ? "info" : "error",
          message: getLoadFallbackMessage(error),
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadInitialItems();

    return () => {
      isMounted = false;
    };
  }, [config.mockData, config.resource, getLoadFallbackMessage, getLoadSuccessMessage, resolveItems]);

  const filteredItems = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    if (!keyword) {
      return items;
    }

    return items.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(keyword),
    );
  }, [items, query]);

  async function submitCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    const form = event.currentTarget;

    try {
      const payload = buildPayload(config.fields, new FormData(form));
      const created = await createResource(config.resource, payload);

      setItems((current) => [created, ...current]);
      form.reset();
      setNotice({
        kind: "success",
        message: `Đã tạo bản ghi mới trong /${config.resource}.`,
      });
    } catch (error) {
      setNotice({
        kind: "error",
        message:
          error instanceof Error ? error.message : "Không tạo được bản ghi.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function openDetail(record: AdminRecord) {
    const id = getRecordId(record);

    if (id === undefined) {
      setSelectedRecord(record);
      return;
    }

    try {
      const detail = await getResourceById(config.resource, id);
      setSelectedRecord(detail);
    } catch {
      setSelectedRecord(record);
    }
  }

  async function saveSelectedRecord(payload: AdminRecord) {
    if (!selectedRecord) {
      return;
    }

    const id = getRecordId(selectedRecord);

    if (id === undefined) {
      throw new Error("Bản ghi không có id để cập nhật.");
    }

    setIsSaving(true);

    try {
      const updated = await updateResource(config.resource, id, payload);
      setItems((current) =>
        current.map((item) => (getRecordId(item) === id ? updated : item)),
      );
      setSelectedRecord(null);
      setNotice({
        kind: "success",
        message: `Đã cập nhật bản ghi #${id}.`,
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function removeRecord(record: AdminRecord) {
    const id = getRecordId(record);

    if (id === undefined) {
      setNotice({
        kind: "error",
        message: "Bản ghi không có id để xóa.",
      });
      return;
    }

    const confirmed = window.confirm(`Xóa bản ghi #${id}?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteResource(config.resource, id);
      setItems((current) => current.filter((item) => getRecordId(item) !== id));
      setNotice({
        kind: "success",
        message: `Đã xóa bản ghi #${id}.`,
      });
    } catch (error) {
      setNotice({
        kind: "error",
        message:
          error instanceof Error ? error.message : "Không xóa được bản ghi.",
      });
    }
  }

  const noticeClassName = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    error: "border-red-200 bg-red-50 text-red-700",
    info: "border-blue-200 bg-blue-50 text-blue-700",
  }[notice.kind];

  return (
    <section className="space-y-4">
      {showHeader ? (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-wide text-[#667085]">
              {config.eyebrow}
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-[#182433]">
              {config.title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#526071]">
              {config.description}
            </p>
          </div>
          <button
            aria-label="Tải lại"
            className="inline-flex h-10 w-fit items-center gap-2 rounded-md border border-[#dfe3e8] bg-white px-4 text-sm font-medium text-[#182433] shadow-sm hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isLoading}
            onClick={loadItems}
            type="button"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Tải lại
          </button>
        </div>
      ) : null}

      <div className="grid">
        <section className="min-w-0 overflow-hidden rounded-md border border-[#dfe3e8] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="border-b border-[#dfe3e8] p-5">
            <div
              className={`mb-4 flex items-start gap-2.5 rounded-md border px-3 py-2 text-sm ${noticeClassName}`}
            >
              {notice.kind === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" />
              )}
              <span>{notice.message}</span>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-[#0d6efd]">
                  GET /{config.resource}
                </p>
                <h2 className="mt-1 text-base font-semibold text-[#182433]">
                  {config.listTitle}
                </h2>
                <p className="mt-1 text-sm text-[#667085]">
                  Hiển thị {filteredItems.length} / {items.length} bản ghi.
                </p>
              </div>

              <label className="relative block w-full lg:w-[320px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a94a6]" />
                <input
                  className="h-10 w-full rounded-md border border-[#d8dee8] bg-[#f8fafc] pl-9 pr-3 text-sm outline-none transition focus:border-[#0d6efd] focus:bg-white focus:ring-2 focus:ring-[#c7defd]"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Tìm trong dữ liệu..."
                  value={query}
                />
              </label>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse">
              <thead>
                <tr className="border-b border-[#dfe3e8] bg-[#f8fafc] text-left text-[11px] font-bold uppercase tracking-wide text-[#667085]">
                  {config.columns.map((column) => (
                    <th className="px-4 py-3" key={column.key}>
                      {column.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => {
                  const id = getRecordId(item) ?? `row-${index}`;

                  return (
                    <tr
                      className="border-b border-[#edf0f4] align-top last:border-0 hover:bg-[#f8fafc]"
                      key={String(id)}
                    >
                      {config.columns.map((column) => (
                        <td
                          className="max-w-[300px] px-4 py-3 text-sm text-[#3f454d]"
                          key={column.key}
                        >
                          <span className="line-clamp-3 break-words">
                            {formatValue(readValue(item, column.key))}
                          </span>
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            aria-label="Xem JSON"
                            className="flex h-9 w-9 items-center justify-center rounded-md border border-[#dfe3e8] bg-white text-[#526071] hover:bg-[#eef6ff] hover:text-[#0d6efd]"
                            onClick={() => openDetail(item)}
                            title="Xem JSON"
                            type="button"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            aria-label="Sửa"
                            className="flex h-9 w-9 items-center justify-center rounded-md border border-[#dfe3e8] bg-white text-[#526071] hover:bg-[#eef6ff] hover:text-[#0d6efd]"
                            onClick={() => setSelectedRecord(item)}
                            title="Sửa"
                            type="button"
                          >
                            <FileJson className="h-4 w-4" />
                          </button>
                          <button
                            aria-label="Xóa"
                            className="flex h-9 w-9 items-center justify-center rounded-md border border-red-100 bg-white text-red-500 hover:bg-red-50"
                            onClick={() => removeRecord(item)}
                            title="Xóa"
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {!isLoading && filteredItems.length === 0 ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center px-5 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-md bg-[#eef6ff] text-[#0d6efd]">
                <ResourceIcon resource={config.resource} />
              </div>
              <p className="mt-4 font-semibold text-[#182433]">
                {config.emptyText}
              </p>
              <p className="mt-1 max-w-sm text-sm leading-6 text-[#667085]">
                Thử tải lại dữ liệu hoặc tạo bản ghi mới bằng form bên trái.
              </p>
            </div>
          ) : null}

          {isLoading ? (
            <div className="flex min-h-[260px] items-center justify-center gap-2 text-sm text-[#667085]">
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang tải dữ liệu...
            </div>
          ) : null}
        </section>
      </div>

      {selectedRecord ? (
        <RecordModal
          fields={config.editFields}
          isSaving={isSaving}
          onClose={() => setSelectedRecord(null)}
          onSave={saveSelectedRecord}
          record={selectedRecord}
        />
      ) : null}
    </section>
  );
}

export default function CrudAdminPage({ config }: { config: CrudAdminConfig }) {
  return (
    <main className="mx-auto max-w-[1288px] px-4 py-6">
      <ResourceCrudPanel config={config} />
    </main>
  );
}
