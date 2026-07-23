"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { CheckCircle2, Clock, FileDown, Plus, RefreshCw, Search, XCircle } from "lucide-react";

import {
  completeWardTask,
  createAssignedTask,
  evaluateWardTask,
  getAssignedTasks,
  getPointReport,
  getReceivedTasks,
  getTaskAssignmentOptions,
  getWardTask,
  rejectWardTask,
  type PointReport,
  type TaskAssignmentOptions,
  type TaskStatus,
  type WardTask,
} from "@/services/task-management";
import { getAdminSystemRole, getStoredAdminUser } from "@/services/auth.service";

type Notice = {
  kind: "success" | "error" | "info";
  message: string;
};

const statusLabels: Record<TaskStatus, string> = {
  ASSIGNED: "Đã giao",
  SUBMITTED: "Chờ đánh giá",
  COMPLETED: "Hoàn thành",
  INCOMPLETE: "Chưa hoàn thành",
  REJECTED: "Đã từ chối",
};

const statusClasses: Record<TaskStatus, string> = {
  ASSIGNED: "border-blue-200 bg-blue-50 text-blue-700",
  SUBMITTED: "border-amber-200 bg-amber-50 text-amber-700",
  COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  INCOMPLETE: "border-red-200 bg-red-50 text-red-700",
  REJECTED: "border-slate-300 bg-slate-100 text-slate-700",
};

const taskStatuses: Array<{ value: "" | TaskStatus; label: string }> = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "ASSIGNED", label: statusLabels.ASSIGNED },
  { value: "SUBMITTED", label: statusLabels.SUBMITTED },
  { value: "COMPLETED", label: statusLabels.COMPLETED },
  { value: "INCOMPLETE", label: statusLabels.INCOMPLETE },
  { value: "REJECTED", label: statusLabels.REJECTED },
];

function getText(value: unknown) {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);

  return "";
}

function getId(value: unknown) {
  return getText(value) || "";
}

function getRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function getError(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

function formatDate(value: unknown) {
  const text = getText(value);

  if (!text) return "-";

  const date = new Date(text);

  if (Number.isNaN(date.getTime())) return text;

  return date.toLocaleString("vi-VN");
}

function formatNumber(value: unknown) {
  const number = Number(value ?? 0);

  return Number.isFinite(number) ? new Intl.NumberFormat("vi-VN").format(number) : "0";
}

function getCurrentMonthText() {
  return String(new Date().getMonth() + 1);
}

function getCurrentYearText() {
  return String(new Date().getFullYear());
}

function getStatus(value: unknown): TaskStatus {
  const status = getText(value).toUpperCase() as TaskStatus;

  return statusLabels[status] ? status : "ASSIGNED";
}

function NoticeBox({ notice }: { notice: Notice }) {
  const className = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    error: "border-red-200 bg-red-50 text-red-700",
    info: "border-blue-200 bg-blue-50 text-blue-700",
  }[notice.kind];

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${className}`}>
      {notice.message}
    </div>
  );
}

function Toolbar({
  keyword,
  month,
  year,
  status,
  onKeyword,
  onMonth,
  onYear,
  onStatus,
  onRefresh,
}: {
  keyword: string;
  month: string;
  year: string;
  status?: string;
  onKeyword: (value: string) => void;
  onMonth: (value: string) => void;
  onYear: (value: string) => void;
  onStatus?: (value: string) => void;
  onRefresh: () => void;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_140px_140px_170px_auto]">
      <label className="relative block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          className="h-11 w-full rounded-lg border border-slate-300 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100"
          onChange={(event) => onKeyword(event.target.value)}
          placeholder="Tìm kiếm"
          value={keyword}
        />
      </label>
      <input
        className="h-11 rounded-lg border border-slate-300 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100"
        max="12"
        min="1"
        onChange={(event) => onMonth(event.target.value)}
        placeholder="Tháng"
        type="number"
        value={month}
      />
      <input
        className="h-11 rounded-lg border border-slate-300 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100"
        min="2020"
        onChange={(event) => onYear(event.target.value)}
        placeholder="Năm"
        type="number"
        value={year}
      />
      {onStatus ? (
        <select
          className="h-11 rounded-lg border border-slate-300 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100"
          onChange={(event) => onStatus(event.target.value)}
          value={status}
        >
          {taskStatuses.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <span />
      )}
      <button
        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        onClick={onRefresh}
        type="button"
      >
        <RefreshCw className="h-4 w-4" />
        Làm mới
      </button>
    </div>
  );
}

function PageFrame({
  title,
  description,
  action,
  notice,
  children,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  notice: Notice;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[24px] border border-blue-900/10 bg-white shadow-sm">
        <div className="h-2 bg-gradient-to-r from-red-700 via-yellow-400 to-blue-900" />
        <div className="flex flex-col gap-4 bg-blue-950 p-6 text-white lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-200">
              Giao việc khu phố
            </p>
            <h1 className="mt-3 text-2xl font-extrabold">{title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-blue-100">
              {description}
            </p>
          </div>
          {action}
        </div>
      </section>
      <NoticeBox notice={notice} />
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: unknown }) {
  const key = getStatus(status);

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${statusClasses[key]}`}>
      {statusLabels[key]}
    </span>
  );
}

