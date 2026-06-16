"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
  type CreateUserPayload,
  type UpdateUserPayload,
  type User,
} from "@/services/users";

type Notice = {
  kind: "success" | "error" | "info";
  message: string;
};

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function cleanPayload<T extends Record<string, unknown>>(payload: T): T {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => {
      return value !== undefined && value !== null && value !== "";
    }),
  ) as T;
}

function formatDate(value?: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export default function UsersPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState<Notice>({
    kind: "info",
    message: "Đang tải dữ liệu người dùng...",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [detailUser, setDetailUser] = useState<User | null>(null);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await getUsers();

      setUsers(data);
      setNotice({
        kind: "success",
        message: `Đã tải ${data.length} người dùng từ /users.`,
      });
    } catch (error) {
      setUsers([]);
      setNotice({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "Không tải được danh sách người dùng.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    if (!keyword) {
      return users;
    }

    return users.filter((user) =>
      JSON.stringify(user).toLowerCase().includes(keyword),
    );
  }, [users, query]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = cleanPayload<CreateUserPayload>({
      username: getString(formData, "username"),
      zalo_id: getString(formData, "zalo_id"),
      avatar: getString(formData, "avatar"),
    });

    setIsSaving(true);

    try {
      const created = await createUser(payload);

      setUsers((current) => [created, ...current]);
      form.reset();
      setIsCreateOpen(false);

      setNotice({
        kind: "success",
        message: "Đã tạo người dùng mới.",
      });
    } catch (error) {
      setNotice({
        kind: "error",
        message:
          error instanceof Error ? error.message : "Không tạo được người dùng.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingUser?.id) {
      setNotice({
        kind: "error",
        message: "Người dùng không có ID để cập nhật.",
      });
      return;
    }

    const formData = new FormData(event.currentTarget);

    const payload = cleanPayload<UpdateUserPayload>({
      username: getString(formData, "username"),
      zalo_id: getString(formData, "zalo_id"),
      avatar: getString(formData, "avatar"),
    });

    setIsSaving(true);

    try {
      const updated = await updateUser(editingUser.id, payload);

      setUsers((current) =>
        current.map((user) => (user.id === editingUser.id ? updated : user)),
      );

      setEditingUser(null);

      setNotice({
        kind: "success",
        message: "Đã cập nhật người dùng.",
      });
    } catch (error) {
      setNotice({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "Không cập nhật được người dùng.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(user: User) {
    const confirmed = window.confirm(
      `Xóa người dùng ${user.username ?? user.id}?`,
    );

    if (!confirmed) return;

    try {
      await deleteUser(user.id);

      setUsers((current) => current.filter((item) => item.id !== user.id));

      setNotice({
        kind: "success",
        message: "Đã xóa người dùng.",
      });
    } catch (error) {
      setNotice({
        kind: "error",
        message:
          error instanceof Error ? error.message : "Không xóa được người dùng.",
      });
    }
  }

  async function openDetail(user: User) {
    try {
      const detail = await getUserById(user.id);
      setDetailUser(detail);
    } catch {
      setDetailUser(user);
    }
  }

  const noticeClassName = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    error: "border-red-200 bg-red-50 text-red-700",
    info: "border-blue-200 bg-blue-50 text-blue-700",
  }[notice.kind];

  return (
    <main className="mx-auto max-w-[1288px] px-4 py-6">
      <section className="space-y-6">
        <section className="overflow-hidden rounded-[28px] border border-blue-900/10 bg-white shadow-sm">
          <div className="h-2 bg-gradient-to-r from-red-700 via-yellow-400 to-blue-900" />

          <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 p-6 text-white">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-yellow-200">
                  Users
                </div>

                <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
                  Quản lý người dùng
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-blue-100">
                  Quản lý người dùng từ dữ liệu DB qua endpoint /users.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isLoading}
                  onClick={loadUsers}
                  type="button"
                >
                  {isLoading ? "Đang tải..." : "Làm mới dữ liệu"}
                </button>

                <button
                  className="rounded-xl border border-yellow-300 bg-yellow-400 px-5 py-3 text-sm font-bold text-blue-950 transition hover:bg-yellow-300"
                  onClick={() => setIsCreateOpen(true)}
                  type="button"
                >
                  + Tạo người dùng
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
              Tổng người dùng
            </p>
            <p className="mt-3 text-3xl font-extrabold text-blue-950">
              {users.length}
            </p>
          </div>

          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-700">
              Đang hiển thị
            </p>
            <p className="mt-3 text-3xl font-extrabold text-blue-950">
              {filteredUsers.length}
            </p>
          </div>

          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">
              API dữ liệu
            </p>
            <p className="mt-3 text-2xl font-extrabold text-blue-950">/users</p>
          </div>
        </section>

        <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5">
            <div
              className={`mb-4 rounded-xl border px-4 py-3 text-sm font-medium ${noticeClassName}`}
            >
              {notice.message}
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                  GET /users
                </p>

                <h2 className="mt-2 text-xl font-extrabold text-blue-950">
                  Danh sách người dùng
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Đang hiển thị {filteredUsers.length} / {users.length} người
                  dùng.
                </p>
              </div>

              <input
                className="h-11 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm outline-none transition focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-100 lg:w-96"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm username, zalo_id..."
                value={query}
              />
            </div>
          </div>

          <div className="overflow-x-auto p-6">
            <table className="w-full min-w-[980px] border-separate border-spacing-0 text-left text-sm">
              <thead>
                <tr className="bg-blue-950 text-white">
                  <th className="rounded-l-xl px-4 py-4 font-bold">Avatar</th>
                  <th className="px-4 py-4 font-bold">ID</th>
                  <th className="px-4 py-4 font-bold">Username</th>
                  <th className="px-4 py-4 font-bold">Zalo ID</th>
                  <th className="px-4 py-4 font-bold">Ngày tạo</th>
                  <th className="px-4 py-4 font-bold">Cập nhật</th>
                  <th className="rounded-r-xl px-4 py-4 text-right font-bold">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody>
                {!isLoading
                  ? filteredUsers.map((user) => (
                      <tr
                        className="align-top text-slate-700 transition hover:bg-blue-50/60"
                        key={user.id}
                      >
                        <td className="border-b border-slate-100 px-4 py-4">
                          <div className="h-11 w-11 overflow-hidden rounded-full bg-slate-100">
                            {user.avatar ? (
                              <img
                                alt={user.username ?? "Avatar"}
                                className="h-full w-full object-cover"
                                src={user.avatar}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-500">
                                U
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="max-w-[220px] border-b border-slate-100 px-4 py-4">
                          <span className="line-clamp-2 break-words text-xs">
                            {user.id}
                          </span>
                        </td>

                        <td className="border-b border-slate-100 px-4 py-4 font-semibold text-blue-950">
                          {user.username ?? "-"}
                        </td>

                        <td className="border-b border-slate-100 px-4 py-4">
                          {user.zalo_id ?? "-"}
                        </td>

                        <td className="border-b border-slate-100 px-4 py-4">
                          {formatDate(user.createdAt)}
                        </td>

                        <td className="border-b border-slate-100 px-4 py-4">
                          {formatDate(user.updatedAt)}
                        </td>

                        <td className="border-b border-slate-100 px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="rounded-lg border border-yellow-200 bg-white px-3 py-2 text-xs font-bold text-yellow-700 transition hover:bg-yellow-50"
                              onClick={() => setEditingUser(user)}
                              type="button"
                            >
                              Sửa
                            </button>

                            <button
                              className="rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-50"
                              onClick={() => handleDelete(user)}
                              type="button"
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  : null}
              </tbody>
            </table>

            {isLoading ? (
              <div className="flex min-h-[240px] items-center justify-center text-sm text-slate-500">
                Đang tải dữ liệu...
              </div>
            ) : null}

            {!isLoading && filteredUsers.length === 0 ? (
              <div className="flex min-h-[240px] flex-col items-center justify-center text-center">
                <p className="font-bold text-blue-950">
                  Chưa có người dùng nào.
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Thử tải lại dữ liệu hoặc thay đổi từ khóa tìm kiếm.
                </p>
              </div>
            ) : null}
          </div>
        </section>
      </section>

      {isCreateOpen ? (
        <UserFormModal
          isSaving={isSaving}
          title="Tạo người dùng"
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreate}
        />
      ) : null}

      {editingUser ? (
        <UserFormModal
          isSaving={isSaving}
          title="Cập nhật người dùng"
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSubmit={handleUpdate}
        />
      ) : null}

      {detailUser ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            <div className="border-b border-slate-100 px-6 py-4">
              <h3 className="text-lg font-extrabold text-blue-950">
                Chi tiết người dùng
              </h3>
            </div>

            <div className="max-h-[70vh] overflow-auto p-6">
              <pre className="whitespace-pre-wrap rounded-xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">
                {JSON.stringify(detailUser, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end border-t border-slate-100 px-6 py-4">
              <button
                className="rounded-xl bg-blue-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
                onClick={() => setDetailUser(null)}
                type="button"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function UserFormModal({
  title,
  user,
  isSaving,
  onClose,
  onSubmit,
}: {
  title: string;
  user?: User;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  console.log("user", user);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-extrabold text-blue-950">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">
            Nhập thông tin username, zalo_id và avatar.
          </p>
        </div>

        <form className="space-y-4 p-6" onSubmit={onSubmit}>
          <div className="grid gap-4">
            <label className="block">
              <span className="text-sm font-bold text-slate-700">Username</span>
              <input
                className="mt-2 h-11 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                defaultValue={user?.username ?? ""}
                name="username"
                placeholder="tran_thi_b"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-700">Zalo ID</span>
              <input
                className="mt-2 h-11 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                defaultValue={user?.zalo_id ?? ""}
                name="zalo_id"
                placeholder="zalo_seed_002"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-700">Avatar</span>
              <input
                className="mt-2 h-11 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                defaultValue={user?.avatar ?? ""}
                name="avatar"
                placeholder="/assets/avatar-2.png"
              />
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              onClick={onClose}
              type="button"
            >
              Hủy
            </button>

            <button
              className="rounded-xl bg-blue-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
