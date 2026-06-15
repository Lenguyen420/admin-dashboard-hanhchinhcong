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
import buildPayload from "./buildPayload";
import RecordModal from "./RecordModal";
import formatValue from "./formatValue";
import RecordDetailModal from "./RecordDetailModal";

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

function ResourceIcon({ resource }: { resource: string }) {
  const Icon =
    resource === "users"
      ? Users
      : resource === "feedback-types"
        ? Tags
        : MessageSquareText;

  return <Icon className="h-5 w-5" />;
}

export function ResourceCrudPanel({
  config,
  showHeader = true,
}: {
  config: CrudAdminConfig;
  showHeader?: boolean;
}) {
  const [items, setItems] = useState<AdminRecord[]>([]);
  const [query, setQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<AdminRecord | null>(
    null,
  );
  const [detailRecord, setDetailRecord] = useState<AdminRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState<Notice>({
    kind: "info",
    message: "Đang tải dữ liệu từ backend...",
  });

  const getLoadSuccessMessage = useCallback(
    (data: AdminRecord[]) => {
      return `Đã tải ${data.length} bản ghi từ /${config.resource}.`;
    },
    [config.resource],
  );

  const getLoadErrorMessage = useCallback(
    (error: unknown) => {
      return error instanceof Error
        ? error.message
        : `Không tải được dữ liệu /${config.resource}.`;
    },
    [config.resource],
  );
  async function loadItems() {
    setIsLoading(true);

    try {
      const data = await listResource(config.resource);
      console.log("list record", data);
      setItems(data);

      setNotice({
        kind: "success",
        message: getLoadSuccessMessage(data),
      });
    } catch (error) {
      setItems([]);

      setNotice({
        kind: "error",
        message: getLoadErrorMessage(error),
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
        console.log("list record", data);

        if (!isMounted) {
          return;
        }

        setItems(data);

        setNotice({
          kind: "success",
          message: getLoadSuccessMessage(data),
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setItems([]);

        setNotice({
          kind: "error",
          message: getLoadErrorMessage(error),
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
  }, [config.resource, getLoadErrorMessage, getLoadSuccessMessage]);
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
      setDetailRecord(record);
      return;
    }

    try {
      const detail = await getResourceById(config.resource, id);
      setDetailRecord(detail);
    } catch {
      setDetailRecord(record);
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
                            aria-label="Xem chi tiết"
                            className="flex h-9 w-9 items-center justify-center rounded-md border border-[#dfe3e8] bg-white text-[#526071] hover:bg-[#eef6ff] hover:text-[#0d6efd]"
                            onClick={() => openDetail(item)}
                            title="Xem chi tiết"
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
      {detailRecord ? (
        <RecordDetailModal
          onClose={() => setDetailRecord(null)}
          record={detailRecord}
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