function FileList({ files }: { files?: unknown }) {
  const list = Array.isArray(files) ? files : [];

  if (list.length === 0) {
    return <span className="text-xs text-slate-400">Không có tệp</span>;
  }

  return (
    <div className="space-y-2">
      {list.map((file, index) => {
        const record = typeof file === "object" && file ? (file as Record<string, unknown>) : {};
        const url = getText(record.url) || getText(record.path);
        const name = getText(record.name) || getText(record.filename) || `Tệp ${index + 1}`;
        const size = getText(record.size);

        return (
          <a
            className="inline-flex max-w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
            href={url || "#"}
            key={`${name}-${index}`}
            rel="noreferrer"
            target="_blank"
          >
            <FileDown className="h-4 w-4 shrink-0" />
            <span className="truncate">{name}</span>
            {size ? <span className="shrink-0 text-slate-400">{size}</span> : null}
          </a>
        );
      })}
    </div>
  );
}

function headsFromOptions(options: TaskAssignmentOptions) {
  return Array.isArray(options.neighborhoodHeads) ? options.neighborhoodHeads : [];
}

export function AssignedTasksPage() {
  return <TasksPage mode="assigned" />;
}

export function ReceivedTasksPage() {
  return <TasksPage mode="received" />;
}

function TasksPage({ mode }: { mode: "assigned" | "received" }) {
  const [tasks, setTasks] = useState<WardTask[]>([]);
  const [options, setOptions] = useState<TaskAssignmentOptions>({});
  const [keyword, setKeyword] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("2026");
  const [status, setStatus] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [detail, setDetail] = useState<WardTask | null>(null);
  const [notice, setNotice] = useState<Notice>({ kind: "info", message: "Đang tải danh sách công việc..." });
  const isAssigned = mode === "assigned";

  const loadTasks = useCallback(async () => {
    try {
      const query = {
        page: 0,
        size: 100,
        keyword,
        month: month ? Number(month) : undefined,
        year: year ? Number(year) : undefined,
        status,
      };
      const [taskData, optionData] = await Promise.all([
        isAssigned ? getAssignedTasks(query) : getReceivedTasks(query),
        getTaskAssignmentOptions().catch(() => ({})),
      ]);
      setTasks(taskData);
      setOptions(optionData);
      setNotice({ kind: "success", message: `Đã tải ${taskData.length} công việc.` });
    } catch (error) {
      setTasks([]);
      setNotice({ kind: "error", message: getError(error, "Không tải được danh sách công việc.") });
    }
  }, [isAssigned, keyword, month, year, status]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadTasks();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadTasks]);

  async function openDetail(task: WardTask) {
    try {
      setDetail(await getWardTask(getId(task.id)));
    } catch {
      setDetail(task);
    }
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      await createAssignedTask(formData);
      setOpenCreate(false);
      await loadTasks();
      setNotice({ kind: "success", message: "Đã giao việc mới." });
    } catch (error) {
      setNotice({ kind: "error", message: getError(error, "Không tạo được công việc.") });
    }
  }

  return (
    <PageFrame
      action={
        isAssigned ? (
          <button className="inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-3 text-sm font-bold text-blue-950" onClick={() => setOpenCreate(true)} type="button">
            <Plus className="h-4 w-4" />
            Giao việc
          </button>
        ) : undefined
      }
      description={isAssigned ? "Tạo việc, theo dõi việc đã giao và đánh giá kết quả trưởng khu phố nộp." : "Theo dõi việc được giao, nộp hoàn thành hoặc từ chối khi chưa đánh giá."}
      notice={notice}
      title={isAssigned ? "Giao việc" : "Nhận việc"}
    >
      <section className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
        <Toolbar keyword={keyword} month={month} year={year} status={status} onKeyword={setKeyword} onMonth={setMonth} onYear={setYear} onStatus={setStatus} onRefresh={loadTasks} />
        <TaskTable isAssigned={isAssigned} tasks={tasks} onDetail={openDetail} />
      </section>
      {openCreate ? <CreateTaskModal options={options} onClose={() => setOpenCreate(false)} onSubmit={handleCreate} /> : null}
      {detail ? <TaskDetailModal isAssigned={isAssigned} task={detail} onClose={() => setDetail(null)} onChanged={loadTasks} setNotice={setNotice} /> : null}
    </PageFrame>
  );
}

function TaskTable({ tasks, isAssigned, onDetail }: { tasks: WardTask[]; isAssigned: boolean; onDetail: (task: WardTask) => void }) {
  return (
    <div className="mt-5 overflow-x-auto">
      <table className="w-full min-w-[1050px] text-left text-sm">
        <thead className="bg-blue-950 text-white">
          <tr>
            <th className="rounded-l-lg px-4 py-3">Tiêu đề</th>
            <th className="px-4 py-3">{isAssigned ? "Người nhận" : "Người giao"}</th>
            <th className="px-4 py-3">Điểm</th>
            <th className="px-4 py-3">Deadline</th>
            <th className="px-4 py-3">Trạng thái</th>
            <th className="px-4 py-3">Tệp giao</th>
            <th className="px-4 py-3">Tệp nộp</th>
            <th className="rounded-r-lg px-4 py-3 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr className="border-b border-slate-100 align-top" key={getId(task.id)}>
              <td className="px-4 py-4">
                <p className="font-bold text-blue-950">{task.title ?? "-"}</p>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">{getText(task.content)}</p>
              </td>
              <td className="px-4 py-4">
                {getText(task.assigneeName) ||
                  getText(task.assignerName) ||
                  getText(getRecord(task.assignee).name) ||
                  "-"}
              </td>
              <td className="px-4 py-4 font-bold">{formatNumber(task.points)}</td>
              <td className="px-4 py-4">{formatDate(task.deadline)}</td>
              <td className="px-4 py-4"><StatusBadge status={task.status} /></td>
              <td className="px-4 py-4"><FileList files={task.attachments} /></td>
              <td className="px-4 py-4"><FileList files={task.submissionAttachments} /></td>
              <td className="px-4 py-4 text-right">
                <button className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50" onClick={() => onDetail(task)} type="button">
                  Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {tasks.length === 0 ? <p className="py-10 text-center text-sm text-slate-500">Chưa có công việc.</p> : null}
    </div>
  );
}

function CreateTaskModal({ options, onClose, onSubmit }: { options: TaskAssignmentOptions; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const heads = headsFromOptions(options);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <form className="max-h-[88vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-6 shadow-xl" onSubmit={onSubmit}>
        <h2 className="text-lg font-extrabold text-blue-950">Giao việc mới</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <input className="h-11 rounded-lg border border-slate-300 px-4 text-sm md:col-span-2" name="title" placeholder="Tiêu đề" required />
          <textarea className="min-h-28 rounded-lg border border-slate-300 px-4 py-3 text-sm md:col-span-2" name="content" placeholder="Nội dung công việc" required />
          <input className="h-11 rounded-lg border border-slate-300 px-4 text-sm" name="points" placeholder="Điểm" required type="number" />
          <input className="h-11 rounded-lg border border-slate-300 px-4 text-sm" name="deadline" required type="datetime-local" />
          <select className="h-11 rounded-lg border border-slate-300 px-4 text-sm" name="assigneeId" required>
            <option value="">Chọn trưởng khu phố</option>
            {heads.map((head) => (
              <option key={getId(head.id)} value={getId(head.id)}>
                {getText(head.name) || getText(head.username) || getId(head.id)}
              </option>
            ))}
          </select>
          <input className="rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm md:col-span-2" multiple name="files" type="file" />
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold" onClick={onClose} type="button">Hủy</button>
          <button className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-bold text-white" type="submit">Giao việc</button>
        </div>
      </form>
    </div>
  );
}

function TaskDetailModal({ task, isAssigned, onClose, onChanged, setNotice }: { task: WardTask; isAssigned: boolean; onClose: () => void; onChanged: () => Promise<void>; setNotice: (notice: Notice) => void }) {
  const [note, setNote] = useState("");
  const [reason, setReason] = useState("");
  const status = getStatus(task.status);
  const canEvaluate = isAssigned && status === "SUBMITTED";
  const canSubmit = !isAssigned && ["ASSIGNED", "SUBMITTED"].includes(status);
  const canReject = !isAssigned && !["COMPLETED", "INCOMPLETE", "REJECTED"].includes(status);

  async function evaluate(statusValue: "COMPLETED" | "INCOMPLETE") {
    if (statusValue === "INCOMPLETE" && !note.trim()) {
      setNotice({ kind: "error", message: "Vui lòng nhập ghi chú khi đánh giá chưa hoàn thành." });
      return;
    }

    try {
      await evaluateWardTask(getId(task.id), { status: statusValue, note: note.trim() || undefined });
      await onChanged();
      onClose();
      setNotice({ kind: "success", message: "Đã đánh giá công việc." });
    } catch (error) {
      setNotice({ kind: "error", message: getError(error, "Không đánh giá được công việc.") });
    }
  }

  async function complete(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await completeWardTask(getId(task.id), new FormData(event.currentTarget));
      await onChanged();
      onClose();
      setNotice({ kind: "success", message: "Đã nộp hoàn thành công việc." });
    } catch (error) {
      setNotice({ kind: "error", message: getError(error, "Không nộp được công việc.") });
    }
  }

  async function reject() {
    if (!reason.trim()) {
      setNotice({ kind: "error", message: "Vui lòng nhập lý do từ chối." });
      return;
    }

    try {
      await rejectWardTask(getId(task.id), { reason: reason.trim() });
      await onChanged();
      onClose();
      setNotice({ kind: "success", message: "Đã từ chối công việc." });
    } catch (error) {
      setNotice({ kind: "error", message: getError(error, "Không từ chối được công việc.") });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="max-h-[88vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-blue-950">{task.title ?? "Chi tiết công việc"}</h2>
            <p className="mt-1 text-sm text-slate-500">Deadline: {formatDate(task.deadline)}</p>
          </div>
          <StatusBadge status={task.status} />
        </div>
        <p className="mt-5 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">{getText(task.content) || "-"}</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-bold text-blue-950">Tệp giao việc</p>
            <FileList files={task.attachments} />
          </div>
          <div>
            <p className="mb-2 text-sm font-bold text-blue-950">Tệp nộp việc</p>
            <FileList files={task.submissionAttachments} />
          </div>
        </div>
        {canEvaluate ? (
          <div className="mt-5 rounded-xl border border-slate-200 p-4">
            <textarea className="min-h-24 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm" onChange={(event) => setNote(event.target.value)} placeholder="Ghi chú khi đánh giá chưa hoàn thành" value={note} />
            <div className="mt-3 flex flex-wrap justify-end gap-3">
              <button className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-700" onClick={() => void evaluate("INCOMPLETE")} type="button">
                <XCircle className="h-4 w-4" />
                Chưa hoàn thành
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white" onClick={() => void evaluate("COMPLETED")} type="button">
                <CheckCircle2 className="h-4 w-4" />
                Hoàn thành
              </button>
            </div>
          </div>
        ) : null}
        {canSubmit ? (
          <form className="mt-5 rounded-xl border border-slate-200 p-4" onSubmit={complete}>
            <p className="mb-3 text-sm font-bold text-blue-950">Nộp hoàn thành</p>
            <input className="w-full rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm" multiple name="files" type="file" />
            <button className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white" type="submit">
              <CheckCircle2 className="h-4 w-4" />
              Hoàn thành
            </button>
          </form>
        ) : null}
        {canReject ? (
          <div className="mt-5 rounded-xl border border-slate-200 p-4">
            <textarea className="min-h-20 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm" onChange={(event) => setReason(event.target.value)} placeholder="Lý do từ chối" value={reason} />
            <button className="mt-3 rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-700" onClick={() => void reject()} type="button">
              Từ chối
            </button>
          </div>
        ) : null}
        <div className="mt-5 flex justify-end">
          <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold" onClick={onClose} type="button">Đóng</button>
        </div>
      </div>
    </div>
  );
}

export function PointReportPage() {
  const [items, setItems] = useState<PointReport[]>([]);
  const [options, setOptions] = useState<TaskAssignmentOptions>({});
  const [month, setMonth] = useState(() => getCurrentMonthText());
  const [year, setYear] = useState(() => getCurrentYearText());
  const [assigneeId, setAssigneeId] = useState("");
  const [notice, setNotice] = useState<Notice>({ kind: "info", message: "Đang tải báo cáo điểm..." });
  const role = useMemo(() => getAdminSystemRole(getStoredAdminUser()), []);
  const heads = headsFromOptions(options);

  const loadReport = useCallback(async () => {
    try {
      const [reportData, optionData] = await Promise.all([
        getPointReport({ month, year, assigneeId }),
        getTaskAssignmentOptions().catch(() => ({})),
      ]);
      setItems(reportData);
      setOptions(optionData);
      setNotice({ kind: "success", message: `Đã tải ${reportData.length} dòng báo cáo.` });
    } catch (error) {
      setItems([]);
      setNotice({ kind: "error", message: getError(error, "Không tải được báo cáo điểm.") });
    }
  }, [month, year, assigneeId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadReport();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadReport]);

  return (
    <PageFrame description="Thống kê điểm theo tháng/năm từ dữ liệu backend." notice={notice} title={role === "NEIGHBORHOOD_HEAD" ? "Điểm của tôi" : "Báo cáo điểm"}>
      <section className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[140px_140px_minmax(0,1fr)_auto]">
          <input className="h-11 rounded-lg border border-slate-300 px-4 text-sm" onChange={(event) => setMonth(event.target.value)} placeholder="Tháng" type="number" value={month} />
          <input className="h-11 rounded-lg border border-slate-300 px-4 text-sm" onChange={(event) => setYear(event.target.value)} placeholder="Năm" type="number" value={year} />
          {role === "WARD_CHAIRMAN" ? (
            <select className="h-11 rounded-lg border border-slate-300 px-4 text-sm" onChange={(event) => setAssigneeId(event.target.value)} value={assigneeId}>
              <option value="">Tất cả trưởng khu phố</option>
              {heads.map((head) => (
                <option key={getId(head.id)} value={getId(head.id)}>
                  {getText(head.name) || getText(head.username) || getId(head.id)}
                </option>
              ))}
            </select>
          ) : (
            <span />
          )}
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-bold" onClick={loadReport} type="button">
            <Clock className="h-4 w-4" />
            Xem báo cáo
          </button>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="bg-blue-950 text-white">
              <tr>
                {["Người nhận", "Điểm đầu", "Tổng việc", "Hoàn thành", "Chưa hoàn thành", "Từ chối", "Đang chờ", "Đã nộp", "Cộng", "Trừ", "Điểm"].map((label, index, arr) => (
                  <th className={`px-4 py-3 ${index === 0 ? "rounded-l-lg" : ""} ${index === arr.length - 1 ? "rounded-r-lg" : ""}`} key={label}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr className="border-b border-slate-100" key={getId(item.assigneeId) || String(index)}>
                  <td className="px-4 py-4 font-bold text-blue-950">{getText(item.assigneeName) || getText(item.name) || "-"}</td>
                  <td className="px-4 py-4">{formatNumber(item.initialPoints)}</td>
                  <td className="px-4 py-4">{formatNumber(item.totalTasks)}</td>
                  <td className="px-4 py-4 text-emerald-700">{formatNumber(item.completed)}</td>
                  <td className="px-4 py-4 text-red-700">{formatNumber(item.incomplete)}</td>
                  <td className="px-4 py-4">{formatNumber(item.rejected)}</td>
                  <td className="px-4 py-4">{formatNumber(item.pending)}</td>
                  <td className="px-4 py-4">{formatNumber(item.submitted)}</td>
                  <td className="px-4 py-4 text-emerald-700">{formatNumber(item.earned)}</td>
                  <td className="px-4 py-4 text-red-700">{formatNumber(item.deducted)}</td>
                  <td className="px-4 py-4 text-lg font-extrabold text-blue-950">{formatNumber(item.score)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 ? <p className="py-10 text-center text-sm text-slate-500">Chưa có dữ liệu báo cáo.</p> : null}
        </div>
      </section>
    </PageFrame>
  );
}
